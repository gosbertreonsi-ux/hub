import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Send, Pause, Play } from 'lucide-react';
import { useSocial } from '../../context/SocialContext';

export const StoriesViewerModal: React.FC = () => {
  const {
    stories,
    activeStoryIndex,
    setActiveStoryIndex,
    markStoryViewed,
    sendMessage,
    conversations,
    startDirectMessage,
    currentUser,
  } = useSocial();

  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [reactionSent, setReactionSent] = useState<string | null>(null);

  const currentStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  useEffect(() => {
    if (activeStoryIndex === null || !currentStory) return;

    markStoryViewed(currentStory.id);
    setProgress(0);

    const DURATION_MS = 5000;
    const INTERVAL_MS = 50;
    const step = (INTERVAL_MS / DURATION_MS) * 100;

    const timer = setInterval(() => {
      if (!isPaused) {
        setProgress(prev => {
          if (prev >= 100) {
            // Next story or close
            if (activeStoryIndex < stories.length - 1) {
              setActiveStoryIndex(activeStoryIndex + 1);
              return 0;
            } else {
              setActiveStoryIndex(null);
              return 100;
            }
          }
          return prev + step;
        });
      }
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [activeStoryIndex, isPaused, stories.length]);

  if (activeStoryIndex === null || !currentStory) return null;

  const handleNext = () => {
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setProgress(0);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setProgress(0);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    // Send DM to story author
    startDirectMessage(currentStory.userId);
    // Find active conversation
    const conv = conversations.find(c =>
      c.participants.some(p => p.id === currentStory.userId) &&
      c.participants.some(p => p.id === currentUser.id)
    );
    if (conv) {
      sendMessage(conv.id, `Replied to your story: "${replyText.trim()}"`);
    }

    setReactionSent('Sent!');
    setReplyText('');
    setTimeout(() => setReactionSent(null), 2000);
  };

  const handleReaction = (emoji: string) => {
    startDirectMessage(currentStory.userId);
    const conv = conversations.find(c =>
      c.participants.some(p => p.id === currentStory.userId) &&
      c.participants.some(p => p.id === currentUser.id)
    );
    if (conv) {
      sendMessage(conv.id, `Reacted ${emoji} to your story`);
    }
    setReactionSent(emoji);
    setTimeout(() => setReactionSent(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-md select-none">
      {/* Close button */}
      <button
        onClick={() => setActiveStoryIndex(null)}
        className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white rounded-full bg-neutral-900/60 transition-colors"
        aria-label="Close story"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation arrows (desktop) */}
      {activeStoryIndex > 0 && (
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {activeStoryIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Story Container (Vertical 9:16 mobile frame) */}
      <div
        className="relative w-full max-w-[420px] h-[90vh] max-h-[820px] rounded-3xl overflow-hidden bg-neutral-900 shadow-2xl flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Story Background Media */}
        <img
          src={currentStory.mediaUrl}
          alt="Story content"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Dark Scrim overlay for top & bottom legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none z-10" />

        {/* Top Progress Bars & Header */}
        <div className="relative z-20 p-4 space-y-3">
          {/* Progress Bars */}
          <div className="flex gap-1.5 items-center">
            {stories.map((s, idx) => (
              <div
                key={s.id}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-75"
                  style={{
                    width:
                      idx < activeStoryIndex
                        ? '100%'
                        : idx === activeStoryIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* User Info & Pause Status */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <img
                src={currentStory.userAvatar}
                alt={currentStory.username}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white/60"
              />
              <div>
                <div className="text-xs font-bold leading-tight">
                  {currentStory.username}
                </div>
                <div className="text-[10px] text-white/70">
                  {currentStory.createdAt} · {currentStory.expiresAt}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-full text-white/80 hover:text-white"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Middle Tap Touch Zones for Mobile Next/Prev */}
        <div className="relative z-20 flex-1 flex">
          <div
            className="w-1/3 h-full cursor-pointer"
            onClick={handlePrev}
            title="Previous Story"
          />
          <div
            className="w-2/3 h-full cursor-pointer"
            onClick={handleNext}
            title="Next Story"
          />
        </div>

        {/* Floating reaction animation */}
        {reactionSent && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none animate-bounce text-4xl">
            {reactionSent}
          </div>
        )}

        {/* Bottom Story Caption, Reactions & Quick Reply Bar */}
        <div className="relative z-20 p-4 space-y-3 text-white">
          {currentStory.caption && (
            <p className="text-xs font-medium bg-black/40 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-white/95">
              {currentStory.caption}
            </p>
          )}

          {/* Quick Reactions Bar */}
          <div className="flex items-center justify-between px-2">
            {['❤️', '🔥', '👏', '😮', '😂'].map(emoji => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className="text-lg hover:scale-130 transition-transform p-1 focus:outline-none"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Reply Input Form */}
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Reply to ${currentStory.username}...`}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              className="flex-1 bg-black/50 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-xs text-white placeholder:text-white/60 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="p-2 rounded-full bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
