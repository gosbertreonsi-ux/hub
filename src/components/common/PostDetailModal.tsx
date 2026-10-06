import React, { useState } from 'react';
import {
  X,
  Heart,
  Bookmark,
  Send,
  MoreHorizontal,
  CheckCircle2,
  Trash2,
  Play,
  Film,
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

  const isVideo = post.media[0]?.type === 'video';

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-6 select-none text-white animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 text-neutral-400 hover:text-white rounded-full bg-white/10 backdrop-blur-md transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Modal Dialog Card matching oneImage.webp */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-[#111111] rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10">
        {/* Media Frame (Left) */}
        <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative min-h-[320px]">
          {isVideo ? (
            <video
              src={post.media[0]?.url}
              controls
              autoPlay
              loop
              playsInline
              className="w-full h-full max-h-[85vh] object-contain"
            />
          ) : (
            <img
              src={post.media[0]?.url}
              alt={post.caption}
              referrerPolicy="no-referrer"
              className="w-full h-full max-h-[85vh] object-contain"
            />
          )}
        </div>

        {/* Info & Comments Sidebar (Right) */}
        <div className="w-full md:w-2/5 flex flex-col justify-between h-[50vh] md:h-auto border-t md:border-t-0 md:border-l border-white/10 bg-[#141414]">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
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
                className="w-9 h-9 rounded-full object-cover ring-1 ring-white/20"
              />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{post.author.displayName}</span>
                  {post.author.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 fill-white text-black shrink-0" />
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
                className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-white/20"
              />
              <div>
                <span className="font-bold mr-1.5 text-white">
                  {post.author.username}
                </span>
                <span className="text-neutral-300 leading-relaxed">
                  {post.caption}
                </span>
                <div className="text-[10px] text-neutral-500 mt-1">{post.createdAt}</div>
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
                    <span className="font-bold mr-1.5 text-white">
                      {c.username}
                    </span>
                    <span className="text-neutral-300">{c.content}</span>
                    <div className="text-[10px] text-neutral-500 mt-0.5">{c.createdAt}</div>
                  </div>
                </div>

                {c.userId === currentUser.id && (
                  <button
                    onClick={() => deleteComment(post.id, c.id)}
                    className="text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="Delete comment"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Action Row & Input matching oneImage.webp */}
          <div className="p-4 border-t border-white/10 space-y-3 bg-[#111111]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLikePost(post.id)}
                  className="hover:scale-110 transition-transform"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      post.isLiked
                        ? 'fill-white text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  />
                </button>
                <button
                  onClick={() => {
                    onClose();
                    startDirectMessage(post.author.id);
                  }}
                  className="hover:scale-110 transition-transform text-neutral-400 hover:text-white"
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
                      ? 'fill-white text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                />
              </button>
            </div>

            <div className="text-xs font-bold text-white tabular-nums">
              {post.likesCount.toLocaleString()} {post.likesCount === 1 ? 'like' : 'likes'}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 rounded-full bg-white text-black text-xs font-extrabold disabled:opacity-30 hover:bg-neutral-200 transition-colors"
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
