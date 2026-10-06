import React, { useState } from 'react';
import {
  Home,
  Compass,
  Film,
  Send,
  Heart,
  Plus,
  User as UserIcon,
  BarChart3,
  ShieldAlert,
  Download,
  Sun,
  Moon,
  ChevronDown,
  ArrowRight,
  Menu,
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
      label: 'Discover',
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
    <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 border-r border-white/10 bg-[#0a0a0a] text-white px-5 py-6 justify-between select-none z-30 transition-colors">
      {/* Top Branding & Main Nav */}
      <div className="space-y-6">
        {/* Brand Title matching oneImage.webp typography */}
        <div className="pt-1 pb-2 flex items-center justify-between">
          <button
            onClick={() => setCurrentView('feed')}
            className="text-left group flex items-center gap-3 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-2xl bg-white text-black flex items-center justify-center font-display font-black text-lg shadow-lg">
              M
            </div>
            <div>
              <span className="font-display font-black text-2xl tracking-tight text-white group-hover:text-neutral-300 transition-colors">
                MIZIZI
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold -mt-0.5">
                Noir Edition
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
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#1c1c1c] text-white border border-white/10 shadow-lg'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative">
                    <Icon className="w-5 h-5 text-white" />
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-white text-black text-[9px] font-black flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>
              </button>
            );
          })}

          {/* Profile Link */}
          <button
            onClick={handleProfileClick}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              currentView === 'profile'
                ? 'bg-[#1c1c1c] text-white border border-white/10 shadow-lg'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-white/30"
            />
            <span className="truncate">Profile</span>
          </button>
        </nav>

        {/* Primary Action Button (White Pill matching Send Money > in oneImage.webp) */}
        <div className="pt-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full py-3.5 px-5 rounded-full bg-white hover:bg-neutral-200 text-black font-extrabold text-xs flex items-center justify-between transition-all shadow-xl active:scale-95"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Publish Post / Video</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Portals: Creator Studio & Admin Dashboard */}
        <div className="pt-2 border-t border-white/10 space-y-1">
          <div className="px-3.5 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            Management
          </div>

          <button
            onClick={() => setCurrentView('creator')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-colors ${
              currentView === 'creator'
                ? 'bg-white/10 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-white" />
            <span>Creator Studio</span>
          </button>

          <button
            onClick={() => setCurrentView('admin')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-colors ${
              currentView === 'admin'
                ? 'bg-white/10 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-white" />
            <span>Safety & Admin</span>
          </button>

          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Download className="w-4 h-4 text-neutral-300" />
            <span>Download Folder (.ZIP)</span>
          </button>
        </div>
      </div>

      {/* Bottom Profile & Role Switcher */}
      <div className="relative pt-4 border-t border-white/10">
        {/* Switcher popover */}
        {isUserSwitcherOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 p-2 rounded-2xl bg-[#1c1c1c] border border-white/10 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
            <div className="px-2 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Switch Persona
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
                      ? 'bg-white/10'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">
                      {user.displayName}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate">
                      @{user.username} · {user.role}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current User Card */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#181818] border border-white/5">
          <button
            onClick={() => setIsUserSwitcherOpen(!isUserSwitcherOpen)}
            className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-80 transition-opacity"
            title="Switch demo persona"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20"
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {currentUser.displayName}
              </div>
              <div className="text-[10px] text-neutral-400 truncate">
                @{currentUser.username} [{currentUser.role}]
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-1" />
          </button>
        </div>
      </div>
    </aside>
  );
};
