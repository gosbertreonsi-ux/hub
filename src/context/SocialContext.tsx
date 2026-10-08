import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Post,
  Story,
  Reel,
  Conversation,
  Message,
  NotificationItem,
  ReportItem,
  UserRole,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_REELS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS,
} from '../data/seedData';

type ActiveView =
  | 'feed'
  | 'explore'
  | 'reels'
  | 'messages'
  | 'notifications'
  | 'profile'
  | 'creator'
  | 'admin'
  | 'settings';

interface SocialContextType {
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Navigation
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  viewingProfileUserId: string | null;
  setViewingProfileUserId: (id: string | null) => void;
  openUserProfile: (userId: string) => void;

  // Auth / Current User
  currentUser: User;
  switchUser: (userId: string) => void;
  updateCurrentUserProfile: (updates: Partial<User>) => void;
  login: (emailOrUsername: string) => boolean;
  register: (username: string, displayName: string, email: string, avatarUrl?: string, bio?: string, role?: UserRole) => boolean;
  deleteAccount: (userId?: string) => void;
  logout: () => void;
  allUsers: User[];
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isDeleteAccountModalOpen: boolean;
  setIsDeleteAccountModalOpen: (open: boolean) => void;
  userToDeleteId: string | null;
  setUserToDeleteId: (id: string | null) => void;

  // Posts & Interactions
  posts: Post[];
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  createPost: (caption: string, mediaUrl: string, location?: string, hashtags?: string[], mediaType?: 'image' | 'video', isSubscriberOnly?: boolean) => void;
  deletePost: (postId: string) => void;

  // Follow System
  followingUserIds: string[];
  toggleFollowUser: (targetUserId: string) => void;
  isFollowing: (targetUserId: string) => boolean;

  // Stories
  stories: Story[];
  activeStoryIndex: number | null;
  setActiveStoryIndex: (index: number | null) => void;
  addStory: (mediaUrl: string, caption?: string) => void;
  markStoryViewed: (storyId: string) => void;

  // Reels
  reels: Reel[];
  createReel: (videoUrl: string, caption: string, musicTitle?: string, isSubscriberOnly?: boolean) => void;
  toggleLikeReel: (reelId: string) => void;
  toggleSaveReel: (reelId: string) => void;

