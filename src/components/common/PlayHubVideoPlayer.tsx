import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Lock,
  Crown,
  Sparkles,
  Maximize2,
  RotateCcw,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';

// Reliable fallback videos if external host fails
const FALLBACK_VIDEOS = [
  'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
];

interface PlayHubVideoPlayerProps {
  src: string;
  poster?: string;
  aspectRatio?: '1:1' | '4:3' | '16:9' | '9:16';
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  isSubscriberOnly?: boolean;
  teaserDuration?: number; // seconds of free preview before paywall triggers (default: 5)
  className?: string;
  title?: string;
  authorName?: string;
  onPaywallTrigger?: () => void;
}

export const PlayHubVideoPlayer: React.FC<PlayHubVideoPlayerProps> = ({
  src,
  poster,
  aspectRatio = '16:9',
  autoPlay = false,
  loop = true,
  muted = true,
  isSubscriberOnly = false,
  teaserDuration = 5,
  className = '',
  title,
  authorName,
  onPaywallTrigger,
}) => {
  const { isSubscribed, setIsSubscriptionModalOpen, subscribeUser } = useSocial();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasPaywalled, setHasPaywalled] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  // Keep src in sync if prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setVideoError(false);
    setHasPaywalled(false);
  }, [src]);

  // Handle paywall access
  const isLocked = isSubscriberOnly && !isSubscribed;

  // Handle video error gracefully by switching to fallback video source
  const handleVideoError = () => {
    if (fallbackIndex < FALLBACK_VIDEOS.length) {
      const nextFallback = FALLBACK_VIDEOS[fallbackIndex];
      setFallbackIndex(prev => prev + 1);
      setCurrentSrc(nextFallback);
    } else {
      setVideoError(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // If content requires subscription and user is not subscribed
    if (isLocked && time >= teaserDuration && !hasPaywalled) {
      videoRef.current.pause();
      setIsPlaying(false);
      setHasPaywalled(true);
      if (onPaywallTrigger) {
        onPaywallTrigger();
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 15);
      if (autoPlay && !isLocked) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
          // Autoplay blocked by browser policy; safe ignore
          setIsPlaying(false);
        });
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isLocked && hasPaywalled) {
      setIsSubscriptionModalOpen(true);
      return;
    }

    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = parseFloat(e.target.value);
    if (isLocked && nextTime > teaserDuration) {
      setIsSubscriptionModalOpen(true);
      return;
    }
    if (videoRef.current) {
      videoRef.current.currentTime = nextTime;
      setCurrentTime(nextTime);
    }
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else {
        containerRef.current.requestFullscreen().catch(() => {});
      }
    }
  };

  const handleReplayTeaser = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setHasPaywalled(false);
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const aspectClass =
    aspectRatio === '9:16'
      ? 'aspect-[9/16]'
      : aspectRatio === '1:1'
      ? 'aspect-square'
      : aspectRatio === '4:3'
      ? 'aspect-[4/3]'
      : 'aspect-video';

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${aspectClass} bg-black overflow-hidden select-none group ${className}`}
    >
      {/* Video Element with error catching */}
      {!videoError ? (
        <video
          ref={videoRef}
          src={currentSrc}
          poster={poster}
          playsInline
          loop={loop && !isLocked}
          muted={isMuted}
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleVideoError}
          onClick={togglePlay}
          className={`w-full h-full object-cover cursor-pointer transition-all duration-500 ${
            hasPaywalled && isLocked ? 'filter blur-md scale-105' : ''
          }`}
        />
      ) : (
        /* Resilient fallback if all video streams fail */
        <div
          onClick={togglePlay}
          className="w-full h-full relative flex items-center justify-center bg-[#151515] cursor-pointer"
        >
          {poster && (
            <img
              src={poster}
              alt="Video Poster"
              className="w-full h-full object-cover opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col items-center justify-center p-4 text-center">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2">
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </div>
            <p className="text-xs font-bold text-white">4K Creator Stream Preview</p>
            <p className="text-[10px] text-neutral-400">PlayHub Ultra HD Player</p>
          </div>
        </div>
      )}

      {/* Top Badges & Status Indicators */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-1.5">
          {isSubscriberOnly && (
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-lg backdrop-blur-md ${
                isSubscribed
                  ? 'bg-amber-400 text-black'
                  : 'bg-black/70 text-amber-300 border border-amber-400/30'
              }`}
            >
              <Crown className="w-3 h-3" />
              <span>{isSubscribed ? 'VIP UNLOCKED' : 'VIP EXCLUSIVE'}</span>
            </span>
          )}

          {isLocked && !hasPaywalled && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md text-white">
              Free Teaser: {Math.max(0, Math.ceil(teaserDuration - currentTime))}s
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Center Play Button (When paused & not locked) */}
      {!isPlaying && !hasPaywalled && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors z-10"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform">
            <Play className="w-7 h-7 fill-black ml-1" />
          </div>
        </button>
      )}

      {/* PLAYHUB SUBSCRIPTION PAYWALL OVERLAY (When locked content reaches teaser limit) */}
      {isLocked && hasPaywalled && (
        <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-black flex items-center justify-center shadow-xl shadow-amber-500/20 mb-3 animate-pulse">
            <Lock className="w-7 h-7 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 text-xs font-bold border border-amber-400/20 mb-2">
            <Crown className="w-3.5 h-3.5" />
            <span>PLAYHUB BUSINESS PAYWALL</span>
          </div>

          <h3 className="font-display font-extrabold text-base sm:text-lg text-white mb-1">
            Free Preview Ended
          </h3>

          <p className="text-xs text-neutral-300 max-w-sm mb-4 leading-relaxed">
            Entering is free, but watching full 4K videos requires a VIP subscription. Unlock unlimited videos & creator perks now!
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-xs">
            <button
              type="button"
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
            >
              <Crown className="w-4 h-4 fill-black" />
              <span>Subscribe & Unlock ($4.99/mo)</span>
            </button>

            <button
              type="button"
              onClick={() => subscribeUser('monthly')}
              className="w-full py-2 px-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors border border-white/10"
              title="Instant activation for quick testing"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>1-Click Test VIP Unlock</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleReplayTeaser}
            className="mt-3 text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Replay Free Teaser</span>
          </button>
        </div>
      )}

      {/* Bottom Video Controls Scrubber */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Scrubber Bar */}
        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white hover:h-1.5 transition-all"
          />

          {/* Marker for Free Teaser Cutoff on Locked Videos */}
          {isLocked && duration > 0 && (
            <div
              className="absolute top-0 bottom-0 w-1 bg-amber-400 pointer-events-none rounded-full"
              style={{ left: `${Math.min(100, (teaserDuration / duration) * 100)}%` }}
              title="End of free teaser"
            />
          )}
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="p-1 hover:text-amber-300 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <span className="text-[10px] font-mono text-neutral-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isSubscriberOnly && (
              <span className="text-[10px] text-amber-300 font-bold hidden sm:inline">
                {isSubscribed ? 'VIP Pass Active' : 'Teaser Preview'}
              </span>
            )}

            <button
              type="button"
              onClick={handleFullscreen}
              className="p-1 text-neutral-300 hover:text-white transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
