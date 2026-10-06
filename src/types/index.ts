export type UserRole = 'USER' | 'CREATOR' | 'BUSINESS' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  bio: string;
  website?: string;
  role: UserRole;
  isPrivate: boolean;
  isVerified?: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  subscriptionStatus?: 'FREE' | 'SUBSCRIBER_MONTHLY' | 'SUBSCRIBER_ANNUAL';
  createdAt: string;
  category?: string; // e.g., "Digital Creator", "Fashion & Lifestyle", "Technology Company"
}

export interface PostMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  thumbnailUrl?: string;
  duration?: number;
  isSubscriberOnly?: boolean;
  aspectRatio?: '1:1' | '4:3' | '16:9' | '9:16';
}

export interface Comment {
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

export interface Post {
  id: string;
  userId: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    isVerified?: boolean;
    role?: UserRole;
  };
  media: PostMedia[];
  caption: string;
  location?: string;
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
  comments: Comment[];
  isSponsored?: boolean;
  sponsoredBrand?: string;
  isSubscriberOnly?: boolean;
}

export interface Story {
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

export interface Reel {
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

export interface SubscriptionPlan {
  id: 'free' | 'monthly' | 'annual';
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
  isPopular?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  mediaUrl?: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: {
    text: string;
    createdAt: string;
    senderId: string;
    isRead: boolean;
  };
  unreadCount: number;
  updatedAt: string;
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'system';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  actor: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
  };
  postId?: string;
  postThumbnail?: string;
  text: string;
  createdAt: string;
  isRead: boolean;
}

export interface ReportItem {
  id: string;
  reporterUsername: string;
  targetType: 'post' | 'user' | 'comment';
  targetId: string;
  targetSummary: string;
  targetAuthor: string;
  reason: 'spam' | 'harassment' | 'hate_speech' | 'nudity' | 'misinformation';
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface CreatorAnalytics {
  impressions: number;
  reach: number;
  engagementRate: number;
  followersGrowth: number;
  topPosts: {
    id: string;
    title: string;
    impressions: number;
    engagement: number;
    thumbnail: string;
  }[];
  audienceCountries: { country: string; percentage: number }[];
}
