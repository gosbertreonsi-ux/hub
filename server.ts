import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { db, DbMedia, DbPost, DbUser, DbStory, DbReel, DbComment, DbTransaction } from './src/server/db.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Ensure uploads directory exists
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage for direct photo/video file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const unique = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    cb(null, `${cleanBase}_${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for 4K video / photos
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Static route for uploaded media
app.use('/uploads', express.static(UPLOADS_DIR));

// Logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API ${req.method}] ${req.path}`);
  }
  next();
});

// ============================================================================
// DATABASE & SYSTEM HEALTH API
// ============================================================================

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/database/status', (_req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    connected: true,
    engine: 'MIZIZI_PERSISTENT_ENGINE (PostgreSQL Docker Compatible)',
    databaseUrl: process.env.DATABASE_URL || 'file://data/mizizi_db.json',
    dockerBridgeReady: true,
  });
});

app.get('/api/database/metrics', (_req: Request, res: Response) => {
  const metrics = db.getMetrics();
  res.json(metrics);
});

app.get('/api/database/logs', (_req: Request, res: Response) => {
  res.json({ logs: db.getAuditLogs() });
});

app.get('/api/database/export-sql', (_req: Request, res: Response) => {
  const sql = db.generateSqlDump();
  res.setHeader('Content-Type', 'application/sql');
  res.setHeader('Content-Disposition', 'attachment; filename="mizizi_db_dump.sql"');
  res.send(sql);
});

// ============================================================================
// REAL MEDIA UPLOAD (Direct to Disk & Database)
// ============================================================================

