import React, { useState } from 'react';
import {
  Send,
  Heart,
  Menu,
  Plus,
  Crown,
  X,
  UserPlus,
  Trash2,
  Download,
  BarChart3,
  ShieldAlert,
  Moon,
  Sun,
  LogOut,
  Users,
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';

export const TopHeader: React.FC = () => {
  const {
    setCurrentView,
    conversations,
    unreadNotificationsCount,
    currentUser,
    allUsers,
    switchUser,
    setIsCreateModalOpen,
    setIsDownloadModalOpen,
    isSubscribed,
    setIsSubscriptionModalOpen,
    setIsAuthModalOpen,
    setIsDeleteAccountModalOpen,
    setUserToDeleteId,
    theme,
    toggleTheme,
    setViewingProfileUserId,
  } = useSocial();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const unreadMessagesCount = conversations.reduce(
    (acc, c) => acc + (c.unreadCount || 0),
    0
  );

  return (
    <>
      <header className="md:hidden sticky top-0 z-40 h-14 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 px-4 flex items-center justify-between text-white select-none">
        {/* Instagram-style Sleek Brand Title */}
        <button
          onClick={() => setCurrentView('feed')}
          className="group flex items-center gap-2 focus:outline-none"
        >
          <span className="font-serif italic font-bold text-xl tracking-tight text-white group-hover:text-neutral-300 transition-colors">
            Mizizi
          </span>
          <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 font-semibold">
            Social
          </span>
        </button>

        {/* Clean, Non-Overflowing Header Controls */}
        <div className="flex items-center gap-2">
          {/* VIP Pass Mini Button */}
          <button
            onClick={() => setIsSubscriptionModalOpen(true)}
            className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all ${
              isSubscribed
                ? 'bg-amber-400 text-black shadow-sm'
                : 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
            }`}
            title="VIP Membership"
          >
            <Crown className="w-3 h-3 fill-current" />
            <span>{isSubscribed ? 'VIP' : 'Pass'}</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => setCurrentView('notifications')}
            className="p-1.5 text-neutral-300 hover:text-white relative"
            aria-label="Notifications"
          >
            <Heart className="w-5 h-5 stroke-[2]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white" />
            )}
          </button>

          {/* Direct Messages */}
          <button
            onClick={() => setCurrentView('messages')}
            className="p-1.5 text-neutral-300 hover:text-white relative"
            aria-label="Direct Messages"
          >
            <Send className="w-5 h-5 stroke-[2]" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-white text-black text-[9px] font-black flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Hamburger / Overflow Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-1.5 text-neutral-300 hover:text-white"
            aria-label="More Menu"
          >
            <Menu className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </header>

      {/* Slide-over Full Drawer Menu for Mobile */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-in fade-in duration-150">
          <div className="absolute inset-0" onClick={() => setIsMenuOpen(false)} />

          <div className="relative z-10 w-full max-w-xs h-full bg-[#121212] border-l border-white/10 p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 text-white">
            <div className="space-y-5">
              {/* Top Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="font-serif italic font-bold text-lg text-white">
                    Mizizi Menu
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Active User Card */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.displayName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-white/20"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">
                      {currentUser.displayName}
                    </div>
                    <div className="text-[11px] text-neutral-400 truncate">
                      @{currentUser.username} · {currentUser.role}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create / Switch</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setViewingProfileUserId(currentUser.id);
                      setCurrentView('profile');
                    }}
                    className="py-1.5 px-3 rounded-lg bg-white text-black text-[11px] font-bold hover:bg-neutral-200 transition-colors"
                  >
                    Profile
                  </button>
                </div>
              </div>

              {/* Menu Navigation Links */}
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold bg-white text-black hover:bg-neutral-200 transition-all shadow-md mb-2"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Create / Upload Post</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsSubscriptionModalOpen(true);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold border transition-colors ${
                    isSubscribed
                      ? 'bg-amber-400/10 border-amber-400/30 text-amber-300'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>VIP Subscription Pass</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
                    {isSubscribed ? 'Active' : 'Unlock'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setCurrentView('creator');
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-neutral-400" />
                  <span>Creator Studio & Analytics</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setCurrentView('admin');
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <ShieldAlert className="w-4 h-4 text-neutral-400" />
                  <span>Safety & Admin Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsDownloadModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Download className="w-4 h-4 text-neutral-400" />
                  <span>Download Project Files (.ZIP)</span>
                </button>

                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    <span>Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Actions: Delete Account */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setUserToDeleteId(currentUser.id);
                  setIsDeleteAccountModalOpen(true);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
                <span>Delete Account</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Switch / Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
