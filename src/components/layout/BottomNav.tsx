import React from 'react';
import { Home, Compass, Plus, Film, User as UserIcon } from 'lucide-react';
import { useSocial } from '../../context/SocialContext';

export const BottomNav: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setViewingProfileUserId,
    currentUser,
    setIsCreateModalOpen,
  } = useSocial();

  const handleProfileClick = () => {
    setViewingProfileUserId(currentUser.id);
    setCurrentView('profile');
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 px-3 flex items-center justify-around select-none"
      aria-label="Mobile Navigation"
    >
      {/* Home */}
      <button
        onClick={() => setCurrentView('feed')}
        className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
          currentView === 'feed'
            ? 'text-white font-bold'
            : 'text-neutral-500'
        }`}
        aria-label="Home Feed"
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      {/* Explore */}
      <button
        onClick={() => setCurrentView('explore')}
        className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
          currentView === 'explore'
            ? 'text-white font-bold'
            : 'text-neutral-500'
        }`}
        aria-label="Explore"
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Discover</span>
      </button>

      {/* Create (+) matching oneImage.webp white button */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="min-h-[44px] min-w-[44px] flex flex-col items-center justify-center active:scale-95 transition-transform"
        aria-label="Create Post"
      >
        <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center shadow-lg shadow-white/10">
          <Plus className="w-5 h-5 stroke-[3]" />
        </div>
      </button>

      {/* Reels */}
      <button
        onClick={() => setCurrentView('reels')}
        className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
          currentView === 'reels'
            ? 'text-white font-bold'
            : 'text-neutral-500'
        }`}
        aria-label="Reels"
      >
        <Film className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Reels</span>
      </button>

      {/* Profile */}
      <button
        onClick={handleProfileClick}
        className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
          currentView === 'profile'
            ? 'text-white font-bold'
            : 'text-neutral-500'
        }`}
        aria-label="My Profile"
      >
        <img
          src={currentUser.avatarUrl}
          alt={currentUser.displayName}
          className={`w-6 h-6 rounded-full object-cover border ${
            currentView === 'profile'
              ? 'border-white ring-2 ring-white/30'
              : 'border-neutral-700'
          }`}
        />
        <span className="text-[10px] mt-0.5">Profile</span>
      </button>
    </nav>
  );
};