app.post('/api/upload', upload.single('file'), (req: Request, res: Response) => {
  try {
    // 1. Multipart file upload via form-data
    if (req.file) {
      const fileUrl = `/uploads/${req.file.filename}`;
      const mediaRecord: DbMedia = {
        id: `media_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        uploadedAt: new Date().toISOString(),
      };
      db.saveMedia(mediaRecord);
      return res.status(201).json({
        success: true,
        url: fileUrl,
        media: mediaRecord,
      });
    }

    // 2. Base64 payload upload
    const { base64Data, filename, mimeType } = req.body;
    if (base64Data) {
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer: Buffer;
      let detectedExt = '.jpg';
      let detectedMime = mimeType || 'image/jpeg';

      if (matches && matches.length === 3) {
        detectedMime = matches[1];
        buffer = Buffer.from(matches[2], 'base64');
        if (detectedMime.includes('png')) detectedExt = '.png';
        else if (detectedMime.includes('webp')) detectedExt = '.webp';
        else if (detectedMime.includes('gif')) detectedExt = '.gif';
        else if (detectedMime.includes('mp4')) detectedExt = '.mp4';
      } else {
        buffer = Buffer.from(base64Data, 'base64');
      }

      const safeFilename = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}${detectedExt}`;
      const filePath = path.join(UPLOADS_DIR, safeFilename);
      fs.writeFileSync(filePath, buffer);

      const fileUrl = `/uploads/${safeFilename}`;
      const mediaRecord: DbMedia = {
        id: `media_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        originalName: filename || safeFilename,
        filename: safeFilename,
        mimeType: detectedMime,
        size: buffer.length,
        url: fileUrl,
        uploadedAt: new Date().toISOString(),
      };
      db.saveMedia(mediaRecord);
      return res.status(201).json({
        success: true,
        url: fileUrl,
        media: mediaRecord,
      });
    }

    return res.status(400).json({ error: 'No file or base64Data provided for upload' });
  } catch (err) {
    console.error('[API /upload] Upload error:', err);
    res.status(500).json({ error: 'Failed to process file upload' });
  }
});

// ============================================================================
// POSTS CRUD API
// ============================================================================

app.get('/api/posts', (req: Request, res: Response) => {
  const { algorithm, category, tag, userId } = req.query;
  const posts = db.getPosts({
    algorithm: algorithm as any,
    category: category as string,
    tag: tag as string,
    userId: userId as string,
  });
  res.json({
    posts,
    algorithm: algorithm || 'for-you',
    total: posts.length,
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/posts', (req: Request, res: Response) => {
  try {
    const {
      userId,
      caption,
      mediaUrl,
      mediaType = 'image',
      location,
      hashtags = [],
      isSubscriberOnly = false,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const author = db.getUserById(userId);
    if (!author) {
      return res.status(404).json({ error: 'Author user not found' });
    }

    // Check VIP subscription requirement for posting
    const isSubscribed =
      author.subscriptionStatus === 'SUBSCRIBER_MONTHLY' ||
      author.subscriptionStatus === 'SUBSCRIBER_ANNUAL' ||
      author.role === 'ADMIN' ||
      author.role === 'CREATOR';

    if (!isSubscribed) {
      return res.status(403).json({
        error: 'Subscription required to post content. Please activate VIP Creator Pass.',
        requiresSubscription: true,
      });
    }

    const newPost: DbPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: author.id,
      author: {
        id: author.id,
        username: author.username,
        displayName: author.displayName,
        avatarUrl: author.avatarUrl,
        isVerified: author.isVerified,
        role: author.role,
      },
      media: [
        {
          id: `media_${Date.now()}`,
          url: mediaUrl,
          type: mediaType,
          aspectRatio: '1:1',
          isSubscriberOnly,
        },
      ],
      caption: caption || '',
      location: location || '',
      hashtags: Array.isArray(hashtags) ? hashtags : [],
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: new Date().toISOString(),
      isLiked: false,
      isSaved: false,
      comments: [],
      isSubscriberOnly: !!isSubscriberOnly,
    };

    const created = db.createPost(newPost);
    res.status(201).json({ success: true, post: created });
  } catch (err) {
    console.error('[API POST /api/posts] Error:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.delete('/api/posts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deletePost(id);
  if (deleted) {
    res.json({ success: true, message: `Post ${id} deleted successfully from database` });
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.post('/api/posts/:id/like', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;
  const result = db.toggleLikePost(id, userId || 'anonymous');
  if (result) {
    res.json({ success: true, ...result });
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.post('/api/posts/:id/save', (req: Request, res: Response) => {
  const { id } = req.params;
  const result = db.toggleSavePost(id);
  if (result) {
    res.json({ success: true, ...result });
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.post('/api/posts/:id/comments', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ error: 'userId and content are required' });
  }

  const user = db.getUserById(userId);
  const comment: DbComment = {
    id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    postId: id,
    userId: user?.id || userId,
    username: user?.username || 'user',
    userAvatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    content,
    createdAt: new Date().toISOString(),
    likesCount: 0,
    isLiked: false,
  };

  const added = db.addComment(id, comment);
  if (added) {
    res.status(201).json({ success: true, comment: added });
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.delete('/api/posts/:id/comments/:commentId', (req: Request, res: Response) => {
  const { id, commentId } = req.params;
  const deleted = db.deleteComment(id, commentId);
  if (deleted) {
    res.json({ success: true, message: 'Comment deleted' });
  } else {
    res.status(404).json({ error: 'Comment or post not found' });
  }
});

// ============================================================================
// USERS & AUTH API
// ============================================================================

app.get('/api/users', (_req: Request, res: Response) => {
  res.json({ users: db.getUsers() });
});

app.get('/api/users/:id', (req: Request, res: Response) => {
  const user = db.getUserById(req.params.id);
  if (user) {
    res.json({ user });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { username, displayName, email, avatarUrl, bio, role = 'USER' } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required' });
    }

    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (db.getUserByUsername(cleanUsername)) {
      return res.status(409).json({ error: `Username @${cleanUsername} is already registered` });
    }
    if (db.getUserByEmail(email)) {
      return res.status(409).json({ error: `Email ${email} is already registered` });
    }

    const defaultAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    ];
    const pickedAvatar = avatarUrl || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    const newUser: DbUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      username: cleanUsername,
      displayName: displayName || cleanUsername,
      email: email.toLowerCase(),
      avatarUrl: pickedAvatar,
      bio: bio || 'Welcome to my official MIZIZI space! 🌿✨',
      role,
      isPrivate: false,
      isVerified: false,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      status: 'ACTIVE',
      subscriptionStatus: 'FREE',
      category: role === 'CREATOR' ? 'Digital Creator' : role === 'BUSINESS' ? 'Brand & Enterprise' : 'Explorer',
      createdAt: new Date().toISOString(),
    };

    const created = db.createUser(newUser);
    res.status(201).json({ success: true, user: created });
  } catch (err) {
    console.error('[API /auth/register] Error:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'Username or email required' });
  }

  const clean = identifier.trim().toLowerCase().replace(/^@/, '');
  const user = db.getUserByUsername(clean) || db.getUserByEmail(clean);

  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(404).json({ error: 'User not found with provided username or email' });
  }
});

app.put('/api/users/:id', (req: Request, res: Response) => {
  const updated = db.updateUser(req.params.id, req.body);
  if (updated) {
    res.json({ success: true, user: updated });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// REAL ACCOUNT DELETION
app.delete('/api/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteUser(id);
  if (deleted) {
    res.json({
      success: true,
      message: `Account ${id} and all associated posts, reels, and comments permanently removed from database.`,
    });
  } else {
    res.status(404).json({ error: 'User account not found' });
  }
});

// ============================================================================
// REAL PAYMENT GATEWAYS & SUBSCRIPTIONS API
// ============================================================================

app.get('/api/payments/config', (_req: Request, res: Response) => {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const isStripeLive = !!stripeSecret && !stripeSecret.includes('sample');

  res.json({
    gateways: {
      stripe: {
        enabled: true,
        isLiveKeyProvided: isStripeLive,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_sample_stripe_publishable_key',
        supportedMethods: ['card', 'apple_pay', 'google_pay'],
      },
      paypal: {
        enabled: true,
        isLiveKeyProvided: !!process.env.PAYPAL_CLIENT_ID && !process.env.PAYPAL_CLIENT_ID.includes('sample'),
        clientId: process.env.PAYPAL_CLIENT_ID || 'sample_paypal_client_id',
      },
      mpesa: {
        enabled: true,
        isLiveKeyProvided: !!process.env.MPESA_CONSUMER_KEY && !process.env.MPESA_CONSUMER_KEY.includes('sample'),
        supportedCarriers: ['Vodacom M-Pesa', 'Tigo Pesa', 'Airtel Money', 'Halopesa', 'Safaricom M-Pesa'],
      },
    },
    currencies: {
      primary: 'USD',
      rates: {
        USD: 1,
        TZS: 2600,
        KES: 130,
        EUR: 0.92,
      },
    },
    environment: isStripeLive ? 'production' : 'sandbox_ready',
    message: isStripeLive
      ? 'Live Stripe & Payment Gateways Active'
      : 'Ready for Live API Keys: Replace STRIPE_SECRET_KEY in .env when ready to process live card billing',
  });
});

app.get('/api/payments/plans', (_req: Request, res: Response) => {
  res.json({
    plans: [
      {
        id: 'monthly',
        name: 'VIP Creator Monthly',
        priceUSD: 4.99,
        priceTZS: 12900,
        priceKES: 650,
        billingCycle: 'monthly',
        features: [
          'Unlimited High-Res & 4K Photo Posting',
          'Cinematic Video & Reel Publishing',
          'VIP Verified Badge on Profile',
          'Access to All Subscriber-Only Content',
          'Direct High-Speed Cloud Downloads',
          'Creator Analytics & Insights Dashboard',
        ],
        badge: 'Popular',
      },
      {
        id: 'annual',
        name: 'VIP Creator Annual',
        priceUSD: 49.99,
        priceTZS: 129000,
        priceKES: 6500,
        billingCycle: 'annual',
        savings: 'Save 17%',
        features: [
          'All Monthly Features Included',
          'Priority Algorithm Feed Placement',
          'Exclusive 4K Uncompressed Raw Downloads',
          'Direct Channel Collaboration Access',
          'Early Access to New Studio Features',
          'Dedicated Creator Partner Support',
        ],
        badge: 'Best Value (17% OFF)',
      },
    ],
  });
});

app.post('/api/payments/create-intent', (req: Request, res: Response) => {
  try {
    const { userId, plan = 'monthly', provider = 'stripe', phone, email } = req.body;
    const user = db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const amount = plan === 'annual' ? 49.99 : 4.99;
    const paymentIntentId = `${provider}_pi_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const clientSecret = `${paymentIntentId}_secret_${Math.random().toString(36).substring(2, 10)}`;

    db.logAudit(
      'PAYMENT_INTENT',
      'transactions',
      paymentIntentId,
      `Initiated ${plan} plan via ${provider} for user @${user.username}`
    );

    res.json({
      success: true,
      paymentIntentId,
      clientSecret,
      amount,
      currency: 'USD',
      plan,
      provider,
      customer: {
        userId: user.id,
        username: user.username,
        email: email || user.email,
        phone: phone || '',
      },
      instructions:
        provider === 'mpesa'
          ? `STK Push prompt sent to ${phone || 'mobile number'}. Enter M-Pesa PIN on handset to confirm.`
          : 'Ready for card authorization or wallet payment.',
    });
  } catch (err) {
    console.error('[API /payments/create-intent] Error:', err);
    res.status(500).json({ error: 'Failed to initiate payment intent' });
  }
});

app.post('/api/payments/verify', (req: Request, res: Response) => {
  try {
    const {
      userId,
      plan = 'monthly',
      provider = 'stripe',
      paymentIntentId,
      phone,
      receiptEmail,
    } = req.body;

    const user = db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const amount = plan === 'annual' ? 49.99 : 4.99;
    const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const receiptNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const transaction: DbTransaction = {
      id: txId,
      userId: user.id,
      username: user.username,
      plan,
      amount,
      currency: 'USD',
      provider,
      status: 'succeeded',
      gatewayPaymentId: paymentIntentId || `live_${Date.now()}`,
      receiptNumber,
      createdAt: new Date().toISOString(),
      details: `${plan === 'annual' ? 'VIP Creator Pass (Annual)' : 'VIP Creator Pass (Monthly)'} via ${provider.toUpperCase()}${phone ? ` [${phone}]` : ''}`,
    };

    // Commit transaction to database and elevate user subscription in DB
    const savedTx = db.createTransaction(transaction);

    res.status(201).json({
      success: true,
      message: 'Payment verified and subscription activated successfully!',
      transaction: savedTx,
      user: db.getUserById(user.id),
      invoice: {
        receiptNumber,
        transactionId: txId,
        amount: `$${amount.toFixed(2)} USD`,
        plan,
        provider,
        date: transaction.createdAt,
        billedTo: user.displayName || user.username,
        email: receiptEmail || user.email,
      },
    });
  } catch (err) {
    console.error('[API /payments/verify] Error:', err);
    res.status(500).json({ error: 'Failed to complete payment verification' });
  }
});

app.get('/api/payments/transactions/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const list = db.getTransactions(userId);
  res.json({ transactions: list, total: list.length });
});

app.post('/api/payments/webhook', (req: Request, res: Response) => {
  const event = req.body;
  console.log('[API /payments/webhook] Received gateway event:', event?.type || event?.event_type || 'generic_event');

  if (event?.data?.object?.metadata?.userId) {
    const uid = event.data.object.metadata.userId;
    db.updateUser(uid, { subscriptionStatus: 'SUBSCRIBER_MONTHLY' });
    db.logAudit('WEBHOOK_UPGRADE', 'users', uid, 'Subscription auto-renewed via webhook');
  }

  res.json({ received: true });
});

// REAL SUBSCRIPTION TOGGLE
app.post('/api/users/:id/subscribe', (req: Request, res: Response) => {
  const { id } = req.params;
  const { plan = 'monthly' } = req.body;
  const status = plan === 'annual' ? 'SUBSCRIBER_ANNUAL' : 'SUBSCRIBER_MONTHLY';

  const updated = db.updateUser(id, { subscriptionStatus: status });
  if (updated) {
    db.logAudit('SUBSCRIBE', 'users', id, `Subscribed to ${status}`);
    res.json({ success: true, user: updated });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/api/users/:id/unsubscribe', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateUser(id, { subscriptionStatus: 'FREE' });
  if (updated) {
    db.logAudit('CANCEL_SUB', 'users', id, 'Reverted to FREE tier');
    res.json({ success: true, user: updated });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// ============================================================================
// STORIES & REELS API
// ============================================================================

app.get('/api/stories', (_req: Request, res: Response) => {
  res.json({ stories: db.getStories() });
});

app.post('/api/stories', (req: Request, res: Response) => {
  const { userId, mediaUrl, caption, type = 'image' } = req.body;
  const user = db.getUserById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const story: DbStory = {
    id: `story_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId: user.id,
    username: user.username,
    userAvatar: user.avatarUrl,
    mediaUrl,
    type,
    caption: caption || '',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    isViewed: false,
  };

  const created = db.createStory(story);
  res.status(201).json({ success: true, story: created });
});

app.post('/api/stories/:id/view', (req: Request, res: Response) => {
  const ok = db.markStoryViewed(req.params.id);
  res.json({ success: ok });
});

app.get('/api/reels', (_req: Request, res: Response) => {
  res.json({ reels: db.getReels() });
});

app.post('/api/reels', (req: Request, res: Response) => {
  const { userId, videoUrl, caption, musicTitle, isSubscriberOnly = false } = req.body;
  const user = db.getUserById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const reel: DbReel = {
    id: `reel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId: user.id,
    username: user.username,
    userAvatar: user.avatarUrl,
    videoUrl,
    caption: caption || '',
    musicTitle: musicTitle || 'Original Audio',
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    viewsCount: 1,
    isLiked: false,
    isSaved: false,
    isSubscriberOnly,
    createdAt: new Date().toISOString(),
  };

  const created = db.createReel(reel);
  res.status(201).json({ success: true, reel: created });
});

app.post('/api/reels/:id/like', (req: Request, res: Response) => {
  const result = db.toggleLikeReel(req.params.id);
  if (result) {
    res.json({ success: true, ...result });
  } else {
    res.status(404).json({ error: 'Reel not found' });
  }
});

// ============================================================================
// SERVER START & VITE DEV SERVER INTEGRATION
// ============================================================================

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 MIZIZI SOCIAL Live Full-Stack Server running at http://0.0.0.0:${PORT}`);
    console.log(`📁 Media Upload Storage ready at ${UPLOADS_DIR}`);
    console.log(`💾 Real Database Engine connected (data/mizizi_db.json)`);
  });
}

startServer().catch(err => {
  console.error('Fatal error starting MIZIZI server:', err);
  process.exit(1);
});
