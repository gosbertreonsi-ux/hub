import fs from 'fs';
import path from 'path';

export interface DbUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  bio: string;
  website?: string;
  role: 'USER' | 'CREATOR' | 'BUSINESS' | 'ADMIN';
  isPrivate: boolean;
  isVerified?: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  subscriptionStatus?: 'FREE' | 'SUBSCRIBER_MONTHLY' | 'SUBSCRIBER_ANNUAL';
  createdAt: string;
  category?: string;
}

export interface DbMedia {
  id: string;
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface DbComment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface DbPost {
  id: string;
  userId: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    isVerified?: boolean;
    role?: 'USER' | 'CREATOR' | 'BUSINESS' | 'ADMIN';
  };
  media: Array<{
    id: string;
    url: string;
    type: 'image' | 'video';
    thumbnailUrl?: string;
    duration?: number;
    isSubscriberOnly?: boolean;
    aspectRatio?: '1:1' | '4:3' | '16:9' | '9:16';
  }>;
  caption: string;
  location?: string;
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
  comments: DbComment[];
  isSponsored?: boolean;
  sponsoredBrand?: string;
  isSubscriberOnly?: boolean;
  category?: string;
}

export interface DbStory {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  mediaUrl: string;
  type: 'image' | 'video';
  caption?: string;
  createdAt: string;
  expiresAt: string;
  isViewed: boolean;
}

export interface DbReel {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  videoUrl: string;
  caption: string;
  musicTitle: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  isSubscriberOnly?: boolean;
  createdAt: string;
}

export interface DbTransaction {
  id: string;
  userId: string;
  username: string;
  plan: 'monthly' | 'annual';
  amount: number;
  currency: string;
  provider: 'stripe' | 'paypal' | 'mpesa';
  status: 'succeeded' | 'pending' | 'failed';
  gatewayPaymentId: string;
  receiptNumber: string;
  createdAt: string;
  details: string;
}

export interface DbAuditLog {
  id: string;
  action: string;
  table: string;
  recordId?: string;
  details: string;
  timestamp: string;
}

