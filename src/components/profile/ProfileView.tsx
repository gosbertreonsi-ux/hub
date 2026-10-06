import React, { useState } from 'react';
import {
  Grid,
  Film,
  Bookmark,
  Settings,
  CheckCircle2,
  Lock,
  Globe,
  Heart,
  MessageCircle,
  Edit3,
  X,
  Share2,
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { Post, Reel } from '../../types';
import { PostDetailModal } from '../common/PostDetailModal';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    viewingProfileUserId,
    allUsers,
    posts,
    reels,
    isFollowing,
    toggleFollowUser,
    updateCurrentUserProfile,
    startDirectMessage,
  } = useSocial();

  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved'>('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Edit form state
  const [editDisplayName, setEditDisplayName] = useState(currentUser.displayName);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editWebsite, setEditWebsite] = useState(currentUser.website || '');
  const [editIsPrivate, setEditIsPrivate] = useState(currentUser.isPrivate);

  // User being viewed
  const targetUserId = viewingProfileUserId || currentUser.id;
  const profileUser = allUsers.find(u => u.id === targetUserId) || currentUser;
  const isSelf = profileUser.id === currentUser.id;

  // Filter content for this profile
  const userPosts = posts.filter(p => p.author.id === profileUser.id);
  const userReels = reels.filter(r => r.userId === profileUser.id);
  const userSavedPosts = posts.filter(p => p.isSaved);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      displayName: editDisplayName.trim() || currentUser.displayName,
      bio: editBio.trim(),
      website: editWebsite.trim(),
      isPrivate: editIsPrivate,
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-8 select-none">
      {/* Profile Header Block */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        {/* Profile Avatar */}
        <div className="relative shrink-0">
          <img
            src={profileUser.avatarUrl}
            alt={profileUser.displayName}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-neutral-100 dark:ring-neutral-800 shadow-md"
          />
        </div>

        {/* Bio & Details */}
        <div className="flex-1 space-y-4 text-center sm:text-left min-w-0">
          {/* Username & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="font-display font-extrabold text-xl text-neutral-900 dark:text-neutral-100">
                {profileUser.username}
              </h1>
              {profileUser.isVerified && (
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
              )}
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2">
              {isSelf ? (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => toggleFollowUser(profileUser.id)}
                    className={`px-5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      isFollowing(profileUser.id)
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        : 'bg-amber-500 text-neutral-950 hover:bg-amber-400 font-bold'
                    }`}
                  >
                    {isFollowing(profileUser.id) ? 'Following' : 'Follow'}
                  </button>

                  <button
                    onClick={() => startDirectMessage(profileUser.id)}
                    className="px-4 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    Message
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Numerical Metrics (Clean tabular numbers adhering to Constitution) */}
          <div className="flex items-center justify-center sm:justify-start gap-6 text-xs text-neutral-600 dark:text-neutral-400">
            <div>
              <span className="font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                {userPosts.length}
              </span>{' '}
              posts
            </div>
            <div>
              <span className="font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                {profileUser.followersCount.toLocaleString()}
              </span>{' '}
              followers
            </div>
            <div>
              <span className="font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                {profileUser.followingCount.toLocaleString()}
              </span>{' '}
              following
            </div>
          </div>

          {/* Category, Display Name & Bio Prose */}
          <div className="space-y-1 text-xs">
            <div className="font-bold text-neutral-900 dark:text-neutral-100">
              {profileUser.displayName}
            </div>
            {profileUser.category && (
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                {profileUser.category}
              </div>
            )}
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line max-w-lg">
              {profileUser.bio}
            </p>
            {profileUser.website && (
              <a
                href={profileUser.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-amber-500 hover:underline pt-1"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{profileUser.website.replace('https://', '')}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Profile Tabs (Interactive Segmented Buttons) */}
      <div className="flex items-center justify-center gap-4 border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'posts'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>POSTS ({userPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'reels'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>REELS ({userReels.length})</span>
        </button>

        {isSelf && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'saved'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>SAVED ({userSavedPosts.length})</span>
          </button>
        )}
      </div>

      {/* Tab Content Grids */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
          {userPosts.map(post => (
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
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold text-xs">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 fill-white" />
                  <span className="tabular-nums">{post.likesCount}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span className="tabular-nums">{post.commentsCount}</span>
                </div>
              </div>
            </div>
          ))}

          {userPosts.length === 0 && (
            <div className="col-span-3 text-center py-16 text-neutral-400 text-xs">
              No posts shared yet.
            </div>
          )}
        </div>
      )}

      {activeTab === 'reels' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
          {userReels.map(reel => (
            <div
              key={reel.id}
              className="group relative aspect-9/16 bg-neutral-900 rounded-xl overflow-hidden shadow-xs"
            >
              <img
                src={reel.videoUrl}
                alt={reel.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-3 left-3 text-white text-[11px] font-bold flex items-center gap-1 drop-shadow-md">
                <Film className="w-3.5 h-3.5" />
                <span className="tabular-nums">{reel.viewsCount.toLocaleString()}</span>
              </div>
            </div>
          ))}

          {userReels.length === 0 && (
            <div className="col-span-3 text-center py-16 text-neutral-400 text-xs">
              No reels shared yet.
            </div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
          {userSavedPosts.map(post => (
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
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold text-xs">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 fill-white" />
                  <span className="tabular-nums">{post.likesCount}</span>
                </div>
              </div>
            </div>
          ))}

          {userSavedPosts.length === 0 && (
            <div className="col-span-3 text-center py-16 text-neutral-400 text-xs">
              No saved posts in your collection.
            </div>
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h2 className="font-display font-bold text-base text-neutral-900 dark:text-neutral-100">
                Edit Profile
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={e => setEditDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={editWebsite}
                  onChange={e => setEditWebsite(e.target.value)}
                  placeholder="https://yourbrand.com"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                <div>
                  <div className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Private Account</span>
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Only approved followers see your content
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={editIsPrivate}
                  onChange={e => setEditIsPrivate(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
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
