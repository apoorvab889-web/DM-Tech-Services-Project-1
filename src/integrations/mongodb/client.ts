import { apiFetch, setAuthToken, getAuthToken } from '@/lib/api';

type User = {
  id: string;
  email: string;
  user_metadata?: Record<string, unknown>;
};

type Session = {
  access_token: string;
  user: User;
};

type QueryResult<T> = Promise<{ data: T | null; error: { message: string } | null }>;

type QueryOptions = {
  filters: Record<string, unknown>;
  orderBy?: { column: string; ascending: boolean };
  limit?: number;
  single?: boolean;
};

const listeners = new Set<(event: string, session: Session | null) => void>();
let currentSession: Session | null = null;

function emit(event: string, session: Session | null) {
  currentSession = session;
  listeners.forEach((listener) => listener(event, session));
}

async function safeRequest<T>(fn: () => Promise<T>): Promise<{ data: T | null; error: { message: string } | null }> {
  try {
    return { data: await fn(), error: null };
  } catch (error) {
    return { data: null, error: { message: error instanceof Error ? error.message : String(error) } };
  }
}

class QueryBuilder<T = unknown> implements PromiseLike<{ data: T[] | T | null; error: { message: string } | null }> {
  private readonly table: string;
  private readonly mode: 'select' | 'insert' | 'update' | 'delete' | 'upsert';
  private readonly payload?: unknown;
  private readonly opts: QueryOptions = { filters: {} };

  constructor(table: string, mode: QueryBuilder<T>['mode'], payload?: unknown) {
    this.table = table;
    this.mode = mode;
    this.payload = payload;
  }

  select(_columns = '*') { return this; }
  eq(column: string, value: unknown) { this.opts.filters[column] = value; return this; }
  order(column: string, { ascending = true }: { ascending?: boolean } = {}) { this.opts.orderBy = { column, ascending }; return this; }
  limit(value: number) { this.opts.limit = value; return this; }
  maybeSingle() { this.opts.single = true; return this; }

  async execute() {
    const query = new URLSearchParams();
    Object.entries(this.opts.filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null) query.set(`filter.${k}`, String(v));
    });
    if (this.opts.orderBy) {
      query.set('orderBy', this.opts.orderBy.column);
      query.set('ascending', String(this.opts.orderBy.ascending));
    }
    if (this.opts.limit) query.set('limit', String(this.opts.limit));
    if (this.opts.single) query.set('single', 'true');
    const qs = query.toString() ? `?${query.toString()}` : '';

    if (this.mode === 'select') {
      return safeRequest(async () => apiFetch<T[] | T>(`/data/${this.table}${qs}`));
    }
    if (this.mode === 'insert') {
      return safeRequest(async () => apiFetch<T>(`/data/${this.table}`, { method: 'POST', body: JSON.stringify(this.payload) }));
    }
    if (this.mode === 'upsert') {
      return safeRequest(async () => apiFetch<T>(`/data/${this.table}/upsert`, { method: 'POST', body: JSON.stringify(this.payload) }));
    }
    const id = this.opts.filters.id;
    if (!id) return { data: null, error: { message: 'Missing id filter for mutation' } };
    if (this.mode === 'update') {
      return safeRequest(async () => apiFetch<T>(`/data/${this.table}/${id}`, { method: 'PATCH', body: JSON.stringify(this.payload) }));
    }
    return safeRequest(async () => apiFetch<T>(`/data/${this.table}/${id}`, { method: 'DELETE' }));
  }

  then<TResult1 = { data: T[] | T | null; error: { message: string } | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: T[] | T | null; error: { message: string } | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

async function loadCurrentSession(): Promise<Session | null> {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const data = await apiFetch<{ user: User }>('/auth/me');
    return { access_token: token, user: data.user };
  } catch {
    setAuthToken(null);
    return null;
  }
}

export const dbClient = {
  auth: {
    async signInWithPassword(credentials: { email: string; password: string }) {
      return safeRequest(async () => {
        const data = await apiFetch<{ token: string; user: User }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
        });
        const session = { access_token: data.token, user: data.user };
        setAuthToken(data.token);
        emit('SIGNED_IN', session);
        return { session, user: data.user };
      }).then((r) => ({ data: r.data, error: r.error }));
    },
    async signUp(payload: { email: string; password: string; options?: Record<string, unknown> & { data?: Record<string, unknown> } }) {
      return safeRequest(async () => {
        const data = await apiFetch<{ token: string; user: User }>('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ ...payload, fullName: payload.options?.data?.full_name }),
        });
        const session = { access_token: data.token, user: data.user };
        setAuthToken(data.token);
        emit('SIGNED_IN', session);
        return { session, user: data.user };
      }).then((r) => ({ data: r.data, error: r.error }));
    },
    async signOut() {
      setAuthToken(null);
      emit('SIGNED_OUT', null);
      return { error: null };
    },
    async getSession() {
      const session = currentSession ?? await loadCurrentSession();
      currentSession = session;
      return { data: { session } };
    },
    async getUser() {
      const session = currentSession ?? await loadCurrentSession();
      currentSession = session;
      return { data: { user: session?.user ?? null } };
    },
    onAuthStateChange(callback: (event: string, session: Session | null) => void) {
      listeners.add(callback);
      return { data: { subscription: { unsubscribe: () => listeners.delete(callback) } } };
    },
    async setSession(_tokens: unknown) {
      return { data: null, error: { message: 'OAuth session restore is not supported in MongoDB mode' } };
    },
  },
  from<T = unknown>(table: string) {
    return {
      select: (_columns = '*') => new QueryBuilder<T>(table, 'select'),
      insert: (payload: unknown) => new QueryBuilder<T>(table, 'insert', payload).execute(),
      update: (payload: unknown) => new QueryBuilder<T>(table, 'update', payload),
      delete: () => new QueryBuilder<T>(table, 'delete'),
      upsert: (payload: unknown, _options?: unknown) => new QueryBuilder<T>(table, 'upsert', payload).execute(),
    };
  },
};

export type { Session, User };
