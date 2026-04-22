import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 4000);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dmtech';
const JWT_SECRET = process.env.JWT_SECRET || 'dmtech-dev-secret';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '';
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGINS || [
  CLIENT_ORIGIN,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8081',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:8081',
].join(','))
  .split(',')
  .map((v) => v.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
    const isVercelDomain = /^https:\/\/.*\.vercel\.app$/.test(origin);

    if (isLocalhost || isVercelDomain || CLIENT_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, index: true },
  passwordHash: { type: String, required: true },
  fullName: String,
  roles: { type: [String], default: ['client'] },
  avatarUrl: String,
}, { timestamps: true });

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, unique: true, index: true, required: true },
  full_name: String,
  avatar_url: String,
  company: String,
  phone: String,
  bio: String,
}, { timestamps: true });

const serviceSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true, index: true },
  description: String,
  category: String,
  price: Number,
  image_url: String,
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
}, { timestamps: true });

const blogSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true, index: true },
  excerpt: String,
  content: String,
  cover_image: String,
  tags: [String],
  author_id: String,
  published: { type: Boolean, default: false },
  published_at: Date,
}, { timestamps: true });

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  business_type: String,
  budget: String,
  message: String,
  status: { type: String, default: 'new' },
  user_id: String,
}, { timestamps: true });

const testimonialSchema = new mongoose.Schema({
  client_name: String,
  company: String,
  role: String,
  feedback: String,
  rating: Number,
  avatar_url: String,
  featured: { type: Boolean, default: true },
}, { timestamps: true });

const newsletterSchema = new mongoose.Schema({
  email: { type: String, unique: true, index: true },
  source: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Profile = mongoose.model('Profile', profileSchema);
const Service = mongoose.model('Service', serviceSchema);
const Blog = mongoose.model('Blog', blogSchema);
const Lead = mongoose.model('Lead', leadSchema);
const Testimonial = mongoose.model('Testimonial', testimonialSchema);
const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', newsletterSchema);

const TABLES = {
  profiles: Profile,
  user_roles: User,
  services: Service,
  blogs: Blog,
  leads: Lead,
  testimonials: Testimonial,
  newsletter_subscribers: NewsletterSubscriber,
};

function signToken(user) {
  return jwt.sign({ sub: String(user._id), email: user.email, roles: user.roles }, JWT_SECRET, { expiresIn: '7d' });
}

function toUserPayload(user) {
  return { id: String(user._id), email: user.email, user_metadata: { full_name: user.fullName || '' } };
}

function mapDoc(doc, table) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  const base = { ...obj, id: String(obj._id), created_at: obj.createdAt, updated_at: obj.updatedAt };
  delete base._id; delete base.__v; delete base.createdAt; delete base.updatedAt;
  if (table === 'profiles') {
    return { ...base, id: String(obj.userId) };
  }
  if (table === 'user_roles') {
    return (obj.roles || []).map((role) => ({ user_id: String(obj._id), role }));
  }
  return base;
}

async function auth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.sub);
    if (user) req.user = user;
  } catch {}
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user?.roles?.includes('admin')) return res.status(403).json({ error: 'Admin access required' });
  next();
}

app.use(auth);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) return res.status(400).json({ error: 'An account with this email already exists' });
    const count = await User.countDocuments();
    const user = await User.create({
      email: String(email).toLowerCase(),
      passwordHash: await bcrypt.hash(String(password), 10),
      fullName: fullName || '',
      roles: count === 0 ? ['admin', 'client'] : ['client'],
    });
    await Profile.create({ userId: user._id, full_name: fullName || '' });
    const token = signToken(user);
    res.json({ token, user: toUserPayload(user) });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });
    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid email or password' });
    const token = signToken(user);
    res.json({ token, user: toUserPayload(user) });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Login failed' });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  res.json({ user: toUserPayload(req.user) });
});

