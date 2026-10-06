import React, { useState } from 'react';
import {
  X,
  Heart,
  Bookmark,
  Send,
  MoreHorizontal,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { Post } from '../../types';

interface PostDetailModalProps {
  post: Post | null;
  onClose: () => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  const {
    currentUser,
    toggleLikePost,
    toggleSavePost,
    addComment,
    deleteComment,
    openUserProfile,
    startDirectMessage,
  } = useSocial();

  const [commentText, setCommentText] = useState('');

  if (!post) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 select-none">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white rounded-full bg-neutral-900/60 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-neutral-200 dark:border-neutral-800">
        {/* Media Frame (Left) */}
        <div className="w-full md:w-3/5 bg-neutral-950 flex items-center justify-center relative min-h-[300px]">
          <img
            src={post.media[0]?.url}
            alt={post.caption}
            referrerPolicy="no-referrer"
            className="w-full h-full max-h-[85vh] object-contain"
          />
        </div>

        {/* Info & Comments Sidebar (Right) */}
        <div className="w-full md:w-2/5 flex flex-col justify-between h-[50vh] md:h-auto border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800">
          {/* Header */}
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                openUserProfile(post.author.id);
              }}
              className="flex items-center gap-3 text-left"
            >
              <img
                src={post.author.avatarUrl}
                alt={post.author.displayName}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
                  <span>{post.author.displayName}</span>
                  {post.author.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  )}
                </div>
                <div className="text-[10px] text-neutral-400">
                  @{post.author.username} {post.location ? `· ${post.location}` : ''}
                </div>
              </div>
            </button>
          </div>

          {/* Comments and Caption Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {/* Author Caption */}
            <div className="flex items-start gap-3">
              <img
                src={post.author.avatarUrl}
                alt={post.author.displayName}
                className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
              />
              <div>
                <span className="font-bold mr-1.5 text-neutral-900 dark:text-neutral-100">
                  {post.author.username}
                </span>
                <span className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {post.caption}
                </span>
                <div className="text-[10px] text-neutral-400 mt-1">{post.createdAt}</div>
              </div>
            </div>

            {/* Comments List */}
            {post.comments.map(c => (
              <div key={c.id} className="flex items-start justify-between gap-2 group">
                <div className="flex items-start gap-2.5">
                  <img
                    src={c.userAvatar}
                    alt={c.username}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div>
                    <span className="font-bold mr-1.5 text-neutral-900 dark:text-neutral-100">
                      {c.username}
                    </span>
                    <span className="text-neutral-700 dark:text-neutral-300">{c.content}</span>
                    <div className="text-[10px] text-neutral-400 mt-0.5">{c.createdAt}</div>
                  </div>
                </div>

                {c.userId === currentUser.id && (
                  <button
                    onClick={() => deleteComment(post.id, c.id)}
                    className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="Delete comment"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Action Row & Input */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3 bg-neutral-50 dark:bg-neutral-950/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLikePost(post.id)}
                  className="hover:scale-110 transition-transform"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      post.isLiked
                        ? 'fill-rose-500 text-rose-500'
                        : 'text-neutral-700 dark:text-neutral-300'
                    }`}
                  />
                </button>
                <button
                  onClick={() => {
                    onClose();
                    startDirectMessage(post.author.id);
                  }}
                  className="hover:scale-110 transition-transform text-neutral-700 dark:text-neutral-300"
                >
                  <Send className="w-5.5 h-5.5" />
                </button>
              </div>

              <button
                onClick={() => toggleSavePost(post.id)}
                className="hover:scale-110 transition-transform"
              >
                <Bookmark
                  className={`w-6 h-6 ${
                    post.isSaved
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                />
              </button>
            </div>

            <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
              {post.likesCount.toLocaleString()} {post.likesCount === 1 ? 'like' : 'likes'}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-3 py-2 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold disabled:opacity-40 hover:bg-amber-400 transition-colors"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
