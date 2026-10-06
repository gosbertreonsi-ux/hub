import React, { useState } from 'react';
import {
  Home,
  Compass,
  Film,
  Send,
  Heart,
  PlusSquare,
  User as UserIcon,
  BarChart3,
  ShieldAlert,
  Download,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setViewingProfileUserId,
    currentUser,
    switchUser,
    allUsers,
    unreadNotificationsCount,
    conversations,
    setIsCreateModalOpen,
    setIsDownloadModalOpen,
    theme,
    toggleTheme,
  } = useSocial();

  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);

  // Unread messages count
  const unreadMessagesCount = conversations.reduce(
    (acc, c) => acc + (c.unreadCount || 0),
    0
  );

  const navItems = [
    {
      id: 'feed' as const,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'explore' as const,
      label: 'Explore',
      icon: Compass,
    },
    {
      id: 'reels' as const,
      label: 'Reels',
      icon: Film,
    },
    {
      id: 'messages' as const,
      label: 'Messages',
      icon: Send,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    {
      id: 'notifications' as const,
      label: 'Notifications',
      icon: Heart,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
  ];

  const handleNavClick = (viewId: typeof navItems[number]['id']) => {
    setCurrentView(viewId);
  };

  const handleProfileClick = () => {
    setViewingProfileUserId(currentUser.id);
    setCurrentView('profile');
  };

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 border-r border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 px-4 py-6 justify-between select-none z-30 transition-colors">
      {/* Top Branding & Main Nav */}
      <div className="space-y-6">
        {/* Brand Title (Single-line wordmark adhering to constitution) */}
        <div className="px-3 pt-1 pb-2">
          <button
            onClick={() => setCurrentView('feed')}
            className="text-left group flex items-center gap-2.5 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-display font-black text-lg">
              M
            </div>
            <div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-neutral-900 dark:text-neutral-50 group-hover:text-amber-500 transition-colors">
                MIZIZI
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold -mt-1">
                Social & Creator
              </span>
            </div>
          </button>
        </div>

        {/* Primary Navigation Links */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-neutral-100 font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 transition-transform ${
                        isActive ? 'scale-110 text-amber-500' : ''
                      }`}
                    />
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>
              </button>
            );
          })}

          {/* Create Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
          >
            <PlusSquare className="w-5 h-5" />
            <span>Create</span>
          </button>

          {/* Profile Link */}
          <button
            onClick={handleProfileClick}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
              currentView === 'profile'
                ? 'bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-neutral-100 font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-5 h-5 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
            />
            <span className="truncate">Profile</span>
          </button>
        </nav>

        {/* Portals: Creator Studio & Admin Dashboard */}
        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800/80 space-y-1">
          <div className="px-3.5 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Portals
          </div>

          <button
            onClick={() => setCurrentView('creator')}
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
              currentView === 'creator'
                ? 'bg-amber-500/10 text-amber-500 font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-500" />
            <span>Creator Analytics</span>
          </button>

          <button
            onClick={() => setCurrentView('admin')}
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
              currentView === 'admin'
                ? 'bg-red-500/10 text-red-500 font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>Safety & Admin</span>
          </button>

          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Folder (.ZIP)</span>
          </button>
        </div>
      </div>

      {/* Bottom Profile & Role Switcher */}
      <div className="relative pt-4 border-t border-neutral-200 dark:border-neutral-800/80">
        {/* Switcher popover */}
        {isUserSwitcherOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 p-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2">
            <div className="px-2 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Switch Persona (Test PRD)
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {allUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    switchUser(user.id);
                    setIsUserSwitcherOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors ${
                    user.id === currentUser.id
                      ? 'bg-neutral-100 dark:bg-neutral-800'
                      : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {user.displayName}
                    </div>
                    <div className="text-[10px] text-neutral-500 truncate">
                      @{user.username} · {user.role}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current User Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60">
          <button
            onClick={() => setIsUserSwitcherOpen(!isUserSwitcherOpen)}
            className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-80 transition-opacity"
            title="Switch demo persona"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-8 h-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
            />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                {currentUser.displayName}
              </div>
              <div className="text-[10px] text-neutral-500 truncate flex items-center gap-1">
                <span>@{currentUser.username}</span>
                <span className="text-amber-500 font-bold">[{currentUser.role}]</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-1" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-600" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