export interface DatabaseSchema {
  version: number;
  lastUpdated: string;
  users: DbUser[];
  posts: DbPost[];
  media: DbMedia[];
  stories: DbStory[];
  reels: DbReel[];
  transactions: DbTransaction[];
  auditLogs: DbAuditLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'mizizi_db.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initial rich seed users
const INITIAL_SEED_USERS: DbUser[] = [
  {
    id: 'user_gosbert',
    username: 'gosbert_reonsi',
    displayName: 'Gosbert Reonsi',
    email: 'gosbert@mizizi.social',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'Architecting digital roots & visual stories across Africa. Co-founder @ MIZIZI. 📍 Dar es Salaam / Nairobi',
    website: 'https://mizizi.social',
    role: 'USER',
    isPrivate: false,
    isVerified: true,
    followersCount: 1420,
    followingCount: 382,
    postsCount: 18,
    status: 'ACTIVE',
    subscriptionStatus: 'FREE',
    category: 'Product Builder & Explorer',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'user_amani',
    username: 'amani_fashion',
    displayName: 'Amani Studio',
    email: 'contact@amanistudio.africa',
    avatarUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&auto=format&fit=crop&q=80',
    bio: 'Contemporary East African couture & avant-garde textiles. Rooted in tradition, tailored for the world. 🌿✨',
    website: 'https://amanistudio.africa',
    role: 'CREATOR',
    isPrivate: false,
    isVerified: true,
    followersCount: 42800,
    followingCount: 215,
    postsCount: 134,
    status: 'ACTIVE',
    subscriptionStatus: 'SUBSCRIBER_MONTHLY',
    category: 'Fashion & Style',
    createdAt: '2026-02-01T12:00:00Z',
  },
  {
    id: 'user_serengeti',
    username: 'serengeti_wild',
    displayName: 'Serengeti Conservation',
    email: 'wildlife@serengeti.org',
    avatarUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=200&auto=format&fit=crop&q=80',
    bio: 'Protecting Africa’s wildest sanctuary. Daily glimpses into the Great Migration, predator territories, and habitat preservation.',
    website: 'https://serengetitrust.org',
    role: 'CREATOR',
    isPrivate: false,
    isVerified: true,
    followersCount: 96300,
    followingCount: 104,
    postsCount: 412,
    status: 'ACTIVE',
    subscriptionStatus: 'SUBSCRIBER_ANNUAL',
    category: 'Wildlife & Nature',
    createdAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 'user_kigali_arch',
    username: 'kigali_design',
    displayName: 'Atelier Urbanism',
    email: 'studio@atelierkigali.rw',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: 'Biophilic architecture & sustainable urban spaces. Transforming African skylines with rammed earth and solar bamboo. 🏛️🌱',
    website: 'https://atelierkigali.rw',
    role: 'CREATOR',
    isPrivate: false,
    isVerified: true,
    followersCount: 31400,
    followingCount: 180,
    postsCount: 88,
    status: 'ACTIVE',
    subscriptionStatus: 'SUBSCRIBER_MONTHLY',
    category: 'Architecture & Design',
    createdAt: '2026-01-20T09:00:00Z',
  },
  {
    id: 'user_swahili_chef',
    username: 'chef_fatuma',
    displayName: 'Fatuma Al-Kindy',
    email: 'fatuma@swahilicuisine.tz',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    bio: 'Michelin-recognized Swahili gastronomy. Spicing coastal traditions with modern culinary art. Stone Town & Dubai.',
    website: 'https://fatuma.kitchen',
    role: 'CREATOR',
    isPrivate: false,
    isVerified: true,
    followersCount: 58900,
    followingCount: 320,
    postsCount: 215,
    status: 'ACTIVE',
    subscriptionStatus: 'SUBSCRIBER_ANNUAL',
    category: 'Cuisine & Gastronomy',
    createdAt: '2026-01-10T14:00:00Z',
  },
  {
    id: 'user_silicon_savannah',
    username: 'savannah_tech',
    displayName: 'Silicon Savannah Pulse',
    email: 'editors@savannahtech.io',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&auto=format&fit=crop&q=80',
    bio: 'Covering Africa’s venture landscape, AI breakthroughs, fintech unicorns, and tech engineering hubs from Nairobi to Lagos. 💻⚡',
    website: 'https://savannahtech.io',
    role: 'BUSINESS',
    isPrivate: false,
    isVerified: true,
    followersCount: 82400,
    followingCount: 145,
    postsCount: 340,
    status: 'ACTIVE',
    subscriptionStatus: 'SUBSCRIBER_ANNUAL',
    category: 'Technology & Startups',
    createdAt: '2026-01-08T11:00:00Z',
  },
];

// Rich, diverse seed posts covering the algorithmic feed
const INITIAL_SEED_POSTS: DbPost[] = [
  {
    id: 'post_1',
    userId: 'user_gosbert',
    author: {
      id: 'user_gosbert',
      username: 'gosbert_reonsi',
      displayName: 'Gosbert Reonsi',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isVerified: true,
      role: 'USER',
    },
    media: [
      {
        id: 'media_1',
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1080&auto=format&fit=crop&q=85',
        type: 'image',
        aspectRatio: '1:1',
      },
    ],
    caption: 'Golden dusk over the Indian Ocean. Reflections of heritage and endless horizons. 🌅🌊 #Zanzibar #Tanzania #Serenity #Mizizi',
    location: 'Nungwi Beach, Zanzibar',
    hashtags: ['Zanzibar', 'Tanzania', 'Serenity', 'Mizizi'],
    likesCount: 542,
    commentsCount: 28,
    sharesCount: 64,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    isLiked: false,
    isSaved: false,
    category: 'Travel & Nature',
    comments: [
      {
        id: 'c_1',
        postId: 'post_1',
        userId: 'user_amani',
        username: 'amani_fashion',
        userAvatar: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&auto=format&fit=crop&q=80',
        content: 'Breathtaking light! The Indian Ocean never fails to inspire.',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        likesCount: 18,
      },
    ],
    isSubscriberOnly: false,
  },
  {
    id: 'post_2',
    userId: 'user_amani',
    author: {
      id: 'user_amani',
      username: 'amani_fashion',
      displayName: 'Amani Studio',
      avatarUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&auto=format&fit=crop&q=80',
      isVerified: true,
      role: 'CREATOR',
    },
    media: [
      {
        id: 'media_2',
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1080&auto=format&fit=crop&q=85',
        type: 'image',
        aspectRatio: '4:3',
      },
    ],
    caption: 'Harmonizing indigo tie-dye cotton with hand-spun raw silk. Autumn Lookbook premiere. ✨👑 #AfricanFashion #HauteCouture #Handmade',
    location: 'Kariakoo Artisan Quarter, Dar es Salaam',
    hashtags: ['AfricanFashion', 'HauteCouture', 'Handmade'],
    likesCount: 1890,
    commentsCount: 92,
    sharesCount: 145,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    isLiked: false,
    isSaved: false,
    category: 'Fashion & Style',
    comments: [],
    isSubscriberOnly: false,
  },
  {
    id: 'post_3',
    userId: 'user_serengeti',
    author: {
      id: 'user_serengeti',
      username: 'serengeti_wild',
      displayName: 'Serengeti Conservation',
      avatarUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=200&auto=format&fit=crop&q=80',
      isVerified: true,
      role: 'CREATOR',
    },
    media: [
      {
        id: 'media_3',
        url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1080&auto=format&fit=crop&q=85',
        type: 'image',
        aspectRatio: '16:9',
        isSubscriberOnly: true,
      },
    ],
    caption: 'EXCLUSIVE 4K CAPTURE: Dawn patrol over the Grumeti River crossing. A solitary pride preparing for the migration surge. 🦁🐾 #Serengeti #Wildlife #VIPExclusive',
    location: 'Serengeti National Park, Tanzania',
    hashtags: ['Serengeti', 'Wildlife', 'VIPExclusive'],
    likesCount: 3410,
    commentsCount: 184,
    sharesCount: 420,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    isLiked: false,
    isSaved: false,
    category: 'Wildlife & Nature',
    comments: [],
    isSubscriberOnly: true,
  },
  {
    id: 'post_4',
    userId: 'user_kigali_arch',
    author: {
      id: 'user_kigali_arch',
      username: 'kigali_design',
      displayName: 'Atelier Urbanism',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      isVerified: true,
      role: 'CREATOR',
    },
    media: [
      {
        id: 'media_4',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1080&auto=format&fit=crop&q=85',
        type: 'image',
        aspectRatio: '1:1',
      },
    ],
    caption: 'Light, ventilation, and terracotta screens. Our eco-sustainable cultural pavilion blends ancient craftsmanship with solar thermal architecture. 🌿🏗️ #Architecture #Sustainability #Kigali',
    location: 'Kigali Innovation City, Rwanda',
    hashtags: ['Architecture', 'Sustainability', 'Kigali'],
    likesCount: 980,
    commentsCount: 47,
    sharesCount: 78,
    createdAt: new Date(Date.now() - 3600000 * 9).toISOString(),
    isLiked: false,
    isSaved: false,
    category: 'Architecture & Design',
    comments: [],
    isSubscriberOnly: false,
  },
  {
    id: 'post_5',
    userId: 'user_swahili_chef',
    author: {
      id: 'user_swahili_chef',
      username: 'chef_fatuma',
      displayName: 'Fatuma Al-Kindy',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      isVerified: true,
      role: 'CREATOR',
    },
    media: [
      {
        id: 'media_5',
        url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1080&auto=format&fit=crop&q=85',
        type: 'image',
        aspectRatio: '1:1',
      },
    ],
    caption: 'Swahili Coconut Crab Curry infused with cardamon, roasted cloves from Pemba, and crushed lemongrass. Served with steamed aromatic cassava bread. 🥥🦀 #SwahiliFood #CulinaryHeritage #ZanzibarSpices',
    location: 'Stone Town Secret Courtyard, Zanzibar',
    hashtags: ['SwahiliFood', 'CulinaryHeritage', 'ZanzibarSpices'],
    likesCount: 2240,
    commentsCount: 130,
    sharesCount: 198,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    isLiked: false,
    isSaved: false,
    category: 'Cuisine & Gastronomy',
    comments: [],
    isSubscriberOnly: false,
  },
  {
    id: 'post_6',
    userId: 'user_silicon_savannah',
    author: {
      id: 'user_silicon_savannah',
      username: 'savannah_tech',
      displayName: 'Silicon Savannah Pulse',
      avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&auto=format&fit=crop&q=80',
      isVerified: true,
      role: 'BUSINESS',
    },
    media: [
      {
        id: 'media_6',
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1080&auto=format&fit=crop&q=85',
        type: 'image',
        aspectRatio: '16:9',
      },
    ],
    caption: 'BREAKING: African tech ecosystem surpasses $3.8B in annual seed & growth investments. Local founders leading solar micro-grids and decentralized financial networks. 💻📈 #TechAfrica #SiliconSavannah #Venture',
    location: 'Nairobi Tech District, Kenya',
    hashtags: ['TechAfrica', 'SiliconSavannah', 'Venture'],
    likesCount: 1620,
    commentsCount: 88,
    sharesCount: 230,
    createdAt: new Date(Date.now() - 3600000 * 15).toISOString(),
    isLiked: false,
    isSaved: false,
    category: 'Technology & Startups',
    comments: [],
    isSubscriberOnly: false,
  },
  {
    id: 'post_7',
    userId: 'user_gosbert',
    author: {
      id: 'user_gosbert',
      username: 'gosbert_reonsi',
      displayName: 'Gosbert Reonsi',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isVerified: true,
      role: 'USER',
    },
    media: [
      {
        id: 'media_7',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1080&auto=format&fit=crop&q=85',
        type: 'image',
        aspectRatio: '4:3',
      },
    ],
    caption: 'Mount Kilimanjaro emerging above the cloud layer at 5,895 meters. A humbling reminder of our earth’s ancient resilience. 🏔️✨ #Kilimanjaro #Tanzania #PeakExpedition',
    location: 'Uhuru Peak, Kilimanjaro',
    hashtags: ['Kilimanjaro', 'Tanzania', 'PeakExpedition'],
    likesCount: 4210,
    commentsCount: 210,
    sharesCount: 380,
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    isLiked: false,
    isSaved: false,
    category: 'Travel & Nature',
    comments: [],
    isSubscriberOnly: false,
  },
  {
    id: 'post_8',
    userId: 'user_amani',
    author: {
      id: 'user_amani',
      username: 'amani_fashion',
      displayName: 'Amani Studio',
      avatarUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&auto=format&fit=crop&q=80',
      isVerified: true,
      role: 'CREATOR',
    },
    media: [
      {
        id: 'media_8',
        url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1080&auto=format&fit=crop&q=85',
        type: 'image',
        aspectRatio: '1:1',
        isSubscriberOnly: true,
      },
    ],
    caption: 'VIP SUBSCRIBER EXCLUSIVE: Behind-the-scenes cutting session for Paris Fashion Week. Pure Kitenge weave styled with Italian linen lining. 👑🪡 #HauteCouture #VIPPass',
    location: 'Amani Atelier, Dar es Salaam',
    hashtags: ['HauteCouture', 'VIPPass'],
    likesCount: 2890,
    commentsCount: 165,
    sharesCount: 210,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    isLiked: false,
    isSaved: false,
    category: 'Fashion & Style',
    comments: [],
    isSubscriberOnly: true,
  },
];

const INITIAL_SEED_STORIES: DbStory[] = [
  {
    id: 'story_1',
    userId: 'user_gosbert',
    username: 'gosbert_reonsi',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    caption: 'Sunset swim in Zanzibar 🌊',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 21).toISOString(),
    isViewed: false,
  },
  {
    id: 'story_2',
    userId: 'user_amani',
    username: 'amani_fashion',
    userAvatar: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    caption: 'Behind the scenes fittings ✂️',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 20).toISOString(),
    isViewed: false,
  },
  {
    id: 'story_3',
    userId: 'user_serengeti',
    username: 'serengeti_wild',
    userAvatar: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=200&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    caption: 'Morning patrol 🦁',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 23).toISOString(),
    isViewed: false,
  },
  {
    id: 'story_4',
    userId: 'user_swahili_chef',
    username: 'chef_fatuma',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    type: 'image',
    caption: 'Fresh spice harvest in Pemba 🌿',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 22).toISOString(),
    isViewed: false,
  },
];

