import React, { useState, useRef } from 'react';
import {
  X,
  Sparkles,
  MapPin,
  Hash,
  Image as ImageIcon,
  Film,
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Loader2,
  Check,
  Music,
  ArrowRight,
  Crown,
  Lock,
  Database,
  CloudUpload,
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { generateSocialCaption } from '../../services/geminiService';
import { api } from '../../services/api';

import imgZanzibar from '../../assets/images/post_zanzibar_sunset_1791302420289.jpg';
import imgFashion from '../../assets/images/post_african_fashion_1791302431551.jpg';
import imgTech from '../../assets/images/post_tech_workspace_1791302441363.jpg';
import imgSerengeti from '../../assets/images/post_wildlife_serengeti_1791302450770.jpg';
import imgKilimanjaro from '../../assets/images/reel_kilimanjaro_trek_1791302463243.jpg';

const PRESET_PHOTOS = [
  { label: 'Zanzibar Sunset', url: imgZanzibar },
  { label: 'East African Couture', url: imgFashion },
  { label: 'Tech Workspace', url: imgTech },
  { label: 'Serengeti Safari', url: imgSerengeti },
];

const PRESET_VIDEOS = [
  {
    label: 'Kilimanjaro Summit',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: imgKilimanjaro,
  },
  {
    label: 'Fashion Runway Studio',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: imgFashion,
  },
  {
    label: 'Zanzibar Dhow Sailing',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: imgZanzibar,
  },
];

export const CreatePostModal: React.FC = () => {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    createPost,
    createReel,
    currentUser,
    isSubscribed,
    setIsSubscriptionModalOpen,
    subscribeUser,
  } = useSocial();

  const [mediaKind, setMediaKind] = useState<'video' | 'image'>('video');
  const [postFormat, setPostFormat] = useState<'post' | 'reel'>('reel');

  // Media URLs
  const [selectedImage, setSelectedImage] = useState<string>(PRESET_PHOTOS[0].url);
  const [selectedVideo, setSelectedVideo] = useState<string>(PRESET_VIDEOS[0].url);
  const [uploadedVideoName, setUploadedVideoName] = useState<string>('');
  const [videoDuration, setVideoDuration] = useState<number>(0);

  // Video playback controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Post form details
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [musicTitle, setMusicTitle] = useState('Original Audio · ' + currentUser.username);
  const [hashtagsInput, setHashtagsInput] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [selectedTone, setSelectedTone] = useState<'aesthetic' | 'inspirational' | 'playful'>('aesthetic');
  const [isPaywallProtected, setIsPaywallProtected] = useState(true);
  const [isUploadingToDb, setIsUploadingToDb] = useState(false);
  const [dbStoragePath, setDbStoragePath] = useState<string | null>(null);

  if (!isCreateModalOpen) return null;

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedVideoName(file.name);
      setMediaKind('video');
      const blobUrl = URL.createObjectURL(file);
      setSelectedVideo(blobUrl);
      setIsPlaying(true);

      // Upload directly to server and database!
      setIsUploadingToDb(true);
      try {
        const res = await api.uploadMedia(file);
        if (res?.url) {
          setSelectedVideo(res.url);
          setDbStoragePath(res.url);
        }
      } catch (err: any) {
        console.warn('Direct video upload notice:', err.message);
      } finally {
        setIsUploadingToDb(false);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaKind('image');
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);

      // Direct upload to backend server storage & media table!
      setIsUploadingToDb(true);
      try {
        const res = await api.uploadMedia(file);
        if (res?.url) {
          setSelectedImage(res.url);
          setDbStoragePath(res.url);
        }
      } catch (err: any) {
        console.warn('Direct photo upload notice:', err.message);
      } finally {
        setIsUploadingToDb(false);
      }
    }
  };

  const handleTogglePlay = () => {
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

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleAICaption = async () => {
    setIsGeneratingAI(true);
    try {
      const promptContext =
        caption.trim() ||
        (mediaKind === 'video' ? 'Dynamic video storytelling clip' : 'Visual moment') +
          (location ? ` in ${location}` : '');
      const result = await generateSocialCaption(promptContext, selectedTone);
      setCaption(result.caption);
      if (result.hashtags && result.hashtags.length > 0) {
        setHashtagsInput(result.hashtags.map(t => `#${t.replace('#', '')}`).join(' '));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSubscribed) {
      setIsSubscriptionModalOpen(true);
      return;
    }

    const tags = hashtagsInput
      .split(/\s+/)
      .filter(t => t.startsWith('#'))
      .map(t => t.replace('#', ''));

    if (mediaKind === 'video') {
      if (postFormat === 'reel') {
        createReel(selectedVideo, caption.trim() || 'Visual Reel', musicTitle.trim(), isPaywallProtected);
      } else {
        createPost(caption.trim() || 'Video Upload', selectedVideo, location.trim(), tags, 'video', isPaywallProtected);
      }
    } else {
      createPost(caption.trim() || 'Visual Story', selectedImage, location.trim(), tags, 'image', isPaywallProtected);
    }

    // Reset
    setCaption('');
    setLocation('');
    setHashtagsInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={() => setIsCreateModalOpen(false)} />

      {/* Noir Modal Container matching oneImage.webp */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] bg-[#111111] text-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10 animate-in zoom-in-95">
        {/* Left Side: Media Stage (Video / Photo Player) */}
        <div className="w-full md:w-1/2 bg-[#0a0a0a] p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
          {/* Top Stage Bar: Kind Switcher */}
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-1.5 p-1 bg-[#1a1a1a] rounded-full border border-white/10">
              <button
                type="button"
                onClick={() => setMediaKind('video')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  mediaKind === 'video'
                    ? 'bg-white text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Video</span>
              </button>
              <button
                type="button"
                onClick={() => setMediaKind('image')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  mediaKind === 'image'
                    ? 'bg-white text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photo</span>
              </button>
            </div>

            {mediaKind === 'video' && (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-400 bg-[#1a1a1a] px-2.5 py-1 rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Video Player Ready</span>
              </div>
            )}
          </div>

          {/* Media Viewport */}
          <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center group">
            {/* Real Database Storage Status */}
            {isUploadingToDb && (
              <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-white">
                <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
                <span className="text-xs font-semibold">Uploading directly to server storage & DB...</span>
                <span className="text-[10px] text-neutral-400 font-mono">Writing record to media table</span>
              </div>
            )}

            {dbStoragePath && !isUploadingToDb && (
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-semibold text-emerald-300 backdrop-blur-md shadow-lg">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>DB Synced: {dbStoragePath.slice(0, 24)}...</span>
              </div>
            )}
            {mediaKind === 'video' ? (
              <>
                <video
                  ref={videoRef}
                  src={selectedVideo}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  onLoadedMetadata={e => setVideoDuration(Math.round(e.currentTarget.duration))}
                  onError={() => setSelectedVideo('https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4')}
                  className="w-full h-full object-cover"
                />

                {/* Video HUD Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

                {/* Center Play/Pause Trigger */}
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30"
                >
                  <div className="w-14 h-14 rounded-full bg-white/90 text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                    {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-1" />}
                  </div>
                </button>

                {/* Bottom Video Controls */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white z-20">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      className="p-1.5 rounded-full bg-black/60 hover:bg-black/90 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleToggleMute}
                      className="p-1.5 rounded-full bg-black/60 hover:bg-black/90 transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    {videoDuration > 0 && (
                      <span className="text-[10px] text-neutral-300 font-mono">
                        0:{videoDuration < 10 ? `0${videoDuration}` : videoDuration}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md">
                    {postFormat === 'reel' ? '9:16 Reel' : 'Feed Video'}
                  </span>
                </div>
              </>
            ) : (
              <img
                src={selectedImage}
                alt="Post preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Bottom Presets & Upload Button */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
              <span>{mediaKind === 'video' ? 'Select Video Asset' : 'Select Photo Asset'}</span>

              {/* Upload trigger */}
              <label className="cursor-pointer text-white hover:text-neutral-300 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1e1e1e] border border-white/10 transition-colors">
                <Upload className="w-3 h-3" />
                <span>Upload Device File</span>
                <input
                  type="file"
                  accept={mediaKind === 'video' ? 'video/mp4,video/webm,video/quicktime,video/*' : 'image/*'}
                  onChange={mediaKind === 'video' ? handleVideoUpload : handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Presets Grid */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {mediaKind === 'video'
                ? PRESET_VIDEOS.map((vid, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedVideo(vid.url);
                        setUploadedVideoName('');
                        setIsPlaying(true);
                      }}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        selectedVideo === vid.url
                          ? 'border-white scale-105 shadow-lg'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={vid.thumbnail} alt={vid.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-4 h-4 fill-white text-white" />
                      </div>
                    </button>
                  ))
                : PRESET_PHOTOS.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img.url)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        selectedImage === img.url
                          ? 'border-white scale-105 shadow-lg'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
            </div>

            {uploadedVideoName && (
              <div className="text-[11px] text-emerald-400 truncate flex items-center gap-1.5 pt-1">
                <Check className="w-3 h-3 shrink-0" />
                <span>Loaded file: {uploadedVideoName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Details, Format & Noir Publish Controls */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto space-y-4">
          {/* Top Bar Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-display font-extrabold text-xl text-white">
                New Publication
              </h3>
              <p className="text-xs text-neutral-400">
                Post high-definition videos, reels, and visual stories.
              </p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Creator Subscription Status Banner */}
            {!isSubscribed && (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border border-amber-400/30 text-amber-300 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="text-[11px] leading-tight text-neutral-200">
                    <span className="font-bold text-amber-300">Creator Pass Required:</span> Subscribed members can publish posts and reels.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => subscribeUser('monthly')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-amber-400 text-black font-extrabold text-[10px] hover:bg-amber-300 transition-colors"
                >
                  Unlock Free
                </button>
              </div>
            )}
            {/* Format Selector if Video (Reel vs Post) */}
            {mediaKind === 'video' && (
              <div className="space-y-1.5">
                <label className="block font-semibold text-neutral-300">
                  Publication Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPostFormat('reel')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      postFormat === 'reel'
                        ? 'bg-white text-black font-bold border-white'
                        : 'bg-[#181818] text-neutral-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>Vertical Reel</span>
                      <span>9:16</span>
                    </div>
                    <div className={`text-[10px] mt-0.5 ${postFormat === 'reel' ? 'text-neutral-700' : 'text-neutral-500'}`}>
                      Published to Reels feed & discovery
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPostFormat('post')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      postFormat === 'post'
                        ? 'bg-white text-black font-bold border-white'
                        : 'bg-[#181818] text-neutral-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>Feed Post</span>
                      <span>Standard</span>
                    </div>
                    <div className={`text-[10px] mt-0.5 ${postFormat === 'post' ? 'text-neutral-700' : 'text-neutral-500'}`}>
                      Published to Main Home feed
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Caption Input */}
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">
                Caption & Story
              </label>
              <textarea
                rows={3}
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Share the craft, context, and vision behind this upload..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#181818] border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* AI Caption Assistant */}
            <div className="p-3.5 rounded-2xl bg-[#181818] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
                  <span>AI Caption Generator</span>
                </div>

                <div className="flex gap-1">
                  {(['aesthetic', 'inspirational', 'playful'] as const).map(tone => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setSelectedTone(tone)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize transition-colors ${
                        selectedTone === tone
                          ? 'bg-white text-black font-bold'
                          : 'bg-[#242424] text-neutral-400'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleAICaption}
                disabled={isGeneratingAI}
                className="w-full py-2 rounded-xl bg-[#262626] hover:bg-[#303030] text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/5 transition-colors disabled:opacity-50"
              >
                {isGeneratingAI ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing copy...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
                    <span>Generate AI Caption & Hashtags</span>
                  </>
                )}
              </button>
            </div>

            {/* Location Tag */}
            <div>
              <label className="block font-semibold text-neutral-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>Location Tag</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Serengeti, Tanzania / Nairobi Creative Hub"
                className="w-full px-3.5 py-2 rounded-xl bg-[#181818] border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Audio Track (for Reels) */}
            {mediaKind === 'video' && postFormat === 'reel' && (
              <div>
                <label className="block font-semibold text-neutral-300 mb-1 flex items-center gap-1">
                  <Music className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Audio Track Title</span>
                </label>
                <input
                  type="text"
                  value={musicTitle}
                  onChange={e => setMusicTitle(e.target.value)}
                  placeholder="Original Audio · Title"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#181818] border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            )}

            {/* Hashtags */}
            <div>
              <label className="block font-semibold text-neutral-300 mb-1 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-neutral-400" />
                <span>Hashtags</span>
              </label>
              <input
                type="text"
                value={hashtagsInput}
                onChange={e => setHashtagsInput(e.target.value)}
                placeholder="#MiziziSocial #VideoCreator #AfricaStories"
                className="w-full px-3.5 py-2 rounded-xl bg-[#181818] border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* PlayHub VIP Monetization Paywall Toggle */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#1c180e] to-[#161410] border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-xs">
                  <Crown className="w-4 h-4 fill-amber-300" />
                  <span>PlayHub VIP Paywall</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPaywallProtected}
                    onChange={e => setIsPaywallProtected(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
                </label>
              </div>

              <p className="text-[11px] text-neutral-300 leading-snug">
                {isPaywallProtected
                  ? '🔒 Monetized: Entering is free. Viewers get a 5-second free teaser, then must have an active VIP subscription ($4.99/mo) to watch full video.'
                  : '🔓 Free Access: Anyone on the platform can watch the full video without a subscription.'}
              </p>
            </div>

            {/* Noir Style Pill Primary Button matching oneImage.webp ("Send Money >" / "Next >") */}
            <div className="pt-3 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2.5 rounded-full text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`px-7 py-3 rounded-full font-extrabold text-xs flex items-center gap-2 transition-all shadow-xl active:scale-95 ${
                  !isSubscribed
                    ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-amber-400/20'
                    : 'bg-white hover:bg-neutral-200 text-black'
                }`}
              >
                {!isSubscribed && <Crown className="w-4 h-4 fill-black" />}
                <span>
                  {!isSubscribed
                    ? 'Subscribe to Post (VIP Required)'
                    : mediaKind === 'video'
                    ? postFormat === 'reel'
                      ? 'Publish Reel'
                      : 'Publish Video'
                    : 'Publish Photo'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
