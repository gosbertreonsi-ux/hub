import { User, Post, Story, Reel, UserRole } from '../types';

export interface PaymentPlan {
  id: 'monthly' | 'annual';
  name: string;
  priceUSD: number;
  priceTZS: number;
  priceKES: number;
  billingCycle: 'monthly' | 'annual';
  features: string[];
  badge?: string;
  savings?: string;
}

export interface PaymentConfig {
  gateways: {
    stripe: {
      enabled: boolean;
      isLiveKeyProvided: boolean;
      publishableKey: string;
      supportedMethods: string[];
    };
    paypal: {
      enabled: boolean;
      isLiveKeyProvided: boolean;
      clientId: string;
    };
    mpesa: {
      enabled: boolean;
      isLiveKeyProvided: boolean;
      supportedCarriers: string[];
    };
  };
  currencies: {
    primary: string;
    rates: Record<string, number>;
  };
  environment: string;
  message: string;
}

export interface TransactionRecord {
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

export interface DatabaseMetrics {
  status: string;
  engine: string;
  dbFile: string;
  uploadsDir: string;
  counts: {
    users: number;
    posts: number;
    media: number;
    stories: number;
    reels: number;
    transactions: number;
    auditLogs: number;
  };
  lastUpdated: string;
  totalRevenueUSD: number;
}

class ApiService {
  private baseUrl = '';

