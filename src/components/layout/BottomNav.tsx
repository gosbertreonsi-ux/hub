import React from 'react';
import { Home, Compass, PlusSquare, Film } from 'lucide-react';
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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 px-2 flex items-center justify-around"
      aria-label="Mobile Navigation"
    >
      {/* Home */}
      <button
        onClick={() => setCurrentView('feed')}
        className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center ${
          currentView === 'feed'
            ? 'text-amber-500 font-semibold'
            : 'text-neutral-500 dark:text-neutral-400'
        }`}
        aria-label="Home Feed"
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      {/* Explore */}
      <button
        onClick={() => setCurrentView('explore')}
        className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center ${
          currentView === 'explore'
            ? 'text-amber-500 font-semibold'
            : 'text-neutral-500 dark:text-neutral-400'
        }`}
        aria-label="Explore"
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Explore</span>
      </button>

      {/* Create (+) */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="min-h-[44px] min-w-[44px] flex flex-col items-center justify-center text-amber-500 hover:scale-105 active:scale-95 transition-transform"
        aria-label="Create Post"
      >
        <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center shadow-md shadow-amber-500/20">
          <PlusSquare className="w-5 h-5 text-neutral-950" />
        </div>
      </button>

      {/* Reels */}
      <button
        onClick={() => setCurrentView('reels')}
        className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center ${
          currentView === 'reels'
            ? 'text-amber-500 font-semibold'
            : 'text-neutral-500 dark:text-neutral-400'
        }`}
        aria-label="Reels"
      >
        <Film className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Reels</span>
      </button>

      {/* Profile */}
      <button
        onClick={handleProfileClick}
        className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center ${
          currentView === 'profile'
            ? 'text-amber-500 font-semibold'
            : 'text-neutral-500 dark:text-neutral-400'
        }`}
        aria-label="My Profile"
      >
        <img
          src={currentUser.avatarUrl}
          alt={currentUser.displayName}
          className={`w-6 h-6 rounded-full object-cover border ${
            currentView === 'profile'
              ? 'border-amber-500 ring-2 ring-amber-500/30'
              : 'border-neutral-300 dark:border-neutral-700'
          }`}
        />
        <span className="text-[10px] mt-0.5">Profile</span>
      </button>
    </nav>
  );
};
