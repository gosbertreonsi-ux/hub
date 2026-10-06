import React, { useState } from 'react';
import {
  Grid,
  Film,
  Bookmark,
  CheckCircle2,
  Lock,
  Globe,
  Heart,
  MessageCircle,
  Edit3,
  X,
  Plus,
  Play,
  ArrowRight,
  TrendingUp,
  Send,
  Video,
  Sparkles,
  Crown,
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
    setIsCreateModalOpen,
    setCurrentView,
  } = useSocial();

  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved'>('posts');
  const [overviewMode, setOverviewMode] = useState<'overview' | 'favorite'>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Edit form state
  const [editDisplayName, setEditDisplayName] = useState(currentUser.displayName);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editWebsite, setEditWebsite] = useState(currentUser.website || '');
  const [editIsPrivate, setEditIsPrivate] = useState(currentUser.isPrivate);

  const targetUserId = viewingProfileUserId || currentUser.id;
  const profileUser = allUsers.find(u => u.id === targetUserId) || currentUser;
  const isSelf = profileUser.id === currentUser.id;

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
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6 select-none text-white">
      {/* Top Header matching "Overview Favorite" in oneImage.webp */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              setOverviewMode('overview');
              setActiveTab('posts');
            }}
            className={`font-display font-extrabold text-2xl tracking-tight transition-colors ${
              overviewMode === 'overview' ? 'text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => {
              setOverviewMode('favorite');
              setActiveTab('saved');
            }}
            className={`font-display font-extrabold text-2xl tracking-tight transition-colors ${
              overviewMode === 'favorite' ? 'text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            Favorite
          </button>
        </div>

        {isSelf && (
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2.5 rounded-full bg-[#181818] border border-white/10 text-neutral-300 hover:text-white transition-colors"
            title="Edit Profile"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Account Metrics Card (Mirroring Accounts Card & $45689.05 in oneImage.webp) */}
      <div className="p-6 rounded-[32px] bg-[#121212] border border-white/10 shadow-2xl space-y-5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-400">Profile Identity</span>
            <span className="text-[11px] text-neutral-500">({profileUser.category || 'Creator'})</span>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-7 h-7 rounded-full bg-[#222222] hover:bg-white hover:text-black flex items-center justify-center transition-colors text-white"
            title="Add Publication"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* User Identity & Avatar */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={profileUser.avatarUrl}
            alt={profileUser.displayName}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-white/10 shadow-xl"
          />

          <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="font-display font-extrabold text-xl text-white">
                {profileUser.displayName}
              </h2>
              {profileUser.isVerified && (
                <CheckCircle2 className="w-4 h-4 fill-white text-black shrink-0" />
              )}
            </div>

            <div className="text-xs text-neutral-400">
              @{profileUser.username}
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed max-w-lg pt-1">
              {profileUser.bio}
            </p>

            {profileUser.website && (
              <a
                href={profileUser.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white pt-1"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="underline underline-offset-2">{profileUser.website.replace('https://', '')}</span>
              </a>
            )}
          </div>
        </div>

        {/* Total Metric (Big Number like $45689.05 in oneImage.webp) */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase font-bold tracking-wider text-neutral-400">
              Audience Community Reach
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight tabular-nums">
              {profileUser.followersCount.toLocaleString()}
              <span className="text-base text-neutral-500 font-normal ml-2">followers</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('creator')}
            className="text-xs font-bold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Performance History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3x2 Squircle Action Grid (Directly matching Scan & Pay, Bills, Cards, Invest, etc. in oneImage.webp) */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="p-4 rounded-[24px] bg-[#141414] hover:bg-[#1f1f1f] border border-white/5 flex flex-col items-center justify-center gap-2 transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#222222] group-hover:bg-white group-hover:text-black text-white flex items-center justify-center transition-colors">
            <Video className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white">Post Video</span>
        </button>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="p-4 rounded-[24px] bg-[#141414] hover:bg-[#1f1f1f] border border-white/5 flex flex-col items-center justify-center gap-2 transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#222222] group-hover:bg-white group-hover:text-black text-white flex items-center justify-center transition-colors">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white">New Photo</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('reels');
            setOverviewMode('overview');
          }}
          className="p-4 rounded-[24px] bg-[#141414] hover:bg-[#1f1f1f] border border-white/5 flex flex-col items-center justify-center gap-2 transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#222222] group-hover:bg-white group-hover:text-black text-white flex items-center justify-center transition-colors">
            <Film className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white">Reels</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('saved');
            setOverviewMode('favorite');
          }}
          className="p-4 rounded-[24px] bg-[#141414] hover:bg-[#1f1f1f] border border-white/5 flex flex-col items-center justify-center gap-2 transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#222222] group-hover:bg-white group-hover:text-black text-white flex items-center justify-center transition-colors">
            <Bookmark className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white">Saved</span>
        </button>

        <button
          onClick={() => setCurrentView('creator')}
          className="p-4 rounded-[24px] bg-[#141414] hover:bg-[#1f1f1f] border border-white/5 flex flex-col items-center justify-center gap-2 transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#222222] group-hover:bg-white group-hover:text-black text-white flex items-center justify-center transition-colors">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white">Analytics</span>
        </button>

        <button
          onClick={() => {
            if (isSelf) {
              setCurrentView('messages');
            } else {
              startDirectMessage(profileUser.id);
            }
          }}
          className="p-4 rounded-[24px] bg-[#141414] hover:bg-[#1f1f1f] border border-white/5 flex flex-col items-center justify-center gap-2 transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#222222] group-hover:bg-white group-hover:text-black text-white flex items-center justify-center transition-colors">
            <Send className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white">Messages</span>
        </button>
      </div>

      {/* Profile Media Tabs */}
      <div className="flex items-center justify-center gap-3 pt-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-3 px-5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'posts'
              ? 'border-white text-white'
              : 'border-transparent text-neutral-500 hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Publications ({userPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`pb-3 px-5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'reels'
              ? 'border-white text-white'
              : 'border-transparent text-neutral-500 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Reels ({userReels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 px-5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'saved'
              ? 'border-white text-white'
              : 'border-transparent text-neutral-500 hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved ({userSavedPosts.length})</span>
        </button>
      </div>

      {/* Grid Content */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {userPosts.map(post => {
            const isVideo = post.media[0]?.type === 'video';
            const mediaUrl = post.media[0]?.thumbnailUrl || post.media[0]?.url;
            const isVIP = post.isSubscriberOnly || post.media[0]?.isSubscriberOnly;

            return (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group relative aspect-square bg-[#141414] rounded-[24px] overflow-hidden cursor-pointer border border-white/10 shadow-lg"
              >
                <img
                  src={mediaUrl}
                  alt={post.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Indicators */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                  {isVIP && (
                    <div className="p-1.5 rounded-full bg-amber-400 text-black shadow-md">
                      <Crown className="w-3.5 h-3.5 fill-black" />
                    </div>
                  )}
                  {isVideo && (
                    <div className="p-1.5 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/10">
                      <Film className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-extrabold text-xs">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{post.likesCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{post.commentsCount}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {userPosts.length === 0 && (
            <div className="col-span-3 text-center py-16 text-neutral-500 text-xs">
              No publications yet. Click "Post Video" or "New Photo" to upload!
            </div>
          )}
        </div>
      )}

      {activeTab === 'reels' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {userReels.map(reel => (
            <div
              key={reel.id}
              onClick={() => setCurrentView('reels')}
              className="group relative aspect-[9/16] bg-[#141414] rounded-[24px] overflow-hidden border border-white/10 shadow-lg cursor-pointer"
            >
              <img
                src={reel.userAvatar}
                alt={reel.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 right-3 z-10">
                <span className="p-1.5 rounded-full bg-amber-400 text-black flex items-center justify-center shadow">
                  <Crown className="w-3 h-3 fill-black" />
                </span>
              </div>
              <div className="absolute bottom-3 left-3 text-white text-xs font-extrabold flex items-center gap-1.5 drop-shadow-md">
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{reel.viewsCount.toLocaleString()}</span>
              </div>
            </div>
          ))}

          {userReels.length === 0 && (
            <div className="col-span-3 text-center py-16 text-neutral-500 text-xs">
              No vertical reels published yet.
            </div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {userSavedPosts.map(post => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group relative aspect-square bg-[#141414] rounded-[24px] overflow-hidden cursor-pointer border border-white/10 shadow-lg"
            >
              <img
                src={post.media[0]?.url}
                alt={post.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-extrabold text-xs">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{post.likesCount}</span>
                </div>
              </div>
            </div>
          ))}

          {userSavedPosts.length === 0 && (
            <div className="col-span-3 text-center py-16 text-neutral-500 text-xs">
              No saved posts in your favorite collection.
            </div>
          )}
        </div>
      )}

      {/* Bottom Sticky Action Bar matching "Send Money >" in oneImage.webp */}
      <div className="pt-4 flex justify-center">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full max-w-sm py-4 px-6 rounded-full bg-white text-black font-black text-sm flex items-center justify-between shadow-2xl hover:bg-neutral-200 transition-transform active:scale-95"
        >
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 stroke-[2.5]" />
            <span>Upload Video / Create Post</span>
          </div>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121212] rounded-[32px] p-6 border border-white/10 shadow-2xl space-y-4 animate-in zoom-in-95 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-display font-extrabold text-lg text-white">
                Edit Profile
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={e => setEditDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#1c1c1c] border border-white/10 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#1c1c1c] border border-white/10 text-white focus:outline-none focus:border-white transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={editWebsite}
                  onChange={e => setEditWebsite(e.target.value)}
                  placeholder="https://yourbrand.com"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#1c1c1c] border border-white/10 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/5">
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Private Account</span>
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Only approved followers can view your stories and posts
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={editIsPrivate}
                  onChange={e => setEditIsPrivate(e.target.checked)}
                  className="w-4 h-4 accent-white cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-full bg-[#222222] text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-white text-black font-extrabold hover:bg-neutral-200 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
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
