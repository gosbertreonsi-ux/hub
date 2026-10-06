import React, { useState } from 'react';
import { Send, Heart, Sun, Moon, Users, Download } from 'lucide-react';
import { useSocial } from '../../context/SocialContext';

export const TopHeader: React.FC = () => {
  const {
    setCurrentView,
    conversations,
    unreadNotificationsCount,
    theme,
    toggleTheme,
    currentUser,
    allUsers,
    switchUser,
    setIsDownloadModalOpen,
  } = useSocial();

  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const unreadMessagesCount = conversations.reduce(
    (acc, c) => acc + (c.unreadCount || 0),
    0
  );

  return (
    <header className="md:hidden sticky top-0 z-40 h-14 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 flex items-center justify-between">
      {/* Brand Title */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentView('feed')}
          className="font-display font-black text-xl tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-1.5"
        >
          <span className="text-amber-500">M</span>IZIZI
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Switch Persona */}
        <button
          onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
          className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 relative"
          title="Switch Persona"
        >
          <Users className="w-5 h-5" />
        </button>

        {/* Download Code Archive */}
        <button
          onClick={() => setIsDownloadModalOpen(true)}
          className="p-2 text-amber-500 hover:text-amber-400"
          title="Download Folder (.ZIP)"
          aria-label="Download Project ZIP"
        >
          <Download className="w-5 h-5" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => setCurrentView('notifications')}
          className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 relative"
          aria-label="Notifications"
        >
          <Heart className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          )}
        </button>

        {/* Direct Messages */}
        <button
          onClick={() => setCurrentView('messages')}
          className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 relative"
          aria-label="Direct Messages"
        >
          <Send className="w-5 h-5" />
          {unreadMessagesCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
              {unreadMessagesCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Persona Switcher Sheet */}
      {isSwitcherOpen && (
        <div className="absolute top-14 left-0 right-0 p-3 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-xl z-50">
          <div className="text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">
            Switch Persona (Current: {currentUser.displayName})
          </div>
          <div className="grid grid-cols-2 gap-2">
            {allUsers.map(u => (
              <button
                key={u.id}
                onClick={() => {
                  switchUser(u.id);
                  setIsSwitcherOpen(false);
                }}
                className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs ${
                  u.id === currentUser.id
                    ? 'bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/20'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                }`}
              >
                <img src={u.avatarUrl} alt={u.displayName} className="w-6 h-6 rounded-full object-cover" />
                <span className="truncate">{u.displayName}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