  // Messaging
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  messages: Record<string, Message[]>;
  sendMessage: (conversationId: string, text: string) => void;
  startDirectMessage: (targetUserId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Modals & Creation
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isDownloadModalOpen: boolean;
  setIsDownloadModalOpen: (open: boolean) => void;
  isSubscriptionModalOpen: boolean;
  setIsSubscriptionModalOpen: (open: boolean) => void;

  // Business & Subscription (Paywall)
  isSubscribed: boolean;
  subscribeUser: (plan: 'monthly' | 'annual') => void;
  cancelSubscription: () => void;
  checkAccess: (isSubscriberOnly?: boolean) => boolean;

  // Admin & Moderation
  reports: ReportItem[];
  submitReport: (targetType: 'post' | 'user' | 'comment', targetId: string, reason: ReportItem['reason'], summary: string, author: string) => void;
  resolveReport: (reportId: string, action: 'dismiss' | 'remove_content' | 'suspend_user') => void;
  toggleUserStatus: (userId: string, newStatus: 'ACTIVE' | 'SUSPENDED' | 'BANNED') => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'mizizi_users_v2',
  CURRENT_USER_ID: 'mizizi_current_user_id_v2',
  POSTS: 'mizizi_posts_v2',
  FOLLOWING: 'mizizi_following_v2',
  STORIES: 'mizizi_stories_v2',
  REELS: 'mizizi_reels_v2',
  CONVERSATIONS: 'mizizi_conversations_v2',
  MESSAGES: 'mizizi_messages_v2',
  NOTIFICATIONS: 'mizizi_notifications_v2',
  REPORTS: 'mizizi_reports_v2',
  THEME: 'mizizi_theme_v2',
};

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return (saved as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // View state
  const [currentView, setCurrentView] = useState<ActiveView>('feed');
  const [viewingProfileUserId, setViewingProfileUserId] = useState<string | null>(null);

  // Users & Auth
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'user_gosbert';
  });

  const currentUser = allUsers.find(u => u.id === currentUserId) || allUsers[0];

  // Following list
  const [followingUserIds, setFollowingUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOLLOWING);
    return saved ? JSON.parse(saved) : ['user_amani', 'user_zanzibar', 'user_serengeti', 'user_tech', 'user_kilimanjaro'];
  });

  // Posts
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  // Stories
  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STORIES);
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  // Reels
  const [reels, setReels] = useState<Reel[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REELS);
    return saved ? JSON.parse(saved) : INITIAL_REELS;
  });

  // Direct Messaging
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Reports
  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  // Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);

  // Subscription state
  const isSubscribed =
    currentUser.subscriptionStatus === 'SUBSCRIBER_MONTHLY' ||
    currentUser.subscriptionStatus === 'SUBSCRIBER_ANNUAL';

  const subscribeUser = (plan: 'monthly' | 'annual') => {
    const status = plan === 'annual' ? 'SUBSCRIBER_ANNUAL' : 'SUBSCRIBER_MONTHLY';
    updateCurrentUserProfile({ subscriptionStatus: status });
    setIsSubscriptionModalOpen(false);
  };

  const cancelSubscription = () => {
    updateCurrentUserProfile({ subscriptionStatus: 'FREE' });
  };

  const checkAccess = (isSubscriberOnly?: boolean) => {
    if (!isSubscriberOnly) return true;
    if (isSubscribed) return true;
    setIsSubscriptionModalOpen(true);
    return false;
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLLOWING, JSON.stringify(followingUserIds));
  }, [followingUserIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REELS, JSON.stringify(reels));
  }, [reels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  // Auth & Profile actions
  const switchUser = (userId: string) => {
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      setCurrentUserId(userId);
      setViewingProfileUserId(userId);
    }
  };

  const updateCurrentUserProfile = (updates: Partial<User>) => {
    setAllUsers(prev =>
      prev.map(u => (u.id === currentUser.id ? { ...u, ...updates } : u))
    );
  };

  const login = (emailOrUsername: string) => {
    const clean = emailOrUsername.trim().toLowerCase();
    const found = allUsers.find(
      u => u.username.toLowerCase() === clean || u.email.toLowerCase() === clean
    );
    if (found) {
      setCurrentUserId(found.id);
      return true;
    }
    return false;
  };

  const register = (
    username: string,
    displayName: string,
    email: string,
    avatarUrl?: string,
    bio?: string,
    role?: UserRole
  ) => {
    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '') || `user_${Date.now()}`;
    const newUser: User = {
      id: `user_${Date.now()}`,
      username: cleanUsername,
      displayName: displayName.trim() || cleanUsername,
      email: email.trim() || `${cleanUsername}@mizizi.app`,
      avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanUsername}`,
      bio: bio?.trim() || 'New explorer on MIZIZI SOCIAL 🌍✨',
      role: role || 'USER',
      isPrivate: false,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      status: 'ACTIVE',
      subscriptionStatus: 'FREE', // Free entry: Anyone can create an account! Posting requires subscription.
      createdAt: new Date().toISOString(),
    };
    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    setViewingProfileUserId(newUser.id);
    setIsAuthModalOpen(false);
    return true;
  };

  const deleteAccount = (userId?: string) => {
    const idToDelete = userId || userToDeleteId || currentUser.id;

    // 1. Remove all posts authored by user
    setPosts(prev => prev.filter(p => p.author.id !== idToDelete && p.userId !== idToDelete));

    // 2. Remove all reels by user
    setReels(prev => prev.filter(r => r.userId !== idToDelete));

    // 3. Remove all stories by user
    setStories(prev => prev.filter(s => s.userId !== idToDelete));

    // 4. Clean comments by user from remaining posts
    setPosts(prev =>
      prev.map(p => ({
        ...p,
        comments: p.comments.filter(c => c.userId !== idToDelete),
        commentsCount: p.comments.filter(c => c.userId !== idToDelete).length,
      }))
    );

    // 5. Remove from following list
    setFollowingUserIds(prev => prev.filter(id => id !== idToDelete));

    // 6. Remove user from allUsers
    const remainingUsers = allUsers.filter(u => u.id !== idToDelete);
    setAllUsers(remainingUsers);

    // 7. If deleting current user, switch to first remaining user or generate a clean guest account
    if (currentUserId === idToDelete) {
      if (remainingUsers.length > 0) {
        setCurrentUserId(remainingUsers[0].id);
        setViewingProfileUserId(remainingUsers[0].id);
      } else {
        const freshUser: User = {
          id: `user_${Date.now()}`,
          username: 'mizizi_guest',
          displayName: 'Guest Explorer',
          email: 'guest@mizizi.app',
          avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=guest',
          bio: 'Exploring MIZIZI SOCIAL 🌍',
          role: 'USER',
          isPrivate: false,
          followersCount: 0,
          followingCount: 0,
          postsCount: 0,
          status: 'ACTIVE',
          subscriptionStatus: 'FREE',
          createdAt: new Date().toISOString(),
        };
        setAllUsers([freshUser]);
        setCurrentUserId(freshUser.id);
        setViewingProfileUserId(freshUser.id);
      }
      setCurrentView('feed');
    }

    setIsDeleteAccountModalOpen(false);
    setUserToDeleteId(null);
  };

  const logout = () => {
    // Revert to demo guest or first user
    setCurrentUserId('user_gosbert');
    setCurrentView('feed');
  };

  const openUserProfile = (userId: string) => {
    setViewingProfileUserId(userId);
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Follow system
  const isFollowing = (targetUserId: string) => followingUserIds.includes(targetUserId);

  const toggleFollowUser = (targetUserId: string) => {
    if (targetUserId === currentUser.id) return;

    setFollowingUserIds(prev => {
      const willFollow = !prev.includes(targetUserId);
      const next = willFollow
        ? [...prev, targetUserId]
        : prev.filter(id => id !== targetUserId);

      // Update counts
      setAllUsers(users =>
        users.map(u => {
          if (u.id === currentUser.id) {
            return {
              ...u,
              followingCount: Math.max(0, u.followingCount + (willFollow ? 1 : -1)),
            };
          }
          if (u.id === targetUserId) {
            return {
              ...u,
              followersCount: Math.max(0, u.followersCount + (willFollow ? 1 : -1)),
            };
          }
          return u;
        })
      );

      // Trigger notification if following
      if (willFollow) {
        const targetUser = allUsers.find(u => u.id === targetUserId);
        if (targetUser) {
          const newNotif: NotificationItem = {
            id: `notif_${Date.now()}`,
            type: 'follow',
            actor: {
              id: currentUser.id,
              username: currentUser.username,
              displayName: currentUser.displayName,
              avatarUrl: currentUser.avatarUrl,
            },
            text: 'started following you.',
            createdAt: 'Just now',
            isRead: false,
          };
          setNotifications(n => [newNotif, ...n]);
        }
      }

      return next;
    });
  };

  // Post interactions
  const toggleLikePost = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          const nextLikes = nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1);

          if (nextLiked && p.author.id !== currentUser.id) {
            const notif: NotificationItem = {
              id: `notif_like_${Date.now()}`,
              type: 'like',
              actor: {
                id: currentUser.id,
                username: currentUser.username,
                displayName: currentUser.displayName,
                avatarUrl: currentUser.avatarUrl,
              },
              postId: p.id,
              postThumbnail: p.media[0]?.url,
              text: 'liked your post.',
              createdAt: 'Just now',
              isRead: false,
            };
            setNotifications(n => [notif, ...n]);
          }

          return { ...p, isLiked: nextLiked, likesCount: nextLikes };
        }
        return p;
      })
    );
  };

  const toggleSavePost = (postId: string) => {
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, isSaved: !p.isSaved } : p))
    );
  };

  const addComment = (postId: string, content: string) => {
    if (!content.trim()) return;

    const newComment = {
      id: `comm_${Date.now()}`,
      postId,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatarUrl,
      content: content.trim(),
      createdAt: 'Just now',
      likesCount: 0,
      isLiked: false,
    };

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          if (p.author.id !== currentUser.id) {
            const notif: NotificationItem = {
              id: `notif_c_${Date.now()}`,
              type: 'comment',
              actor: {
                id: currentUser.id,
                username: currentUser.username,
                displayName: currentUser.displayName,
                avatarUrl: currentUser.avatarUrl,
              },
              postId: p.id,
              postThumbnail: p.media[0]?.url,
              text: `commented: "${content.slice(0, 32)}${content.length > 32 ? '...' : ''}"`,
              createdAt: 'Just now',
              isRead: false,
            };
            setNotifications(n => [notif, ...n]);
          }

          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );
  };

  const deleteComment = (postId: string, commentId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: Math.max(0, p.commentsCount - 1),
            comments: p.comments.filter(c => c.id !== commentId),
          };
        }
        return p;
      })
    );
  };

  const createPost = (
    caption: string,
    mediaUrl: string,
    location?: string,
    hashtags: string[] = [],
    mediaType: 'image' | 'video' = 'image',
    isSubscriberOnly = false
  ) => {
    const extractedTags = hashtags.length > 0
      ? hashtags
      : (caption.match(/#[a-zA-Z0-9_]+/g)?.map(t => t.replace('#', '')) || []);

    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      author: {
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
        avatarUrl: currentUser.avatarUrl,
        isVerified: currentUser.isVerified,
        role: currentUser.role,
      },
      media: [
        {
          id: `media_${Date.now()}`,
          url: mediaUrl,
          type: mediaType,
          isSubscriberOnly,
          aspectRatio: mediaType === 'video' ? '16:9' : '1:1',
        },
      ],
      caption,
      location: location || undefined,
      hashtags: extractedTags,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: 'Just now',
      isLiked: false,
      isSaved: false,
      isSubscriberOnly,
      comments: [],
    };

    setPosts(prev => [newPost, ...prev]);

    // Increment user post count
    setAllUsers(prev =>
      prev.map(u => (u.id === currentUser.id ? { ...u, postsCount: u.postsCount + 1 } : u))
    );

    setIsCreateModalOpen(false);
  };

  const createReel = (videoUrl: string, caption: string, musicTitle?: string, isSubscriberOnly = false) => {
    const newReel: Reel = {
      id: `reel_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatarUrl,
      videoUrl,
      caption,
      musicTitle: musicTitle || 'Original Audio · ' + currentUser.username,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 1,
      isLiked: false,
      isSaved: false,
      isSubscriberOnly,
      createdAt: 'Just now',
    };

    setReels(prev => [newReel, ...prev]);
    setIsCreateModalOpen(false);
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    setAllUsers(prev =>
      prev.map(u => (u.id === currentUser.id ? { ...u, postsCount: Math.max(0, u.postsCount - 1) } : u))
    );
  };

  // Stories
  const addStory = (mediaUrl: string, caption?: string) => {
    const newStory: Story = {
      id: `story_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatarUrl,
      mediaUrl,
      caption,
      createdAt: 'Just now',
      expiresAt: '24 hours remaining',
      isViewed: false,
      type: 'image',
    };
    setStories(prev => [newStory, ...prev]);
  };

  const markStoryViewed = (storyId: string) => {
    setStories(prev =>
      prev.map(s => (s.id === storyId ? { ...s, isViewed: true } : s))
    );
  };

  // Reels
  const toggleLikeReel = (reelId: string) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id === reelId) {
          const next = !r.isLiked;
          return {
            ...r,
            isLiked: next,
            likesCount: next ? r.likesCount + 1 : Math.max(0, r.likesCount - 1),
          };
        }
        return r;
      })
    );
  };

  const toggleSaveReel = (reelId: string) => {
    setReels(prev =>
      prev.map(r => (r.id === reelId ? { ...r, isSaved: !r.isSaved } : r))
    );
  };

  // Direct Messaging
  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      text: text.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: {
              text: newMsg.text,
              createdAt: 'Just now',
              senderId: currentUser.id,
              isRead: true,
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );

    // Simulate friendly reply if messaging another creator
    const targetConv = conversations.find(c => c.id === conversationId);
    const otherUser = targetConv?.participants.find(p => p.id !== currentUser.id);

    if (otherUser && otherUser.id !== currentUser.id) {
      setTimeout(() => {
        const autoReplies = [
          `Great connecting with you on MIZIZI! Excited about what we can collaborate on.`,
          `Appreciate your message! Checking this out now.`,
          `Karibu sana! Let's definitely align on this soon. ✨`,
        ];
        const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];

        const replyMsg: Message = {
          id: `reply_${Date.now()}`,
          conversationId,
          senderId: otherUser.id,
          text: randomReply,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false,
        };

        setMessages(m => ({
          ...m,
          [conversationId]: [...(m[conversationId] || []), replyMsg],
        }));

        setConversations(convs =>
          convs.map(c => {
            if (c.id === conversationId) {
              return {
                ...c,
                lastMessage: {
                  text: replyMsg.text,
                  createdAt: 'Just now',
                  senderId: otherUser.id,
                  isRead: false,
                },
                unreadCount: c.unreadCount + 1,
                updatedAt: new Date().toISOString(),
              };
            }
            return c;
          })
        );
      }, 1400);
    }
  };

  const startDirectMessage = (targetUserId: string) => {
    if (targetUserId === currentUser.id) return;

    // Check if conversation exists
    let conv = conversations.find(c =>
      c.participants.some(p => p.id === targetUserId) &&
      c.participants.some(p => p.id === currentUser.id)
    );

    if (!conv) {
      const otherUser = allUsers.find(u => u.id === targetUserId);
      if (!otherUser) return;

      conv = {
        id: `conv_${Date.now()}`,
        participants: [currentUser, otherUser],
        lastMessage: {
          text: 'Started a new conversation',
          createdAt: 'Just now',
          senderId: currentUser.id,
          isRead: true,
        },
        unreadCount: 0,
        updatedAt: new Date().toISOString(),
      };

      setConversations(prev => [conv!, ...prev]);
      setMessages(prev => ({
        ...prev,
        [conv!.id]: [],
      }));
    }

    setActiveConversationId(conv.id);
    setCurrentView('messages');
  };

  // Notifications
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Moderation & Admin
  const submitReport = (
    targetType: 'post' | 'user' | 'comment',
    targetId: string,
    reason: ReportItem['reason'],
    summary: string,
    author: string
  ) => {
    const newReport: ReportItem = {
      id: `rep_${Date.now()}`,
      reporterUsername: currentUser.username,
      targetType,
      targetId,
      targetSummary: summary,
      targetAuthor: author,
      reason,
      status: 'PENDING',
      createdAt: 'Just now',
    };
    setReports(prev => [newReport, ...prev]);
  };

  const resolveReport = (reportId: string, action: 'dismiss' | 'remove_content' | 'suspend_user') => {
    const rep = reports.find(r => r.id === reportId);
    if (!rep) return;

    if (action === 'remove_content' && rep.targetType === 'post') {
      deletePost(rep.targetId);
    } else if (action === 'suspend_user') {
      const targetUser = allUsers.find(u => u.username === rep.targetAuthor);
      if (targetUser) {
        toggleUserStatus(targetUser.id, 'SUSPENDED');
      }
    }

    setReports(prev =>
      prev.map(r =>
        r.id === reportId ? { ...r, status: action === 'dismiss' ? 'DISMISSED' : 'RESOLVED' } : r
      )
    );
  };

  const toggleUserStatus = (userId: string, newStatus: 'ACTIVE' | 'SUSPENDED' | 'BANNED') => {
    setAllUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, status: newStatus } : u))
    );
  };

  return (
    <SocialContext.Provider
      value={{
        theme,
        toggleTheme,
        currentView,
        setCurrentView,
        viewingProfileUserId,
        setViewingProfileUserId,
        openUserProfile,
        currentUser,
        switchUser,
        updateCurrentUserProfile,
        login,
        register,
        deleteAccount,
        logout,
        allUsers,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isDeleteAccountModalOpen,
        setIsDeleteAccountModalOpen,
        userToDeleteId,
        setUserToDeleteId,
        posts,
        toggleLikePost,
        toggleSavePost,
        addComment,
        deleteComment,
        createPost,
        deletePost,
        followingUserIds,
        toggleFollowUser,
        isFollowing,
        stories,
        activeStoryIndex,
        setActiveStoryIndex,
        addStory,
        markStoryViewed,
        reels,
        createReel,
        toggleLikeReel,
        toggleSaveReel,
        conversations,
        activeConversationId,
        setActiveConversationId,
        messages,
        sendMessage,
        startDirectMessage,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isDownloadModalOpen,
        setIsDownloadModalOpen,
        isSubscriptionModalOpen,
        setIsSubscriptionModalOpen,
        isSubscribed,
        subscribeUser,
        cancelSubscription,
        checkAccess,
        reports,
        submitReport,
        resolveReport,
        toggleUserStatus,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};
