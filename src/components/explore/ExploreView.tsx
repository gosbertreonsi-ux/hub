import React, { useState } from 'react';
import { Search, Heart, MessageCircle, Film, User, Tag, ArrowRight } from 'lucide-react';
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
    { id: 'all', label: 'All Media' },
    { id: 'video', label: 'Videos & Reels' },
    { id: 'fashion', label: 'Fashion & Style' },
    { id: 'nature', label: 'Wildlife & Nature' },
    { id: 'travel', label: 'Travel & Islands' },
    { id: 'tech', label: 'Tech & Startups' },
  ];

  const cleanQuery = searchQuery.trim().toLowerCase();

  const matchedUsers = cleanQuery
    ? allUsers.filter(
        u =>
          u.username.toLowerCase().includes(cleanQuery) ||
          u.displayName.toLowerCase().includes(cleanQuery) ||
          (u.bio && u.bio.toLowerCase().includes(cleanQuery))
      )
    : [];

  const filteredPosts = posts.filter(post => {
    if (cleanQuery) {
      const matchCaption = post.caption.toLowerCase().includes(cleanQuery);
      const matchTag = post.hashtags.some(t => t.toLowerCase().includes(cleanQuery));
      const matchAuthor =
        post.author.username.toLowerCase().includes(cleanQuery) ||
        post.author.displayName.toLowerCase().includes(cleanQuery);
      if (!matchCaption && !matchTag && !matchAuthor) return false;
    }

    if (activeCategory === 'video') {
      return post.media[0]?.type === 'video';
    }
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
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6 text-white select-none">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="relative max-w-xl mx-auto">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search creators, #hashtags, video topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full bg-[#141414] border border-white/10 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors shadow-xl"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pill Filters (Matching oneImage.webp pill buttons) */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-white text-black shadow-lg scale-105'
                  : 'bg-[#141414] text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Matched Users Section */}
      {cleanQuery && matchedUsers.length > 0 && (
        <div className="p-5 rounded-[28px] bg-[#121212] border border-white/10 space-y-3 shadow-xl">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            Matching People ({matchedUsers.length})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {matchedUsers.map(user => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#1c1c1c] border border-white/5"
              >
                <button
                  onClick={() => openUserProfile(user.id)}
                  className="flex items-center gap-3 text-left min-w-0"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-white/20"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {user.displayName}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate">
                      @{user.username}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => toggleFollowUser(user.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full shrink-0 ${
                    isFollowing(user.id)
                      ? 'bg-[#282828] text-neutral-300 border border-white/10'
                      : 'bg-white text-black hover:bg-neutral-200'
                  }`}
                >
                  {isFollowing(user.id) ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media Mosaic Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {filteredPosts.map(post => {
          const isVideo = post.media[0]?.type === 'video';
          return (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group relative aspect-square bg-[#121212] rounded-[26px] overflow-hidden cursor-pointer shadow-xl border border-white/10"
            >
              {isVideo ? (
                <video
                  src={post.media[0]?.url}
                  muted
                  loop
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <img
                  src={post.media[0]?.url}
                  alt={post.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}

              {/* Video Badge */}
              {isVideo && (
                <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/10">
                  <Film className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-extrabold text-sm">
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
          );
        })}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-16 text-neutral-500 text-xs">
          No publications found in this category.
        </div>
      )}

      {/* Post Detail Lightbox */}
      <PostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
};