  private async fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const res = await fetch(`${this.baseUrl}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
      });

      if (!res.ok) {
        let errBody: any;
        try {
          errBody = await res.json();
        } catch {
          // ignore
        }
        throw new Error(errBody?.error || `HTTP ${res.status}: ${res.statusText}`);
      }

      return await res.json();
    } catch (err: any) {
      console.warn(`[API] Network or server error on ${url}:`, err.message);
      throw err;
    }
  }

  // ==========================================================================
  // MEDIA UPLOAD DIRECT TO DISK & DB
  // ==========================================================================
  public async uploadMedia(
    fileOrBase64: File | Blob | string,
    filename?: string
  ): Promise<{ url: string; media?: any }> {
    if (typeof fileOrBase64 === 'string') {
      // Base64 payload
      const res = await this.fetchJson<{ success: boolean; url: string; media: any }>(
        '/api/upload',
        {
          method: 'POST',
          body: JSON.stringify({
            base64Data: fileOrBase64,
            filename: filename || `upload_${Date.now()}.jpg`,
          }),
        }
      );
      return res;
    } else {
      // Multipart FormData
      const formData = new FormData();
      formData.append('file', fileOrBase64, filename || (fileOrBase64 as File).name || 'upload.jpg');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }
      return await res.json();
    }
  }

  // ==========================================================================
  // POSTS & ALGORITHMIC FEEDS
  // ==========================================================================
  public async getPosts(options?: {
    algorithm?: 'for-you' | 'following' | 'trending' | 'exclusive' | 'local';
    category?: string;
    tag?: string;
    userId?: string;
  }): Promise<{ posts: Post[]; algorithm: string; total: number }> {
    const params = new URLSearchParams();
    if (options?.algorithm) params.set('algorithm', options.algorithm);
    if (options?.category) params.set('category', options.category);
    if (options?.tag) params.set('tag', options.tag);
    if (options?.userId) params.set('userId', options.userId);

    const query = params.toString() ? `?${params.toString()}` : '';
    return await this.fetchJson<{ posts: Post[]; algorithm: string; total: number }>(`/api/posts${query}`);
  }

  public async createPost(postData: {
    userId: string;
    caption: string;
    mediaUrl: string;
    mediaType?: 'image' | 'video';
    location?: string;
    hashtags?: string[];
    isSubscriberOnly?: boolean;
  }): Promise<{ success: boolean; post: Post }> {
    return await this.fetchJson<{ success: boolean; post: Post }>('/api/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  public async deletePost(postId: string): Promise<{ success: boolean }> {
    return await this.fetchJson<{ success: boolean }>(`/api/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  public async toggleLikePost(postId: string, userId: string): Promise<{ likesCount: number; isLiked: boolean }> {
    return await this.fetchJson(`/api/posts/${postId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  public async toggleSavePost(postId: string): Promise<{ isSaved: boolean }> {
    return await this.fetchJson(`/api/posts/${postId}/save`, {
      method: 'POST',
    });
  }

  public async addComment(postId: string, userId: string, content: string): Promise<{ success: boolean; comment: any }> {
    return await this.fetchJson(`/api/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ userId, content }),
    });
  }

  public async deleteComment(postId: string, commentId: string): Promise<{ success: boolean }> {
    return await this.fetchJson(`/api/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  // ==========================================================================
  // USERS, AUTH & DELETION
  // ==========================================================================
  public async getUsers(): Promise<{ users: User[] }> {
    return await this.fetchJson<{ users: User[] }>('/api/users');
  }

  public async register(payload: {
    username: string;
    displayName: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
    role?: UserRole;
  }): Promise<{ success: boolean; user: User }> {
    return await this.fetchJson<{ success: boolean; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async login(identifier: string): Promise<{ success: boolean; user: User }> {
    return await this.fetchJson<{ success: boolean; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    });
  }

  public async updateUser(userId: string, updates: Partial<User>): Promise<{ success: boolean; user: User }> {
    return await this.fetchJson<{ success: boolean; user: User }>(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  public async deleteAccount(userId: string): Promise<{ success: boolean; message: string }> {
    return await this.fetchJson<{ success: boolean; message: string }>(`/api/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // ==========================================================================
  // REAL PAYMENT GATEWAYS & SUBSCRIPTIONS
  // ==========================================================================
  public async getPaymentConfig(): Promise<PaymentConfig> {
    return await this.fetchJson<PaymentConfig>('/api/payments/config');
  }

  public async getPaymentPlans(): Promise<{ plans: PaymentPlan[] }> {
    return await this.fetchJson<{ plans: PaymentPlan[] }>('/api/payments/plans');
  }

  public async createPaymentIntent(params: {
    userId: string;
    plan: 'monthly' | 'annual';
    provider: 'stripe' | 'paypal' | 'mpesa';
    phone?: string;
    email?: string;
  }): Promise<{
    success: boolean;
    paymentIntentId: string;
    clientSecret: string;
    amount: number;
    currency: string;
    instructions: string;
  }> {
    return await this.fetchJson('/api/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  public async verifyPayment(params: {
    userId: string;
    plan: 'monthly' | 'annual';
    provider: 'stripe' | 'paypal' | 'mpesa';
    paymentIntentId?: string;
    phone?: string;
    receiptEmail?: string;
  }): Promise<{
    success: boolean;
    transaction: TransactionRecord;
    user: User;
    invoice: {
      receiptNumber: string;
      transactionId: string;
      amount: string;
      plan: string;
      provider: string;
      date: string;
      billedTo: string;
      email: string;
    };
  }> {
    return await this.fetchJson('/api/payments/verify', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  public async getUserTransactions(userId: string): Promise<{ transactions: TransactionRecord[]; total: number }> {
    return await this.fetchJson(`/api/payments/transactions/${userId}`);
  }

  // ==========================================================================
  // STORIES & REELS
  // ==========================================================================
  public async getStories(): Promise<{ stories: Story[] }> {
    return await this.fetchJson<{ stories: Story[] }>('/api/stories');
  }

  public async createStory(story: {
    userId: string;
    mediaUrl: string;
    caption?: string;
    type?: 'image' | 'video';
  }): Promise<{ success: boolean; story: Story }> {
    return await this.fetchJson('/api/stories', {
      method: 'POST',
      body: JSON.stringify(story),
    });
  }

  public async getReels(): Promise<{ reels: Reel[] }> {
    return await this.fetchJson<{ reels: Reel[] }>('/api/reels');
  }

  public async createReel(reel: {
    userId: string;
    videoUrl: string;
    caption: string;
    musicTitle?: string;
    isSubscriberOnly?: boolean;
  }): Promise<{ success: boolean; reel: Reel }> {
    return await this.fetchJson('/api/reels', {
      method: 'POST',
      body: JSON.stringify(reel),
    });
  }

  public async toggleLikeReel(reelId: string): Promise<{ likesCount: number; isLiked: boolean }> {
    return await this.fetchJson(`/api/reels/${reelId}/like`, {
      method: 'POST',
    });
  }

  // ==========================================================================
  // DATABASE METRICS & AUDIT LOGS
  // ==========================================================================
  public async getDatabaseMetrics(): Promise<DatabaseMetrics> {
    return await this.fetchJson<DatabaseMetrics>('/api/database/metrics');
  }

  public async getAuditLogs(): Promise<{ logs: any[] }> {
    return await this.fetchJson<{ logs: any[] }>('/api/database/logs');
  }
}

export const api = new ApiService();