function buildMongoQuery(table, req) {
  const filters = Object.entries(req.query)
    .filter(([key]) => key.startsWith('filter.'))
    .reduce((acc, [key, value]) => {
      const cleanKey = key.replace('filter.', '');
      acc[cleanKey] = value === 'true' ? true : value === 'false' ? false : value;
      return acc;
    }, {});

  if (table === 'profiles' && filters.id) {
    filters.userId = filters.id;
    delete filters.id;
  }
  if (table === 'user_roles' && filters.user_id) {
    filters._id = filters.user_id;
    delete filters.user_id;
  }
  return filters;
}

app.get('/api/data/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const Model = TABLES[table];
    if (!Model) return res.status(404).json({ error: 'Unknown table' });

    if (table === 'user_roles' || table === 'profiles' || (table === 'leads' && req.user)) {
      if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    }

    const filters = buildMongoQuery(table, req);
    let query;
    if (table === 'user_roles') {
      query = Model.find(filters);
    } else {
      query = Model.find(filters);
    }

    const orderBy = req.query.orderBy;
    if (orderBy) {
      query = query.sort({ [orderBy]: req.query.ascending === 'false' ? -1 : 1 });
    }
    if (req.query.limit) {
      query = query.limit(Number(req.query.limit));
    }

    let docs = await query.exec();

    if (table === 'leads' && req.user && !req.user.roles.includes('admin')) {
      docs = docs.filter((lead) => String(lead.user_id || '') === String(req.user._id));
    }

    let data = docs.flatMap((doc) => mapDoc(doc, table));
    if (req.query.single === 'true') data = data[0] || null;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Fetch failed' });
  }
});

app.post('/api/data/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const Model = TABLES[table];
    if (!Model) return res.status(404).json({ error: 'Unknown table' });

    if (['services', 'blogs'].includes(table) && !req.user?.roles?.includes('admin')) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    if (table === 'profiles' && !req.user) return res.status(401).json({ error: 'Authentication required' });

    if (table === 'newsletter_subscribers') {
      const existing = await NewsletterSubscriber.findOne({ email: String(req.body.email).toLowerCase() });
      if (existing) return res.json(mapDoc(existing, table));
    }

    if (table === 'leads') {
      req.body.status = req.body.status || 'new';
      if (req.user) req.body.user_id = String(req.user._id);
    }

    const doc = await Model.create(req.body);
    res.json(mapDoc(doc, table));
  } catch (error) {
    res.status(500).json({ error: error.message || 'Create failed' });
  }
});

app.post('/api/data/:table/upsert', requireAuth, async (req, res) => {
  try {
    const { table } = req.params;
    if (table !== 'profiles') return res.status(400).json({ error: 'Upsert is only enabled for profiles' });
    const payload = req.body || {};
    const doc = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { ...payload, userId: req.user._id },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    if (payload.full_name) {
      req.user.fullName = payload.full_name;
      await req.user.save();
    }
    res.json(mapDoc(doc, table));
  } catch (error) {
    res.status(500).json({ error: error.message || 'Upsert failed' });
  }
});

app.patch('/api/data/:table/:id', requireAuth, async (req, res) => {
  try {
    const { table, id } = req.params;
    const Model = TABLES[table];
    if (!Model) return res.status(404).json({ error: 'Unknown table' });
    if (['services', 'blogs'].includes(table)) {
      if (!req.user.roles.includes('admin')) return res.status(403).json({ error: 'Admin access required' });
    }
    if (table === 'leads' && !req.user.roles.includes('admin')) return res.status(403).json({ error: 'Admin access required' });

    const doc = await Model.findByIdAndUpdate(id, req.body, { new: true });
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json(mapDoc(doc, table));
  } catch (error) {
    res.status(500).json({ error: error.message || 'Update failed' });
  }
});

app.delete('/api/data/:table/:id', requireAuth, async (req, res) => {
  try {
    const { table, id } = req.params;
    const Model = TABLES[table];
    if (!Model) return res.status(404).json({ error: 'Unknown table' });
    if (!req.user.roles.includes('admin')) return res.status(403).json({ error: 'Admin access required' });
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json(mapDoc(doc, table));
  } catch (error) {
    res.status(500).json({ error: error.message || 'Delete failed' });
  }
});