const INITIAL_SEED_REELS: DbReel[] = [
  {
    id: 'reel_1',
    userId: 'user_serengeti',
    username: 'serengeti_wild',
    userAvatar: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=200&auto=format&fit=crop&q=80',
    videoUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1080&auto=format&fit=crop&q=80',
    caption: 'Sunrise over the endless plains of the Serengeti. Pure untamed beauty. 🦁🐘',
    musicTitle: 'Original Audio — Serengeti Ambient',
    likesCount: 4210,
    commentsCount: 198,
    sharesCount: 312,
    viewsCount: 32000,
    isLiked: false,
    isSaved: false,
    isSubscriberOnly: false,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'reel_2',
    userId: 'user_amani',
    username: 'amani_fashion',
    userAvatar: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&auto=format&fit=crop&q=80',
    videoUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1080&auto=format&fit=crop&q=80',
    caption: 'Draping royal indigo fabric live from the studio floor. ✨👗',
    musicTitle: 'Amapiano Grooves — East Africa Mix',
    likesCount: 6890,
    commentsCount: 340,
    sharesCount: 520,
    viewsCount: 54000,
    isLiked: false,
    isSaved: false,
    isSubscriberOnly: false,
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
];

const INITIAL_SEED_TRANSACTIONS: DbTransaction[] = [
  {
    id: 'tx_seed_1',
    userId: 'user_amani',
    username: 'amani_fashion',
    plan: 'monthly',
    amount: 4.99,
    currency: 'USD',
    provider: 'stripe',
    status: 'succeeded',
    gatewayPaymentId: 'ch_3N4yXj2eZvKYlo2C1g9L2k7M',
    receiptNumber: 'INV-2026-0081',
    createdAt: '2026-02-01T12:05:00Z',
    details: 'VIP Creator Pass Monthly (Recurring Subscription)',
  },
  {
    id: 'tx_seed_2',
    userId: 'user_serengeti',
    username: 'serengeti_wild',
    plan: 'annual',
    amount: 49.99,
    currency: 'USD',
    provider: 'mpesa',
    status: 'succeeded',
    gatewayPaymentId: 'MPESA-QRT8929104',
    receiptNumber: 'INV-2026-0042',
    createdAt: '2026-01-05T08:15:00Z',
    details: 'VIP Creator Pass Annual via Vodacom M-Pesa Enterprise',
  },
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.posts)) {
          // ensure transactions array exists
          if (!Array.isArray(parsed.transactions)) {
            parsed.transactions = INITIAL_SEED_TRANSACTIONS;
          }
          return parsed;
        }
      }
    } catch (err) {
      console.error('[DB] Failed to load existing database file, initializing fresh:', err);
    }

    const initialDb: DatabaseSchema = {
      version: 1,
      lastUpdated: new Date().toISOString(),
      users: INITIAL_SEED_USERS,
      posts: INITIAL_SEED_POSTS,
      media: [],
      stories: INITIAL_SEED_STORIES,
      reels: INITIAL_SEED_REELS,
      transactions: INITIAL_SEED_TRANSACTIONS,
      auditLogs: [
        {
          id: `log_${Date.now()}`,
          action: 'INIT',
          table: 'SYSTEM',
          details: 'Database initialized with diverse posts and real payment ledger',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    this.saveDirect(initialDb);
    return initialDb;
  }

  private saveDirect(dbData: DatabaseSchema) {
    try {
      dbData.lastUpdated = new Date().toISOString();
      fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Error writing database to disk:', err);
    }
  }

  private persist() {
    this.saveDirect(this.data);
  }

  public logAudit(action: string, table: string, recordId?: string, details: string = '') {
    const log: DbAuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      action,
      table,
      recordId,
      details,
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 250) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 250);
    }
    this.persist();
  }

  // ==========================================================================
  // USERS
  // ==========================================================================
  public getUsers(): DbUser[] {
    return this.data.users;
  }

  public getUserById(id: string): DbUser | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByUsername(username: string): DbUser | undefined {
    return this.data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  public getUserByEmail(email: string): DbUser | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: DbUser): DbUser {
    this.data.users.push(user);
    this.logAudit('INSERT', 'users', user.id, `Created user @${user.username}`);
    this.persist();
    return user;
  }

  public updateUser(id: string, updates: Partial<DbUser>): DbUser | null {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.logAudit('UPDATE', 'users', id, `Updated fields: ${Object.keys(updates).join(', ')}`);
    this.persist();
    return this.data.users[idx];
  }

  public deleteUser(id: string): boolean {
    const prevLen = this.data.users.length;
    this.data.users = this.data.users.filter(u => u.id !== id);
    if (this.data.users.length < prevLen) {
      this.data.posts = this.data.posts.filter(p => p.userId !== id);
      this.data.reels = this.data.reels.filter(r => r.userId !== id);
      this.data.stories = this.data.stories.filter(s => s.userId !== id);
      this.data.posts.forEach(p => {
        p.comments = p.comments.filter(c => c.userId !== id);
        p.commentsCount = p.comments.length;
      });
      this.logAudit('DELETE', 'users', id, 'Permanently deleted user and all content');
      this.persist();
      return true;
    }
    return false;
  }

  // ==========================================================================
  // POSTS & ALGORITHM FEED ENGINE
  // ==========================================================================
  public getPosts(options?: {
    algorithm?: 'for-you' | 'following' | 'trending' | 'exclusive' | 'local';
    userId?: string;
    category?: string;
    tag?: string;
  }): DbPost[] {
    let posts = [...this.data.posts];

    // Filter by category or tag if requested
    if (options?.category && options.category !== 'all') {
      posts = posts.filter(p => p.category?.toLowerCase() === options.category?.toLowerCase());
    }
    if (options?.tag) {
      const cleanTag = options.tag.replace('#', '').toLowerCase();
      posts = posts.filter(p => p.hashtags?.some(h => h.toLowerCase() === cleanTag));
    }

    const algo = options?.algorithm || 'for-you';

    if (algo === 'exclusive') {
      return posts.filter(p => p.isSubscriberOnly);
    }

    if (algo === 'local') {
      const localKeywords = ['tanzania', 'zanzibar', 'serengeti', 'dar es salaam', 'kilimanjaro', 'kenya', 'rwanda', 'nairobi'];
      return posts.filter(p => {
        const loc = (p.location || '').toLowerCase();
        return localKeywords.some(kw => loc.includes(kw));
      });
    }

    if (algo === 'trending') {
      // Engagement velocity formula: (likes + comments*2 + shares*3) / (ageHours + 2)^1.2
      const now = Date.now();
      return posts.sort((a, b) => {
        const ageA = Math.max(0.5, (now - new Date(a.createdAt).getTime()) / 3600000);
        const ageB = Math.max(0.5, (now - new Date(b.createdAt).getTime()) / 3600000);
        const scoreA = (a.likesCount + a.commentsCount * 2 + a.sharesCount * 3) / Math.pow(ageA + 2, 1.2);
        const scoreB = (b.likesCount + b.commentsCount * 2 + b.sharesCount * 3) / Math.pow(ageB + 2, 1.2);
        return scoreB - scoreA;
      });
    }

    if (algo === 'for-you') {
      // Algorithmic discovery recommendation engine
      const now = Date.now();
      return posts.sort((a, b) => {
        const ageHoursA = Math.max(0.2, (now - new Date(a.createdAt).getTime()) / 3600000);
        const ageHoursB = Math.max(0.2, (now - new Date(b.createdAt).getTime()) / 3600000);

        // Engagement base score
        const engA = a.likesCount * 1.5 + a.commentsCount * 3.0 + a.sharesCount * 4.0;
        const engB = b.likesCount * 1.5 + b.commentsCount * 3.0 + b.sharesCount * 4.0;

        // Author authority bonus (verified authors get 1.25x boost)
        const authorBoostA = a.author?.isVerified ? 1.25 : 1.0;
        const authorBoostB = b.author?.isVerified ? 1.25 : 1.0;

        // Multimedia bonus (multi-image carousel or video gets 1.1x boost)
        const mediaBoostA = (a.media?.length || 1) > 1 || a.media?.[0]?.type === 'video' ? 1.15 : 1.0;
        const mediaBoostB = (b.media?.length || 1) > 1 || b.media?.[0]?.type === 'video' ? 1.15 : 1.0;

        // Time decay
        const scoreA = ((engA + 15) * authorBoostA * mediaBoostA) / Math.pow(ageHoursA + 1, 0.85);
        const scoreB = ((engB + 15) * authorBoostB * mediaBoostB) / Math.pow(ageHoursB + 1, 0.85);

        return scoreB - scoreA;
      });
    }

    return posts;
  }

  public getPostById(id: string): DbPost | undefined {
    return this.data.posts.find(p => p.id === id);
  }

  public createPost(post: DbPost): DbPost {
    this.data.posts.unshift(post);
    const user = this.getUserById(post.userId);
    if (user) {
      user.postsCount = (user.postsCount || 0) + 1;
    }
    this.logAudit('INSERT', 'posts', post.id, `Created post with ${post.media.length} media`);
    this.persist();
    return post;
  }

  public deletePost(id: string): boolean {
    const post = this.getPostById(id);
    const prevLen = this.data.posts.length;
    this.data.posts = this.data.posts.filter(p => p.id !== id);
    if (this.data.posts.length < prevLen) {
      if (post) {
        const user = this.getUserById(post.userId);
        if (user && user.postsCount > 0) {
          user.postsCount -= 1;
        }
      }
      this.logAudit('DELETE', 'posts', id, 'Deleted post');
      this.persist();
      return true;
    }
    return false;
  }

  public toggleLikePost(postId: string, userId: string): { likesCount: number; isLiked: boolean } | null {
    const post = this.getPostById(postId);
    if (!post) return null;
    post.isLiked = !post.isLiked;
    post.likesCount = post.isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1);
    this.logAudit('UPDATE', 'posts', postId, `Like toggled: now ${post.likesCount}`);
    this.persist();
    return { likesCount: post.likesCount, isLiked: post.isLiked };
  }

  public toggleSavePost(postId: string): { isSaved: boolean } | null {
    const post = this.getPostById(postId);
    if (!post) return null;
    post.isSaved = !post.isSaved;
    this.logAudit('UPDATE', 'posts', postId, `Save toggled: ${post.isSaved}`);
    this.persist();
    return { isSaved: post.isSaved };
  }

  public addComment(postId: string, comment: DbComment): DbComment | null {
    const post = this.getPostById(postId);
    if (!post) return null;
    post.comments.push(comment);
    post.commentsCount = post.comments.length;
    this.logAudit('INSERT', 'comments', comment.id, `Added comment on post ${postId}`);
    this.persist();
    return comment;
  }

  public deleteComment(postId: string, commentId: string): boolean {
    const post = this.getPostById(postId);
    if (!post) return false;
    const prev = post.comments.length;
    post.comments = post.comments.filter(c => c.id !== commentId);
    post.commentsCount = post.comments.length;
    this.logAudit('DELETE', 'comments', commentId, `Removed comment from post ${postId}`);
    this.persist();
    return post.comments.length < prev;
  }

  // ==========================================================================
  // STORIES & REELS
  // ==========================================================================
  public getStories(): DbStory[] {
    return this.data.stories;
  }

  public createStory(story: DbStory): DbStory {
    this.data.stories.unshift(story);
    this.logAudit('INSERT', 'stories', story.id, `Added story for @${story.username}`);
    this.persist();
    return story;
  }

  public markStoryViewed(storyId: string): boolean {
    const s = this.data.stories.find(x => x.id === storyId);
    if (s) {
      s.isViewed = true;
      this.persist();
      return true;
    }
    return false;
  }

  public getReels(): DbReel[] {
    return this.data.reels;
  }

  public createReel(reel: DbReel): DbReel {
    this.data.reels.unshift(reel);
    this.logAudit('INSERT', 'reels', reel.id, `Created reel for @${reel.username}`);
    this.persist();
    return reel;
  }

  public toggleLikeReel(reelId: string): { likesCount: number; isLiked: boolean } | null {
    const r = this.data.reels.find(x => x.id === reelId);
    if (!r) return null;
    r.isLiked = !r.isLiked;
    r.likesCount = r.isLiked ? r.likesCount + 1 : Math.max(0, r.likesCount - 1);
    this.logAudit('UPDATE', 'reels', reelId, `Reel like toggled: ${r.likesCount}`);
    this.persist();
    return { likesCount: r.likesCount, isLiked: r.isLiked };
  }

  // ==========================================================================
  // MEDIA (Uploaded Photos & Videos directly to disk/DB)
  // ==========================================================================
  public saveMedia(media: DbMedia): DbMedia {
    this.data.media.unshift(media);
    this.logAudit('INSERT', 'media', media.id, `Stored media: ${media.filename} (${media.size} bytes)`);
    this.persist();
    return media;
  }

  public getMedia(): DbMedia[] {
    return this.data.media;
  }

  // ==========================================================================
  // REAL PAYMENT TRANSACTIONS & SUBSCRIPTIONS
  // ==========================================================================
  public createTransaction(tx: DbTransaction): DbTransaction {
    this.data.transactions.unshift(tx);
    // If successful, elevate user subscription status
    if (tx.status === 'succeeded') {
      const user = this.getUserById(tx.userId);
      if (user) {
        user.subscriptionStatus = tx.plan === 'annual' ? 'SUBSCRIBER_ANNUAL' : 'SUBSCRIBER_MONTHLY';
      }
    }
    this.logAudit('INSERT', 'transactions', tx.id, `Recorded ${tx.provider.toUpperCase()} payment for ${tx.amount} ${tx.currency}`);
    this.persist();
    return tx;
  }

  public getTransactions(userId?: string): DbTransaction[] {
    if (userId) {
      return this.data.transactions.filter(t => t.userId === userId);
    }
    return this.data.transactions;
  }

  public updateTransaction(id: string, updates: Partial<DbTransaction>): DbTransaction | null {
    const idx = this.data.transactions.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.transactions[idx] = { ...this.data.transactions[idx], ...updates };
    this.logAudit('UPDATE', 'transactions', id, `Updated transaction status to ${updates.status}`);
    this.persist();
    return this.data.transactions[idx];
  }

  // ==========================================================================
  // AUDIT LOGS & METRICS
  // ==========================================================================
  public getAuditLogs(): DbAuditLog[] {
    return this.data.auditLogs;
  }

  public getMetrics() {
    return {
      status: 'ONLINE',
      engine: 'Persistent Local SQL-Compatible JSON Engine (Ready for Docker Postgres)',
      dbFile: DB_FILE,
      uploadsDir: UPLOADS_DIR,
      counts: {
        users: this.data.users.length,
        posts: this.data.posts.length,
        media: this.data.media.length,
        stories: this.data.stories.length,
        reels: this.data.reels.length,
        transactions: this.data.transactions.length,
        auditLogs: this.data.auditLogs.length,
      },
      lastUpdated: this.data.lastUpdated,
      totalRevenueUSD: this.data.transactions
        .filter(t => t.status === 'succeeded')
        .reduce((sum, t) => sum + (t.amount || 0), 0),
    };
  }

  // SQL DUMP GENERATOR (Ready for Docker PostgreSQL / MySQL import)
  public generateSqlDump(): string {
    const lines: string[] = [];
    lines.push('-- ========================================================');
    lines.push('-- MIZIZI SOCIAL DOCKER POSTGRESQL / SQL DATABASE DUMP');
    lines.push(`-- Generated: ${new Date().toISOString()}`);
    lines.push('-- ========================================================\n');
    lines.push('BEGIN;\n');

    // Users table
    lines.push(`
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(64) UNIQUE NOT NULL,
    display_name VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    website VARCHAR(255),
    role VARCHAR(32) DEFAULT 'USER',
    is_private BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    posts_count INT DEFAULT 0,
    status VARCHAR(32) DEFAULT 'ACTIVE',
    subscription_status VARCHAR(64) DEFAULT 'FREE',
    category VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`);

    // Transactions table
    lines.push(`
CREATE TABLE IF NOT EXISTS payment_transactions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(64) NOT NULL,
    plan VARCHAR(32) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    provider VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL,
    gateway_payment_id VARCHAR(128),
    receipt_number VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);
`);

    // Posts table
    lines.push(`
CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    caption TEXT,
    location VARCHAR(255),
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    is_subscriber_only BOOLEAN DEFAULT FALSE,
    category VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`);

    // Media table
    lines.push(`
CREATE TABLE IF NOT EXISTS post_media (
    id VARCHAR(64) PRIMARY KEY,
    post_id VARCHAR(64) REFERENCES posts(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    type VARCHAR(32) NOT NULL,
    aspect_ratio VARCHAR(32) DEFAULT '1:1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`);

    // Comments table
    lines.push(`
CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR(64) PRIMARY KEY,
    post_id VARCHAR(64) REFERENCES posts(id) ON DELETE CASCADE,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(64) NOT NULL,
    user_avatar TEXT,
    content TEXT NOT NULL,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`);

    // Insert user rows
    for (const u of this.data.users) {
      lines.push(
        `INSERT INTO users (id, username, display_name, email, avatar_url, bio, website, role, is_private, is_verified, followers_count, following_count, posts_count, status, subscription_status, category, created_at) VALUES (` +
          `'${this.escapeSql(u.id)}', '${this.escapeSql(u.username)}', '${this.escapeSql(u.displayName)}', '${this.escapeSql(u.email)}', '${this.escapeSql(u.avatarUrl)}', '${this.escapeSql(u.bio)}', '${this.escapeSql(u.website || '')}', '${this.escapeSql(u.role)}', ${u.isPrivate ? 'TRUE' : 'FALSE'}, ${u.isVerified ? 'TRUE' : 'FALSE'}, ${u.followersCount || 0}, ${u.followingCount || 0}, ${u.postsCount || 0}, '${this.escapeSql(u.status)}', '${this.escapeSql(u.subscriptionStatus || 'FREE')}', '${this.escapeSql(u.category || '')}', '${u.createdAt}'` +
          `) ON CONFLICT (id) DO UPDATE SET subscription_status = EXCLUDED.subscription_status, posts_count = EXCLUDED.posts_count;\n`
      );
    }

    // Insert post rows
    for (const p of this.data.posts) {
      lines.push(
        `INSERT INTO posts (id, user_id, caption, location, likes_count, comments_count, shares_count, is_subscriber_only, category, created_at) VALUES (` +
          `'${this.escapeSql(p.id)}', '${this.escapeSql(p.userId)}', '${this.escapeSql(p.caption)}', '${this.escapeSql(p.location || '')}', ${p.likesCount || 0}, ${p.commentsCount || 0}, ${p.sharesCount || 0}, ${p.isSubscriberOnly ? 'TRUE' : 'FALSE'}, '${this.escapeSql(p.category || 'General')}', '${p.createdAt}'` +
          `) ON CONFLICT (id) DO NOTHING;\n`
      );

      for (const m of p.media || []) {
        lines.push(
          `INSERT INTO post_media (id, post_id, url, type, aspect_ratio) VALUES (` +
            `'${this.escapeSql(m.id)}', '${this.escapeSql(p.id)}', '${this.escapeSql(m.url)}', '${this.escapeSql(m.type)}', '${this.escapeSql(m.aspectRatio || '1:1')}'` +
            `) ON CONFLICT (id) DO NOTHING;\n`
        );
      }

      for (const c of p.comments || []) {
        lines.push(
          `INSERT INTO comments (id, post_id, user_id, username, user_avatar, content, likes_count, created_at) VALUES (` +
            `'${this.escapeSql(c.id)}', '${this.escapeSql(p.id)}', '${this.escapeSql(c.userId)}', '${this.escapeSql(c.username)}', '${this.escapeSql(c.userAvatar)}', '${this.escapeSql(c.content)}', ${c.likesCount || 0}, '${c.createdAt}'` +
            `) ON CONFLICT (id) DO NOTHING;\n`
        );
      }
    }

    lines.push('COMMIT;\n');
    return lines.join('\n');
  }

  private escapeSql(str: string): string {
    if (!str) return '';
    return str.replace(/'/g, "''");
  }
}

export const db = new Database();
