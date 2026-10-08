import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Music,
  ChevronUp,
  ChevronDown,
  Share2,
  Plus,
  Crown,
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { PlayHubVideoPlayer } from '../common/PlayHubVideoPlayer';

export const ReelsView: React.FC = () => {
  const {
    reels,
    toggleLikeReel,
    toggleSaveReel,
    toggleFollowUser,
    isFollowing,
    openUserProfile,
    setIsCreateModalOpen,
    isSubscribed,
    setIsSubscriptionModalOpen,
  } = useSocial();

  const [activeIndex, setActiveIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentReel = reels[activeIndex] || reels[0];

  const handlePrev = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  const handleNext = () => {
    if (activeIndex < reels.length - 1) setActiveIndex(activeIndex + 1);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setToastMessage('Reel link copied to clipboard!');
    setTimeout(() => setToastMessage(null), 2200);
  };

  const handleOpenComments = () => {
    setToastMessage(`Viewing comments for @${currentReel.username}'s reel`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  if (!currentReel) return null;

  return (
    <div className="max-w-4xl mx-auto px-2 py-4 flex items-center justify-center min-h-[calc(100vh-5rem)] select-none text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-white text-black text-xs font-extrabold shadow-2xl border border-white/20 animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Main Reels Frame */}
      <div className="relative flex items-center gap-6">
        {/* Vertical Reel Theater Card */}
        <div className="relative w-full max-w-[390px] sm:w-[390px] h-[84vh] max-h-[780px] rounded-[36px] overflow-hidden bg-black shadow-2xl border border-white/10 flex flex-col justify-between group">
          {/* Robust PlayHub Video Player with Built-in Paywall Teaser */}
          <div className="absolute inset-0 w-full h-full">
            <PlayHubVideoPlayer
              key={currentReel.id}
              src={currentReel.videoUrl}
              poster={currentReel.userAvatar}
              aspectRatio="9:16"
              autoPlay={true}
              loop={true}
              muted={false}
              isSubscriberOnly={currentReel.isSubscriberOnly ?? true}
              teaserDuration={5}
              title={currentReel.caption}
              authorName={currentReel.username}
            />
          </div>

          {/* Top Bar */}
          <div className="relative z-20 p-5 flex items-center justify-between text-white pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="font-serif italic font-bold text-base tracking-tight text-white">
                Reels
              </span>
              <span className="text-[10px] text-neutral-400 font-semibold">
                · Mizizi
              </span>
              {currentReel.isSubscriberOnly && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400 text-black flex items-center gap-1 shadow">
                  <Crown className="w-2.5 h-2.5" />
                  VIP
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isSubscribed && (
                <button
                  type="button"
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="px-2.5 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-[10px] flex items-center gap-1 shadow-md transition-colors"
                >
                  <Crown className="w-3 h-3 fill-black" />
                  <span>Get VIP</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-3 py-1.5 rounded-full bg-white text-black font-extrabold text-[11px] flex items-center gap-1 shadow-lg hover:bg-neutral-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Upload</span>
              </button>
            </div>
          </div>

          {/* Bottom Info Overlay */}
          <div className="relative z-20 p-5 space-y-3 text-white pointer-events-auto">
            {/* Creator Row */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => openUserProfile(currentReel.userId)}
                className="flex items-center gap-3 text-left focus:outline-none"
              >
                <img
                  src={currentReel.userAvatar}
                  alt={currentReel.username}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                />
                <span className="font-bold text-sm text-white">
                  @{currentReel.username}
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleFollowUser(currentReel.userId)}
                className={`text-xs font-bold px-4 py-1.5 rounded-full border transition-all ${
                  isFollowing(currentReel.userId)
                    ? 'border-white/30 text-white/80 bg-black/40'
                    : 'bg-white border-white text-black hover:bg-neutral-200'
                }`}
              >
                {isFollowing(currentReel.userId) ? 'Following' : 'Follow'}
              </button>
            </div>

            {/* Caption */}
            <p className="text-xs text-white leading-relaxed line-clamp-3">
              {currentReel.caption}
            </p>

            {/* Music Audio Tag */}
            <div className="flex items-center gap-2 text-[11px] text-neutral-300 pt-1">
              <Music className="w-3.5 h-3.5 text-white shrink-0" />
              <span className="truncate">{currentReel.musicTitle}</span>
            </div>
          </div>
        </div>

        {/* Right Vertical Action Column */}
        <div className="flex flex-col items-center gap-4 text-white">
          {/* Like */}
          <button
            type="button"
            onClick={() => toggleLikeReel(currentReel.id)}
            className="flex flex-col items-center gap-1 group focus:outline-none"
          >
            <div className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
              <Heart
                className={`w-6 h-6 ${
                  currentReel.isLiked ? 'fill-white text-white' : 'text-neutral-300'
                }`}
              />
            </div>
            <span className="text-[11px] font-extrabold tabular-nums">
              {currentReel.likesCount.toLocaleString()}
            </span>
          </button>

          {/* Comments */}
          <button
            type="button"
            onClick={handleOpenComments}
            className="flex flex-col items-center gap-1 group focus:outline-none"
          >
            <div className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 text-neutral-300" />
            </div>
            <span className="text-[11px] font-extrabold tabular-nums">
              {currentReel.commentsCount}
            </span>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="flex flex-col items-center gap-1 group focus:outline-none"
          >
            <div className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
              <Share2 className="w-6 h-6 text-neutral-300" />
            </div>
            <span className="text-[11px] font-extrabold tabular-nums">
              {currentReel.sharesCount}
            </span>
          </button>

          {/* Bookmark */}
          <button
            type="button"
            onClick={() => toggleSaveReel(currentReel.id)}
            className="flex flex-col items-center gap-1 group focus:outline-none"
          >
            <div className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
              <Bookmark
                className={`w-6 h-6 ${
                  currentReel.isSaved ? 'fill-white text-white' : 'text-neutral-300'
                }`}
              />
            </div>
          </button>

          {/* Navigation Up / Down */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className="p-2.5 rounded-full bg-[#1c1c1c] border border-white/10 disabled:opacity-20 hover:bg-[#282828] transition-colors"
              title="Previous Reel"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={activeIndex === reels.length - 1}
              className="p-2.5 rounded-full bg-[#1c1c1c] border border-white/10 disabled:opacity-20 hover:bg-[#282828] transition-colors"
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