async function seed() {
  if (await Service.countDocuments() === 0) {
    await Service.insertMany([
      { title: 'Web Development', slug: 'web-development', description: 'Modern websites and web apps built for performance, conversion, and scale.', category: 'Build', price: 1500, featured: true, published: true },
      { title: 'SEO', slug: 'seo', description: 'Technical SEO, content strategy, and authority building for long-term growth.', category: 'Growth', price: 1200, featured: true, published: true },
      { title: 'Social Media', slug: 'social-media', description: 'Content, paid media, and community management across modern platforms.', category: 'Marketing', price: 1000, featured: true, published: true },
      { title: 'Branding', slug: 'branding', description: 'Identity systems, messaging, and visual direction that stand out.', category: 'Creative', price: 1800, featured: false, published: true },
      { title: 'AI Solutions', slug: 'ai-solutions', description: 'Chatbots, AI automations, and custom workflow integrations.', category: 'AI', price: 2500, featured: true, published: true },
      { title: 'Analytics', slug: 'analytics', description: 'Dashboards, funnel analysis, attribution, and reporting foundations.', category: 'Data', price: 900, featured: false, published: true },
    ]);
  }
  const blogSeeds = [
    {
      title: 'Why your website needs Core Web Vitals in 2026',
      slug: 'why-your-website-needs-core-web-vitals-in-2026',
      excerpt: 'Speed is a ranking signal and a conversion lever. Here is where to optimize first.',
      content: 'Core Web Vitals are no longer a nice-to-have. They directly influence discoverability, engagement, and revenue. Start with page speed, image optimization, script trimming, and layout stability improvements.',
      tags: ['Performance', 'SEO', 'Web'],
      published: true,
      published_at: new Date('2026-04-18T08:00:00Z'),
    },
    {
      title: 'Modern marketing playbook: 5 channels worth your budget',
      slug: 'modern-marketing-playbook-5-channels-worth-your-budget',
      excerpt: 'A practical guide to the channels that still produce compounding returns.',
      content: 'In 2026, strong marketing stacks combine SEO, lifecycle email, social proof content, paid search, and community-driven distribution. The exact mix depends on sales cycle and average contract value.',
      tags: ['Marketing', 'Strategy'],
      published: true,
      published_at: new Date('2026-04-17T08:00:00Z'),
    },
    {
      title: 'AI workflows that save marketers 10 hours a week',
      slug: 'ai-workflows-that-save-marketers-10-hours-a-week',
      excerpt: 'A practical look at automation flows that reduce manual work across content, reporting, and lead handling.',
      content: 'The best AI workflows do not replace strategy — they remove repetitive work. Start with content repurposing, reporting summaries, lead qualification, FAQ automation, and internal knowledge retrieval. When mapped correctly, these workflows give teams more time for creative direction and growth experiments.',
      tags: ['AI', 'Automation', 'Marketing'],
      published: true,
      published_at: new Date('2026-04-16T08:00:00Z'),
    },
  ];

  await Blog.bulkWrite(
    blogSeeds.map((post) => ({
      updateOne: {
        filter: { slug: post.slug },
        update: { $setOnInsert: post },
        upsert: true,
      },
    }))
  );
  if (await Testimonial.countDocuments() === 0) {
    await Testimonial.insertMany([
      { client_name: 'Aarav Patel', company: 'Nova Commerce', role: 'Founder', feedback: 'DM + Tech completely modernized our funnel and doubled our qualified leads in under three months.', rating: 5, featured: true },
      { client_name: 'Maya Chen', company: 'BrightLabs', role: 'Marketing Lead', feedback: 'The team combined design, SEO, and analytics in one execution stream. It felt like an in-house growth squad.', rating: 5, featured: true },
    ]);
  }
}

mongoose.connect(MONGODB_URI)
  .then(async () => {
    await seed();
    app.listen(PORT, () => {
      console.log(`Mongo API running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  });
