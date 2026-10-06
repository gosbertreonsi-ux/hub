import React, { useState, useRef } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Plus,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Share2,
  Trash2,
  Flag,
  Film,
  Compass,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { Post } from '../../types';

export const FeedView: React.FC = () => {
  const {
    posts,
    currentUser,
    allUsers,
    followingUserIds,
    toggleLikePost,
    toggleSavePost,
    addComment,
    deletePost,
    submitReport,
    toggleFollowUser,
    isFollowing,
    stories,
    setActiveStoryIndex,
    openUserProfile,
    startDirectMessage,
    setIsCreateModalOpen,
    setCurrentView,
  } = useSocial();

  const [feedMode, setFeedMode] = useState<'discover' | 'following'>('discover');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [showHeartAnim, setShowHeartAnim] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Video playback states
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Record<string, boolean>>({});

  // Filter posts based on feedMode
  const displayedPosts = posts.filter(post => {
    if (feedMode === 'following') {
      return followingUserIds.includes(post.author.id) || post.author.id === currentUser.id;
    }
    return true;
  });

  // Suggested users
  const suggestedUsers = allUsers.filter(
    u => u.id !== currentUser.id && !followingUserIds.includes(u.id)
  ).slice(0, 4);

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (text) {
      addComment(postId, text);
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    }
  };

  const handleDoubleTapLike = (postId: string) => {
    toggleLikePost(postId);
    setShowHeartAnim(postId);
    setTimeout(() => {
      setShowHeartAnim(null);
    }, 800);
  };

  const handleShare = (postId: string) => {
    navigator.clipboard?.writeText(window.location.href);
    setShareToast('Link copied to clipboard!');
    setTimeout(() => setShareToast(null), 2500);
  };

  const handleReport = (post: Post) => {
    submitReport('post', post.id, 'spam', `Reported post by @${post.author.username}`, post.author.username);
    setActiveMenuPostId(null);
    setShareToast('Post submitted for safety review.');
    setTimeout(() => setShareToast(null), 3000);
  };

  const toggleVideoPlayback = (postId: string, videoEl: HTMLVideoElement | null) => {
    if (!videoEl) return;
    if (videoEl.paused) {
      videoEl.play();
      setPlayingVideoId(postId);
    } else {
      videoEl.pause();
      setPlayingVideoId(null);
    }
  };

  const toggleVideoMute = (postId: string, videoEl: HTMLVideoElement | null) => {
    if (!videoEl) return;
    const nextMuted = !videoEl.muted;
    videoEl.muted = nextMuted;
    setMutedVideos(prev => ({ ...prev, [postId]: nextMuted }));
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 md:py-6 flex gap-8 justify-center select-none">
      {/* Toast Alert */}
      {shareToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-white text-black text-xs font-bold shadow-2xl border border-white/20 animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
          <span>{shareToast}</span>
        </div>
      )}

      {/* Main Center Stream */}
      <div className="w-full max-w-[620px] space-y-5">
        {/* Sleek Top Stepper / Filter Bar inspired by oneImage.webp */}
        <div className="p-4 sm:p-5 rounded-[28px] bg-[#121212] border border-white/10 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">
              Overview
            </h1>
            <span className="text-sm font-semibold text-neutral-500">
              · Feed
            </span>
          </div>

          {/* Stepper / Mode Toggle (Buttons matching reference screenshot) */}
          <div className="flex items-center gap-1.5 p-1 bg-[#1c1c1c] rounded-full border border-white/10">
            <button
              onClick={() => setFeedMode('discover')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                feedMode === 'discover'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              For You
            </button>
            <button
              onClick={() => setFeedMode('following')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                feedMode === 'following'
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Following ({followingUserIds.length})
            </button>
          </div>
        </div>

        {/* Stories Tray */}
        <div className="p-4 rounded-[28px] bg-[#121212] border border-white/10 shadow-xl">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
            {/* Add Story Button */}
            <button
              onClick={() => setActiveStoryIndex(0)}
              className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none"
            >
              <div className="relative">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  className="w-16 h-16 rounded-full object-cover p-0.5 border-2 border-dashed border-white/40 group-hover:border-white transition-colors"
                />
                <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-xs font-black shadow-lg">
                  <Plus className="w-3.5 h-3.5" />
                </span>
              </div>
              <span className="text-[11px] font-semibold text-neutral-400 group-hover:text-white truncate max-w-[64px]">
                Your Story
              </span>
            </button>

            {/* Other User Stories */}
            {stories.map((story, idx) => (
              <button
                key={story.id}
                onClick={() => setActiveStoryIndex(idx)}
                className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none"
              >
                <div
                  className={`p-0.5 rounded-full transition-transform group-hover:scale-105 ${
                    story.isViewed
                      ? 'bg-neutral-700'
                      : 'bg-gradient-to-tr from-white via-neutral-300 to-neutral-500'
                  }`}
                >
                  <img
                    src={story.userAvatar}
                    alt={story.username}
                    className="w-15 h-15 rounded-full object-cover ring-2 ring-black"
                  />
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 group-hover:text-white truncate max-w-[64px]">
                  {story.username.split('_')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Squircle Action Grid (Directly mirroring the 6 tiles in oneImage.webp) */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 p-3 rounded-[24px] bg-[#121212] border border-white/10">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="p-3 rounded-2xl bg-[#1c1c1c] hover:bg-[#262626] border border-white/5 flex flex-col items-center justify-center gap-1.5 transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white">Create</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="p-3 rounded-2xl bg-[#1c1c1c] hover:bg-[#262626] border border-white/5 flex flex-col items-center justify-center gap-1.5 transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#2a2a2a] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white">Upload Video</span>
          </button>

          <button
            onClick={() => setCurrentView('reels')}
            className="p-3 rounded-2xl bg-[#1c1c1c] hover:bg-[#262626] border border-white/5 flex flex-col items-center justify-center gap-1.5 transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#2a2a2a] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white">Reels</span>
          </button>

          <button
            onClick={() => setCurrentView('explore')}
            className="p-3 rounded-2xl bg-[#1c1c1c] hover:bg-[#262626] border border-white/5 flex flex-col items-center justify-center gap-1.5 transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#2a2a2a] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white">Discover</span>
          </button>

          <button
            onClick={() => setCurrentView('creator')}
            className="p-3 rounded-2xl bg-[#1c1c1c] hover:bg-[#262626] border border-white/5 flex flex-col items-center justify-center gap-1.5 transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#2a2a2a] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white">Creator</span>
          </button>

          <button
            onClick={() => setCurrentView('admin')}
            className="p-3 rounded-2xl bg-[#1c1c1c] hover:bg-[#262626] border border-white/5 flex flex-col items-center justify-center gap-1.5 transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#2a2a2a] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white">Safety</span>
          </button>
        </div>

        {/* Posts Stream */}
        <div className="space-y-6">
          {displayedPosts.map(post => {
            const isAuthor = post.author.id === currentUser.id;
            const isVideo = post.media[0]?.type === 'video';
            const isCurrentPlaying = playingVideoId === post.id;
            const isMuted = mutedVideos[post.id] ?? true;

            return (
              <article
                key={post.id}
                className="rounded-[32px] bg-[#121212] border border-white/10 shadow-2xl overflow-hidden transition-all text-white"
              >
                {/* Post Header */}
                <header className="p-4 flex items-center justify-between border-b border-white/5">
                  <button
                    onClick={() => openUserProfile(post.author.id)}
                    className="flex items-center gap-3 text-left focus:outline-none"
                  >
                    <img
                      src={post.author.avatarUrl}
                      alt={post.author.displayName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white hover:underline">
                          {post.author.displayName}
                        </span>
                        {post.author.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white fill-white text-black shrink-0" />
                        )}
                        {isVideo && (
                          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-bold uppercase tracking-wider text-neutral-300">
                            Video
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                        <span>@{post.author.username}</span>
                        {post.location && (
                          <>
                            <span>·</span>
                            <span className="truncate max-w-[150px]">{post.location}</span>
                          </>
                        )}
                        <span>·</span>
                        <span>{post.createdAt}</span>
                      </div>
                    </div>
                  </button>

                  {/* Options Menu */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)
                      }
                      className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                      aria-label="Post actions"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {activeMenuPostId === post.id && (
                      <div className="absolute right-0 top-full mt-1 w-44 rounded-2xl bg-[#1e1e1e] border border-white/10 shadow-2xl py-1 z-30">
                        {isAuthor ? (
                          <button
                            onClick={() => {
                              deletePost(post.id);
                              setActiveMenuPostId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-white/10 text-left"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Post</span>
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                toggleFollowUser(post.author.id);
                                setActiveMenuPostId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-200 hover:bg-white/10 text-left"
                            >
                              <span>{isFollowing(post.author.id) ? 'Unfollow' : 'Follow'} @{post.author.username}</span>
                            </button>
                            <button
                              onClick={() => handleReport(post)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-white/10 text-left"
                            >
                              <Flag className="w-3.5 h-3.5" />
                              <span>Report Post</span>
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            handleShare(post.id);
                            setActiveMenuPostId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-200 hover:bg-white/10 text-left"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </button>
                      </div>
                    )}
                  </div>
                </header>

                {/* Post Media: Supports Native Video Player or Photos */}
                <div
                  className="relative aspect-square sm:aspect-[4/3] bg-black flex items-center justify-center overflow-hidden cursor-pointer select-none group"
                  onDoubleClick={() => handleDoubleTapLike(post.id)}
                >
                  {isVideo ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <video
                        id={`post-video-${post.id}`}
                        src={post.media[0]?.url}
                        loop
                        playsInline
                        muted={isMuted}
                        className="w-full h-full object-cover"
                        onClick={e => {
                          e.stopPropagation();
                          toggleVideoPlayback(post.id, e.currentTarget);
                        }}
                      />

                      {/* Video Play/Pause Floating Icon Button */}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          const el = document.getElementById(`post-video-${post.id}`) as HTMLVideoElement;
                          toggleVideoPlayback(post.id, el);
                        }}
                        className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                          isCurrentPlaying ? 'opacity-0 group-hover:opacity-100 bg-black/30' : 'opacity-100 bg-black/40'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                          {isCurrentPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-1" />}
                        </div>
                      </button>

                      {/* Video Controls Bar */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white z-20">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            const el = document.getElementById(`post-video-${post.id}`) as HTMLVideoElement;
                            toggleVideoMute(post.id, el);
                          }}
                          className="p-2 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-md border border-white/10 transition-colors"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>

                        <div className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                          <Film className="w-3 h-3" />
                          <span>Video Clip</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={post.media[0]?.url}
                      alt={post.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                    />
                  )}

                  {/* Double tap heart animation */}
                  {showHeartAnim === post.id && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-in zoom-in-50 duration-200">
                      <Heart className="w-24 h-24 fill-white text-white drop-shadow-2xl" />
                    </div>
                  )}

                  {/* Sponsored tag if applicable */}
                  {post.isSponsored && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-extrabold tracking-wider uppercase border border-white/20">
                      Sponsored · {post.sponsoredBrand}
                    </div>
                  )}
                </div>

                {/* Action Bar matching oneImage.webp */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Like */}
                      <button
                        onClick={() => toggleLikePost(post.id)}
                        className="group flex items-center gap-1.5 focus:outline-none"
                        aria-label={post.isLiked ? 'Unlike' : 'Like'}
                      >
                        <Heart
                          className={`w-6 h-6 transition-all ${
                            post.isLiked
                              ? 'fill-white text-white scale-110'
                              : 'text-neutral-300 group-hover:text-white'
                          }`}
                        />
                      </button>

                      {/* Comment */}
                      <button
                        onClick={() => {
                          const el = document.getElementById(`comment-input-${post.id}`);
                          el?.focus();
                        }}
                        className="text-neutral-300 hover:text-white transition-colors"
                        aria-label="Comment"
                      >
                        <MessageCircle className="w-6 h-6" />
                      </button>

                      {/* Direct Message / Share */}
                      <button
                        onClick={() => startDirectMessage(post.author.id)}
                        className="text-neutral-300 hover:text-white transition-colors"
                        aria-label="Send direct message"
                      >
                        <Send className="w-5.5 h-5.5" />
                      </button>
                    </div>

                    {/* Bookmark / Save */}
                    <button
                      onClick={() => toggleSavePost(post.id)}
                      className="text-neutral-300 hover:text-white focus:outline-none transition-colors"
                      aria-label={post.isSaved ? 'Remove from saved' : 'Save post'}
                    >
                      <Bookmark
                        className={`w-6 h-6 ${
                          post.isSaved ? 'fill-white text-white' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Likes Count */}
                  <div className="text-xs font-extrabold text-white tabular-nums tracking-wide">
                    {post.likesCount.toLocaleString()} {post.likesCount === 1 ? 'like' : 'likes'}
                  </div>

                  {/* Caption */}
                  <div className="text-xs text-neutral-300 leading-relaxed space-y-1">
                    <p>
                      <button
                        onClick={() => openUserProfile(post.author.id)}
                        className="font-bold mr-1.5 text-white hover:underline focus:outline-none"
                      >
                        {post.author.username}
                      </button>
                      <span>{post.caption}</span>
                    </p>
                  </div>

                  {/* Comments Preview */}
                  {post.comments.length > 0 && (
                    <div className="pt-2 space-y-1.5 border-t border-white/5">
                      <div className="text-[11px] text-neutral-400 font-semibold">
                        Comments ({post.comments.length})
                      </div>
                      {post.comments.slice(-2).map(c => (
                        <div key={c.id} className="text-xs flex items-start gap-1.5">
                          <button
                            onClick={() => openUserProfile(c.userId)}
                            className="font-bold text-white hover:underline shrink-0"
                          >
                            {c.username}
                          </button>
                          <span className="text-neutral-300 flex-1">
                            {c.content}
                          </span>
                          <span className="text-[10px] text-neutral-500 shrink-0">
                            {c.createdAt}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Input Form */}
                  <form
                    onSubmit={e => handleCommentSubmit(post.id, e)}
                    className="pt-2 flex items-center gap-2 border-t border-white/5"
                  >
                    <input
                      id={`comment-input-${post.id}`}
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={e =>
                        setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))
                      }
                      className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                    />

                    <button
                      type="submit"
                      disabled={!commentInputs[post.id]?.trim()}
                      className="px-4 py-2 rounded-full bg-white text-black font-extrabold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-200 transition-colors"
                    >
                      Post
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Right Desktop Column (Cards matching reference screenshot) */}
      <aside className="hidden lg:block w-80 shrink-0 space-y-5 select-none">
        {/* User Card */}
        <div className="p-5 rounded-[28px] bg-[#121212] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Active Profile
            </span>
            <button
              onClick={() => setCurrentView('profile')}
              className="text-xs font-bold text-white hover:underline flex items-center gap-1"
            >
              <span>View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3.5">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
            />
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-white truncate flex items-center gap-1">
                <span>{currentUser.displayName}</span>
                {currentUser.isVerified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white fill-white text-black shrink-0" />
                )}
              </div>
              <div className="text-xs text-neutral-400 truncate">
                @{currentUser.username}
              </div>
            </div>
          </div>

          {/* Quick Metrics (Clean bold numerals mirroring $45689.05 in screenshot) */}
          <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 rounded-2xl bg-[#1c1c1c] border border-white/5">
              <div className="text-[10px] text-neutral-400 uppercase font-semibold">Followers</div>
              <div className="text-base font-extrabold text-white tabular-nums">
                {currentUser.followersCount.toLocaleString()}
              </div>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#1c1c1c] border border-white/5">
              <div className="text-[10px] text-neutral-400 uppercase font-semibold">Publications</div>
              <div className="text-base font-extrabold text-white tabular-nums">
                {currentUser.postsCount}
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Creators */}
        <div className="p-5 rounded-[28px] bg-[#121212] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-400 uppercase tracking-wider">
              Suggested Creators
            </span>
            <button
              onClick={() => setCurrentView('explore')}
              className="text-neutral-300 hover:text-white font-semibold text-xs"
            >
              See All
            </button>
          </div>

          <div className="space-y-3">
            {suggestedUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between gap-2">
                <button
                  onClick={() => openUserProfile(user.id)}
                  className="flex items-center gap-2.5 min-w-0 text-left focus:outline-none"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-white/10"
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
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                    isFollowing(user.id)
                      ? 'bg-[#222222] text-neutral-300 border border-white/10'
                      : 'bg-white text-black hover:bg-neutral-200'
                  }`}
                >
                  {isFollowing(user.id) ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Noir Platform Footer */}
        <footer className="px-3 text-[11px] text-neutral-500 space-y-2">
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <span>Privacy</span>
            <span>·</span>
            <span>Security</span>
            <span>·</span>
            <span>Creator Fund</span>
            <span>·</span>
            <span>API</span>
          </div>
          <div className="text-[10px] text-neutral-600">
            © 2026 MIZIZI SOCIAL · NOIR EDITION
          </div>
        </footer>
      </aside>
    </div>
  );
};
