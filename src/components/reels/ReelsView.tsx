import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Volume2,
  VolumeX,
  Music,
  ChevronUp,
  ChevronDown,
  Share2,
  Play,
  Pause,
  Plus,
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
    setIsCreateModalOpen,
  } = useSocial();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [shareToast, setShareToast] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentReel = reels[activeIndex] || reels[0];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [activeIndex]);

  const handlePrev = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  const handleNext = () => {
    if (activeIndex < reels.length - 1) setActiveIndex(activeIndex + 1);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  if (!currentReel) return null;

  return (
    <div className="max-w-4xl mx-auto px-2 py-4 flex items-center justify-center min-h-[calc(100vh-5rem)] select-none text-white">
      {/* Toast Alert */}
      {shareToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-white text-black text-xs font-extrabold shadow-2xl border border-white/20 animate-in fade-in">
          Reel link copied to clipboard!
        </div>
      )}

      {/* Main Reels Frame matching oneImage.webp phone screen */}
      <div className="relative flex items-center gap-6">
        {/* Vertical Reel Theater Card */}
        <div className="relative w-full max-w-[390px] sm:w-[390px] h-[84vh] max-h-[780px] rounded-[36px] overflow-hidden bg-black shadow-2xl border border-white/10 flex flex-col justify-between group">
          {/* HTML5 Native Video Player */}
          <video
            ref={videoRef}
            src={currentReel.videoUrl}
            loop
            playsInline
            muted={isMuted}
            autoPlay
            onClick={togglePlay}
            className="absolute inset-0 w-full h-full object-cover z-0 cursor-pointer"
          />

          {/* Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none z-10" />

          {/* Top Bar matching reference */}
          <div className="relative z-20 p-5 flex items-center justify-between text-white">
            <span className="font-display font-black text-sm tracking-widest uppercase">
              MIZIZI REELS
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-3 py-1.5 rounded-full bg-white text-black font-extrabold text-[11px] flex items-center gap-1 shadow-lg"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Upload</span>
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/90 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Center Play Indicator */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer bg-black/30"
            >
              <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl">
                <Play className="w-8 h-8 fill-black ml-1" />
              </div>
            </div>
          )}

          {/* Bottom Info Overlay */}
          <div className="relative z-20 p-5 space-y-3 text-white">
            {/* Creator Row */}
            <div className="flex items-center justify-between">
              <button
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

        {/* Right Vertical Action Column (Sleek Squircle / Pill Buttons matching oneImage.webp) */}
        <div className="flex flex-col items-center gap-4 text-white">
          {/* Like */}
          <button
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
            onClick={() => alert(`Comments view available in feed lightbox`)}
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
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className="p-2.5 rounded-full bg-[#1c1c1c] border border-white/10 disabled:opacity-20 hover:bg-[#282828] transition-colors"
              title="Previous Reel"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
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
