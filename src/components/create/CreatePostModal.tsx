import React, { useState } from 'react';
import {
  X,
  Sparkles,
  MapPin,
  Hash,
  Image as ImageIcon,
  Check,
  Loader2,
  Upload,
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { generateSocialCaption } from '../../services/geminiService';

import imgZanzibar from '../../assets/images/post_zanzibar_sunset_1791302420289.jpg';
import imgFashion from '../../assets/images/post_african_fashion_1791302431551.jpg';
import imgTech from '../../assets/images/post_tech_workspace_1791302441363.jpg';
import imgSerengeti from '../../assets/images/post_wildlife_serengeti_1791302450770.jpg';
import imgKilimanjaro from '../../assets/images/reel_kilimanjaro_trek_1791302463243.jpg';

const PRESET_IMAGES = [
  { label: 'Zanzibar Sunset', url: imgZanzibar },
  { label: 'East African Couture', url: imgFashion },
  { label: 'Tech Workspace', url: imgTech },
  { label: 'Serengeti Safari', url: imgSerengeti },
  { label: 'Kilimanjaro Summit', url: imgKilimanjaro },
];

export const CreatePostModal: React.FC = () => {
  const { isCreateModalOpen, setIsCreateModalOpen, createPost, currentUser } = useSocial();

  const [selectedImage, setSelectedImage] = useState<string>(PRESET_IMAGES[0].url);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [hashtagsInput, setHashtagsInput] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [selectedTone, setSelectedTone] = useState<'aesthetic' | 'inspirational' | 'playful' | 'business'>('aesthetic');

  if (!isCreateModalOpen) return null;

  const handleAICaption = async () => {
    setIsGeneratingAI(true);
    try {
      const promptContext = caption.trim() || location.trim() || 'A vibrant creative moment captured on MIZIZI SOCIAL';
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() && !selectedImage) return;

    const tags = hashtagsInput
      .split(/\s+/)
      .filter(t => t.startsWith('#'))
      .map(t => t.replace('#', ''));

    createPost(caption.trim(), selectedImage, location.trim(), tags);
    // Reset form
    setCaption('');
    setLocation('');
    setHashtagsInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={() => setIsCreateModalOpen(false)} />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-neutral-200 dark:border-neutral-800 animate-in zoom-in-95">
        {/* Left Side: Media Selector & Preview */}
        <div className="w-full md:w-1/2 bg-neutral-950 p-4 flex flex-col justify-between">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800">
            <img
              src={selectedImage}
              alt="Post preview"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Quick presets picker */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
              <span>Choose High-Def Asset</span>
              <label className="cursor-pointer text-amber-400 hover:text-amber-300 flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {PRESET_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImage === img.url
                      ? 'border-amber-500 scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  title={img.label}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form & AI Tools */}
        <div className="w-full md:w-1/2 flex flex-col justify-between p-5 space-y-4 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                Create New Post
              </span>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Caption Input */}
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Caption
              </label>
              <textarea
                rows={4}
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Write a caption... What is the story behind this visual?"
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
              />
            </div>

            {/* AI Caption Generator Panel */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>MIZIZI AI Caption Assistant</span>
                </div>

                <div className="flex gap-1">
                  {(['aesthetic', 'inspirational', 'playful'] as const).map(tone => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setSelectedTone(tone)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors capitalize ${
                        selectedTone === tone
                          ? 'bg-amber-500 text-neutral-950 font-bold'
                          : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
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
                className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isGeneratingAI ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating creative copy...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate AI Caption & Hashtags</span>
                  </>
                )}
              </button>
            </div>

            {/* Location Tag */}
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>Add Location</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Stone Town, Zanzibar / Nairobi Tech District"
                className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Hashtags */}
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-neutral-400" />
                <span>Hashtags</span>
              </label>
              <input
                type="text"
                value={hashtagsInput}
                onChange={e => setHashtagsInput(e.target.value)}
                placeholder="#MiziziSocial #VisualCulture #Creativity"
                className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex justify-end gap-2 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!caption.trim() && !selectedImage}
                className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors disabled:opacity-40"
              >
                Share Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
