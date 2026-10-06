import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Volume2,
  VolumeX,
  Music,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { Reel } from '../../types';

export const ReelsView: React.FC = () => {
  const {
    reels,
    toggleLikeReel,
    toggleSaveReel,
    toggleFollowUser,
    isFollowing,
    openUserProfile,
    startDirectMessage,
  } = useSocial();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeCommentsReelId, setActiveCommentsReelId] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState(false);

  const currentReel = reels[activeIndex] || reels[0];

  const handlePrev = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  const handleNext = () => {
    if (activeIndex < reels.length - 1) setActiveIndex(activeIndex + 1);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  if (!currentReel) return null;

  return (
    <div className="max-w-4xl mx-auto px-2 py-4 flex items-center justify-center min-h-[calc(100vh-5rem)] select-none">
      {/* Toast Alert */}
      {shareToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-medium shadow-xl border border-neutral-700">
          Reel link copied to clipboard!
        </div>
      )}

      {/* Main Reels Theater Frame */}
      <div className="relative flex items-center gap-6">
        {/* Vertical Reel Card (9:16 Aspect Ratio) */}
        <div className="relative w-full max-w-[380px] sm:w-[380px] h-[82vh] max-h-[760px] rounded-3xl overflow-hidden bg-neutral-950 shadow-2xl border border-neutral-800 flex flex-col justify-between">
          {/* Background Visual Media / Simulated Video */}
          <img
            src={currentReel.videoUrl}
            alt={currentReel.caption}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          {/* Measured Dark Contrast Scrim as required by Constitution */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/50 pointer-events-none z-10" />

          {/* Top Bar: Title & Mute Toggle */}
          <div className="relative z-20 p-4 flex items-center justify-between text-white">
            <span className="font-display font-bold text-sm tracking-wide">
              MIZIZI REELS
            </span>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Bottom Info Overlay: Creator, Caption, Audio */}
          <div className="relative z-20 p-4 space-y-3 text-white">
            {/* Creator Row */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => openUserProfile(currentReel.userId)}
                className="flex items-center gap-2.5 text-left focus:outline-none"
              >
                <img
                  src={currentReel.userAvatar}
                  alt={currentReel.username}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500"
                />
                <span className="font-bold text-sm text-white">
                  @{currentReel.username}
                </span>
              </button>

              <button
                onClick={() => toggleFollowUser(currentReel.userId)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                  isFollowing(currentReel.userId)
                    ? 'border-white/40 text-white/80 bg-black/40'
                    : 'bg-amber-500 border-amber-500 text-neutral-950 hover:bg-amber-400'
                }`}
              >
                {isFollowing(currentReel.userId) ? 'Following' : 'Follow'}
              </button>
            </div>

            {/* Caption */}
            <p className="text-xs text-white/95 leading-relaxed line-clamp-3">
              {currentReel.caption}
            </p>

            {/* Music Audio Tag */}
            <div className="flex items-center gap-2 text-[11px] text-white/80 pt-1">
              <Music className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{currentReel.musicTitle}</span>
            </div>
          </div>
        </div>

        {/* Right Vertical Action Bar (Likes, Comments, Share, Bookmark) */}
        <div className="flex flex-col items-center gap-5 text-neutral-800 dark:text-neutral-200">
          {/* Like */}
          <button
            onClick={() => toggleLikeReel(currentReel.id)}
            className="flex flex-col items-center gap-1 group focus:outline-none"
          >
            <div className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-800 shadow-md group-hover:scale-110 transition-transform">
              <Heart
                className={`w-6 h-6 ${
                  currentReel.isLiked ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
            </div>
            <span className="text-[11px] font-bold tabular-nums">
              {currentReel.likesCount.toLocaleString()}
            </span>
          </button>

          {/* Comments */}
          <button
            onClick={() =>
              setActiveCommentsReelId(
                activeCommentsReelId === currentReel.id ? null : currentReel.id
              )
            }
            className="flex flex-col items-center gap-1 group focus:outline-none"
          >
            <div className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-800 shadow-md group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold tabular-nums">
              {currentReel.commentsCount}
            </span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 group focus:outline-none"
          >
            <div className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-800 shadow-md group-hover:scale-110 transition-transform">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold tabular-nums">
              {currentReel.sharesCount}
            </span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => toggleSaveReel(currentReel.id)}
            className="flex flex-col items-center gap-1 group focus:outline-none"
          >
            <div className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-800 shadow-md group-hover:scale-110 transition-transform">
              <Bookmark
                className={`w-6 h-6 ${
                  currentReel.isSaved ? 'fill-amber-500 text-amber-500' : ''
                }`}
              />
            </div>
          </button>

          {/* Navigation Up / Down */}
          <div className="pt-4 flex flex-col gap-2">
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 disabled:opacity-30 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
              title="Previous Reel"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={activeIndex === reels.length - 1}
              className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 disabled:opacity-30 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
              title="Next Reel"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
