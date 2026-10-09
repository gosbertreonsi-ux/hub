import React, { useState, useRef, useEffect } from 'react';
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
  Menu,
  Crown,
  Sparkles,
  Trash2,
  UserPlus,
  LogOut,
  Settings,
  Database,
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setViewingProfileUserId,
    currentUser,
    unreadNotificationsCount,
    conversations,
    setIsCreateModalOpen,
    setIsDownloadModalOpen,
    isSubscribed,
    setIsSubscriptionModalOpen,
    setIsAuthModalOpen,
    setIsDeleteAccountModalOpen,
    setUserToDeleteId,
    setIsDbModalOpen,
    theme,
    toggleTheme,
  } = useSocial();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    if (isMoreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMoreMenuOpen]);

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
    <aside className="hidden md:flex flex-col w-60 lg:w-64 h-screen sticky top-0 border-r border-white/10 bg-[#0a0a0a] text-white px-4 py-5 justify-between select-none z-30 transition-colors overflow-y-auto">
      {/* Top Branding & Main Nav */}
      <div className="space-y-5">
        {/* Instagram-style Sleek Brand Title */}
        <div className="px-2 pt-1 pb-1">
          <button
            onClick={() => setCurrentView('feed')}
            className="group flex items-center gap-2.5 focus:outline-none text-left"
          >
            <span className="font-serif italic font-bold text-2xl tracking-tight text-white group-hover:text-neutral-300 transition-colors">
              Mizizi
            </span>
            <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 font-bold">
              Social
            </span>
          </button>
        </div>

        {/* Primary Navigation Links */}
        <nav className="space-y-1" aria-label="Main Navigation">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white/10 text-white font-bold'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-white text-black text-[9px] font-black flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>
              </button>
            );
          })}

          {/* Create Button (matching Instagram's sidebar Create item) */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/5 transition-all"
          >
            <div className="w-5 h-5 rounded-lg border-2 border-current flex items-center justify-center">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>Create</span>
          </button>

          {/* Profile Link */}
          <button
            onClick={handleProfileClick}
            className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentView === 'profile'
                ? 'bg-white/10 text-white font-bold'
                : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className={`w-5 h-5 rounded-full object-cover ring-1 ${
                currentView === 'profile' ? 'ring-white' : 'ring-white/30'
              }`}
            />
            <span className="truncate">Profile</span>
          </button>
        </nav>

        {/* Compact VIP Pass Pill */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setIsSubscriptionModalOpen(true)}
            className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between text-xs border ${
              isSubscribed
                ? 'bg-amber-400/10 border-amber-400/30 text-amber-300'
                : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Crown className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-bold truncate flex items-center gap-1">
                  <span>{isSubscribed ? 'VIP Pass Active' : 'VIP Pass'}</span>
                  {isSubscribed && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </div>
                <div className="text-[9px] text-neutral-400 truncate">
                  {isSubscribed ? 'Unlimited Access' : 'Free Entry · View Sub'}
                </div>
              </div>
            </div>
            <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
          </button>
        </div>
      </div>

      {/* Bottom Area: User info + Instagram-style "More" dropdown menu */}
      <div className="relative pt-3 border-t border-white/10" ref={moreMenuRef}>
        {/* Instagram-style More Menu Popup */}
        {isMoreMenuOpen && (
          <div className="absolute bottom-full left-0 w-64 mb-2 p-1.5 rounded-2xl bg-[#181818] border border-white/10 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 text-xs">
            <button
              onClick={() => {
                setIsMoreMenuOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-neutral-200 hover:text-white hover:bg-white/10 transition-colors font-medium text-left"
            >
              <UserPlus className="w-4 h-4 text-neutral-400" />
              <span>Create / Switch Account</span>
            </button>

            <button
              onClick={() => {
                setIsMoreMenuOpen(false);
                setIsSubscriptionModalOpen(true);
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-neutral-200 hover:text-white hover:bg-white/10 transition-colors font-medium text-left"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>VIP Subscription & Billing</span>
            </button>

            <button
              onClick={() => {
                setIsMoreMenuOpen(false);
                setCurrentView('creator');
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-neutral-200 hover:text-white hover:bg-white/10 transition-colors font-medium text-left"
            >
              <BarChart3 className="w-4 h-4 text-neutral-400" />
              <span>Creator Studio</span>
            </button>

            <button
              onClick={() => {
                setIsMoreMenuOpen(false);
                setCurrentView('admin');
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-neutral-200 hover:text-white hover:bg-white/10 transition-colors font-medium text-left"
            >
              <ShieldAlert className="w-4 h-4 text-neutral-400" />
              <span>Safety & Admin</span>
            </button>

            <button
              onClick={() => {
                setIsMoreMenuOpen(false);
                setIsDbModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors font-medium text-left"
            >
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Live Database & Docker</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <button
              onClick={() => {
                setIsMoreMenuOpen(false);
                setIsDownloadModalOpen(true);
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-neutral-200 hover:text-white hover:bg-white/10 transition-colors font-medium text-left"
            >
              <Download className="w-4 h-4 text-neutral-400" />
              <span>Download Project ZIP</span>
            </button>

            <button
              onClick={() => {
                toggleTheme();
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-neutral-200 hover:text-white hover:bg-white/10 transition-colors font-medium text-left"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-neutral-400" /> : <Sun className="w-4 h-4 text-neutral-400" />}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>

            <div className="my-1 border-t border-white/5" />

            <button
              onClick={() => {
                setIsMoreMenuOpen(false);
                setUserToDeleteId(currentUser.id);
                setIsDeleteAccountModalOpen(true);
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-semibold text-left"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              <span>Delete Account</span>
            </button>

            <button
              onClick={() => {
                setIsMoreMenuOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors font-medium text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Switch / Log Out</span>
            </button>
          </div>
        )}

        {/* Bottom Bar: More Button (Instagram exact style) */}
        <button
          onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
            isMoreMenuOpen ? 'bg-white/10 text-white' : 'text-neutral-300 hover:bg-white/5 hover:text-white'
          }`}
          aria-label="More options"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Menu className="w-5 h-5 stroke-[2] shrink-0" />
            <span className="font-semibold text-sm">More</span>
          </div>
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.displayName}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20 shrink-0"
          />
        </button>
      </div>
    </aside>
  );
};
