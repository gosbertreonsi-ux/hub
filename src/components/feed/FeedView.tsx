import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Plus,
  Smile,
  CheckCircle2,
  Share2,
  Trash2,
  Flag,
  Sparkles,
  Volume2,
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
    setCurrentView,
  } = useSocial();

  const [feedMode, setFeedMode] = useState<'discover' | 'following'>('discover');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [showHeartAnim, setShowHeartAnim] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Filter posts based on feedMode
  const displayedPosts = posts.filter(post => {
    if (feedMode === 'following') {
      return followingUserIds.includes(post.author.id) || post.author.id === currentUser.id;
    }
    return true; // discover mode shows all
  });

  // Suggested users to follow (excluding current user and already followed)
  const suggestedUsers = allUsers.filter(
    u => u.id !== currentUser.id && !followingUserIds.includes(u.id)
  ).slice(0, 5);

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
    setShareToast('Thank you. Post submitted for safety review.');
    setTimeout(() => setShareToast(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 md:py-6 flex gap-8 justify-center">
      {/* Toast Alert */}
      {shareToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-medium shadow-xl border border-neutral-700 animate-in fade-in slide-in-from-top-3">
          {shareToast}
        </div>
      )}

      {/* Main Center Column (Stories + Posts Feed) */}
      <div className="w-full max-w-[620px] space-y-6">
        {/* Stories Tray */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
            {/* Add Story Button */}
            <button
              onClick={() => setActiveStoryIndex(0)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              <div className="relative">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  className="w-16 h-16 rounded-full object-cover p-0.5 border-2 border-dashed border-amber-500/60 group-hover:border-amber-500 transition-colors"
                />
                <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-neutral-900">
                  <Plus className="w-3.5 h-3.5" />
                </span>
              </div>
              <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200 truncate max-w-[64px]">
                Your Story
              </span>
            </button>

            {/* Other User Stories */}
            {stories.map((story, idx) => (
              <button
                key={story.id}
                onClick={() => setActiveStoryIndex(idx)}
                className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
              >
                <div
                  className={`p-0.5 rounded-full transition-transform group-hover:scale-105 ${
                    story.isViewed
                      ? 'bg-neutral-300 dark:bg-neutral-700'
                      : 'bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-300'
                  }`}
                >
                  <img
                    src={story.userAvatar}
                    alt={story.username}
                    className="w-15 h-15 rounded-full object-cover ring-2 ring-white dark:ring-neutral-900"
                  />
                </div>
                <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200 truncate max-w-[64px]">
                  {story.username.split('_')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Feed Mode Segmented Control (Interactive Button Tabs as permitted by Constitution) */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3 px-1">
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
            <button
              onClick={() => setFeedMode('discover')}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                feedMode === 'discover'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              For You
            </button>
            <button
              onClick={() => setFeedMode('following')}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                feedMode === 'following'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              Following ({followingUserIds.length})
            </button>
          </div>

          <span className="text-xs text-neutral-400">
            {displayedPosts.length} posts
          </span>
        </div>

        {/* Empty state */}
        {displayedPosts.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
            <p className="text-neutral-500 text-sm">No posts to display in this feed yet.</p>
            <button
              onClick={() => setFeedMode('discover')}
              className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-semibold text-xs hover:bg-amber-400 transition-colors"
            >
              Switch to For You
            </button>
          </div>
        )}

        {/* Posts Stream */}
        <div className="space-y-6">
          {displayedPosts.map(post => {
            const isAuthor = post.author.id === currentUser.id;
            return (
              <article
                key={post.id}
                className="rounded-2xl bg-white dark:bg-neutral-900/80 border border-neutral-200/90 dark:border-neutral-800/80 shadow-xs overflow-hidden transition-colors"
              >
                {/* Post Header */}
                <header className="p-3.5 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/50">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openUserProfile(post.author.id)}
                      className="group flex items-center gap-3 text-left focus:outline-none"
                    >
                      <img
                        src={post.author.avatarUrl}
                        alt={post.author.displayName}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-700 group-hover:opacity-90"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 group-hover:underline">
                            {post.author.displayName}
                          </span>
                          {post.author.isVerified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                          <span>@{post.author.username}</span>
                          {post.location && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="truncate max-w-[150px]">{post.location}</span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span>{post.createdAt}</span>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Top Right Options */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)
                      }
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg"
                      aria-label="Post actions"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {/* Dropdown Menu */}
                    {activeMenuPostId === post.id && (
                      <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl py-1 z-30">
                        {isAuthor ? (
                          <button
                            onClick={() => {
                              deletePost(post.id);
                              setActiveMenuPostId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-left"
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
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-left"
                            >
                              <span>{isFollowing(post.author.id) ? 'Unfollow' : 'Follow'} @{post.author.username}</span>
                            </button>
                            <button
                              onClick={() => handleReport(post)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-left"
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
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-left"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </button>
                      </div>
                    )}
                  </div>
                </header>

                {/* Post Media with double-tap heart */}
                <div
                  className="relative aspect-square sm:aspect-4/3 bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center overflow-hidden cursor-pointer select-none"
                  onDoubleClick={() => handleDoubleTapLike(post.id)}
                >
                  <img
                    src={post.media[0]?.url}
                    alt={post.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.01]"
                  />

                  {/* Double tap heart animation */}
                  {showHeartAnim === post.id && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-in zoom-in-50 duration-200">
                      <Heart className="w-24 h-24 fill-rose-500 text-rose-500 drop-shadow-2xl" />
                    </div>
                  )}

                  {/* Sponsored tag if applicable */}
                  {post.isSponsored && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-neutral-900/80 backdrop-blur-md text-amber-300 text-[10px] font-semibold tracking-wide uppercase">
                      Sponsored · {post.sponsoredBrand}
                    </div>
                  )}
                </div>

                {/* Action Bar (Like, Comment, Share, Save) */}
                <div className="p-3.5 space-y-2.5">
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
                              ? 'fill-rose-500 text-rose-500 scale-110'
                              : 'text-neutral-700 dark:text-neutral-300 group-hover:text-rose-500'
                          }`}
                        />
                      </button>

                      {/* Comment */}
                      <button
                        onClick={() => {
                          const el = document.getElementById(`comment-input-${post.id}`);
                          el?.focus();
                        }}
                        className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                        aria-label="Comment"
                      >
                        <MessageCircle className="w-6 h-6" />
                      </button>

                      {/* Direct Message / Share */}
                      <button
                        onClick={() => startDirectMessage(post.author.id)}
                        className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                        aria-label="Send direct message"
                      >
                        <Send className="w-5.5 h-5.5" />
                      </button>
                    </div>

                    {/* Bookmark / Save */}
                    <button
                      onClick={() => toggleSavePost(post.id)}
                      className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white focus:outline-none"
                      aria-label={post.isSaved ? 'Remove from saved' : 'Save post'}
                    >
                      <Bookmark
                        className={`w-6 h-6 ${
                          post.isSaved ? 'fill-amber-500 text-amber-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Likes Count (Clean tabular number) */}
                  <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                    {post.likesCount.toLocaleString()} {post.likesCount === 1 ? 'like' : 'likes'}
                  </div>

                  {/* Caption & Clean Unboxed Hashtags */}
                  <div className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed space-y-1">
                    <p>
                      <button
                        onClick={() => openUserProfile(post.author.id)}
                        className="font-bold mr-1.5 hover:underline focus:outline-none"
                      >
                        {post.author.username}
                      </button>
                      <span>{post.caption}</span>
                    </p>
                  </div>

                  {/* Comments Preview */}
                  {post.comments.length > 0 && (
                    <div className="pt-1 space-y-1.5 border-t border-neutral-100 dark:border-neutral-800/40">
                      <div className="text-[11px] text-neutral-400 font-medium">
                        Comments ({post.comments.length})
                      </div>
                      {post.comments.slice(-2).map(c => (
                        <div key={c.id} className="text-xs flex items-start gap-1.5">
                          <button
                            onClick={() => openUserProfile(c.userId)}
                            className="font-bold text-neutral-900 dark:text-neutral-100 hover:underline shrink-0"
                          >
                            {c.username}
                          </button>
                          <span className="text-neutral-700 dark:text-neutral-300 flex-1">
                            {c.content}
                          </span>
                          <span className="text-[10px] text-neutral-400 shrink-0">
                            {c.createdAt}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Input Form */}
                  <form
                    onSubmit={e => handleCommentSubmit(post.id, e)}
                    className="pt-2 flex items-center gap-2 border-t border-neutral-100 dark:border-neutral-800/40"
                  >
                    <input
                      id={`comment-input-${post.id}`}
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={e =>
                        setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))
                      }
                      className="flex-1 bg-transparent text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none py-1"
                    />

                    {/* Quick Emojis */}
                    <div className="flex items-center gap-1">
                      {['❤️', '🔥', '✨'].map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() =>
                            setCommentInputs(prev => ({
                              ...prev,
                              [post.id]: (prev[post.id] || '') + emoji,
                            }))
                          }
                          className="text-xs hover:scale-125 transition-transform px-0.5"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={!commentInputs[post.id]?.trim()}
                      className="text-xs font-bold text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed hover:text-amber-400 px-2 py-1"
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

      {/* Right Desktop Suggestions Column (1440px desktop baseline) */}
      <aside className="hidden lg:block w-76 shrink-0 space-y-6 select-none">
        {/* Current User Card */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
          <button
            onClick={() => openUserProfile(currentUser.id)}
            className="flex items-center gap-3 text-left focus:outline-none min-w-0"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-11 h-11 rounded-full object-cover ring-1 ring-neutral-300 dark:ring-neutral-700 shrink-0"
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate flex items-center gap-1">
                <span>{currentUser.displayName}</span>
                {currentUser.isVerified && (
                  <CheckCircle2 className="w-3 h-3 text-amber-500 shrink-0" />
                )}
              </div>
              <div className="text-[11px] text-neutral-400 truncate">
                @{currentUser.username}
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentView('profile')}
            className="text-[11px] font-bold text-amber-500 hover:text-amber-400"
          >
            View
          </button>
        </div>

        {/* Suggested Creators & Friends */}
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-500 dark:text-neutral-400">
              Suggested for you
            </span>
            <button
              onClick={() => setCurrentView('explore')}
              className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 hover:underline"
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
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {user.displayName}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate">
                      {user.category || `@${user.username}`}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => toggleFollowUser(user.id)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    isFollowing(user.id)
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                      : 'bg-amber-500 text-neutral-950 hover:bg-amber-400'
                  }`}
                >
                  {isFollowing(user.id) ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quiet Platform Footer */}
        <footer className="px-2 text-[11px] text-neutral-400 space-y-2">
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <span>About</span>
            <span>·</span>
            <span>Help</span>
            <span>·</span>
            <span>Privacy</span>
            <span>·</span>
            <span>Terms</span>
            <span>·</span>
            <span>Locations</span>
            <span>·</span>
            <span>Language</span>
          </div>
          <div className="text-[10px] text-neutral-500">
            © 2026 MIZIZI SOCIAL PLATFORM
          </div>
        </footer>
      </aside>
    </div>
  );
};
