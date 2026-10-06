import React, { useState } from 'react';
import { Search, Heart, MessageCircle, Film, User, Tag } from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { Post } from '../../types';
import { PostDetailModal } from '../common/PostDetailModal';

export const ExploreView: React.FC = () => {
  const {
    posts,
    reels,
    allUsers,
    openUserProfile,
    toggleFollowUser,
    isFollowing,
    setCurrentView,
  } = useSocial();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'fashion', label: 'Fashion & Textiles' },
    { id: 'travel', label: 'Travel & Islands' },
    { id: 'nature', label: 'Wildlife & Nature' },
    { id: 'tech', label: 'Tech & Startups' },
  ];

  // Filter posts based on category and search query
  const cleanQuery = searchQuery.trim().toLowerCase();

  // Matched users
  const matchedUsers = cleanQuery
    ? allUsers.filter(
        u =>
          u.username.toLowerCase().includes(cleanQuery) ||
          u.displayName.toLowerCase().includes(cleanQuery) ||
          (u.bio && u.bio.toLowerCase().includes(cleanQuery))
      )
    : [];

  const filteredPosts = posts.filter(post => {
    // Search match
    if (cleanQuery) {
      const matchCaption = post.caption.toLowerCase().includes(cleanQuery);
      const matchTag = post.hashtags.some(t => t.toLowerCase().includes(cleanQuery));
      const matchAuthor =
        post.author.username.toLowerCase().includes(cleanQuery) ||
        post.author.displayName.toLowerCase().includes(cleanQuery);
      if (!matchCaption && !matchTag && !matchAuthor) return false;
    }

    // Category filter
    if (activeCategory === 'fashion') {
      return (
        post.hashtags.some(t => t.toLowerCase().includes('fashion')) ||
        post.caption.toLowerCase().includes('fashion') ||
        post.author.username.includes('fashion')
      );
    }
    if (activeCategory === 'travel') {
      return (
        post.hashtags.some(t => t.toLowerCase().includes('travel') || t.toLowerCase().includes('zanzibar')) ||
        post.caption.toLowerCase().includes('zanzibar')
      );
    }
    if (activeCategory === 'nature') {
      return (
        post.hashtags.some(t => t.toLowerCase().includes('wildlife') || t.toLowerCase().includes('serengeti')) ||
        post.caption.toLowerCase().includes('lion')
      );
    }
    if (activeCategory === 'tech') {
      return (
        post.hashtags.some(t => t.toLowerCase().includes('tech') || t.toLowerCase().includes('startups')) ||
        post.caption.toLowerCase().includes('code')
      );
    }

    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="relative max-w-xl mx-auto">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search creators, #hashtags, topics, locations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Bar (Interactive Buttons) */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-neutral-950 font-semibold shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Matched Users Section (if searching) */}
      {cleanQuery && matchedUsers.length > 0 && (
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Matching People ({matchedUsers.length})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {matchedUsers.map(user => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60"
              >
                <button
                  onClick={() => openUserProfile(user.id)}
                  className="flex items-center gap-2.5 text-left min-w-0"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                      {user.displayName}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate">
                      @{user.username}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => toggleFollowUser(user.id)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0 ${
                    isFollowing(user.id)
                      ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                      : 'bg-amber-500 text-neutral-950 hover:bg-amber-400'
                  }`}
                >
                  {isFollowing(user.id) ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explore Grid of Posts & Reels */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="group relative aspect-square bg-neutral-900 rounded-xl overflow-hidden cursor-pointer shadow-xs"
          >
            <img
              src={post.media[0]?.url}
              alt={post.caption}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Hover Stat Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold text-sm">
              <div className="flex items-center gap-1.5">
                <Heart className="w-5 h-5 fill-white" />
                <span className="tabular-nums">{post.likesCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-5 h-5 fill-white" />
                <span className="tabular-nums">{post.commentsCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-16 text-neutral-500 text-sm">
          No explore items found matching your search.
        </div>
      )}

      {/* Lightbox Post Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
};
