import React, { useState } from 'react';
import { Send, Heart, Users, Download, Menu, Plus } from 'lucide-react';
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
  } = useSocial();

  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const unreadMessagesCount = conversations.reduce(
    (acc, c) => acc + (c.unreadCount || 0),
    0
  );

  return (
    <header className="md:hidden sticky top-0 z-40 h-16 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 px-4 flex items-center justify-between text-white select-none">
      {/* Brand Title & Hamburger Menu matching oneImage.webp */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
          className="p-2 -ml-1 text-white hover:text-neutral-300"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button
          onClick={() => setCurrentView('feed')}
          className="font-display font-black text-xl tracking-tight text-white flex items-center gap-1.5"
        >
          MIZIZI
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Upload Video / Create Button */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3 py-1.5 rounded-full bg-white text-black font-extrabold text-[11px] flex items-center gap-1 shadow-md"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Upload</span>
        </button>

        {/* Download Code Archive */}
        <button
          onClick={() => setIsDownloadModalOpen(true)}
          className="p-2 text-neutral-400 hover:text-white"
          title="Download Folder (.ZIP)"
          aria-label="Download Project ZIP"
        >
          <Download className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button
          onClick={() => setCurrentView('notifications')}
          className="p-2 text-neutral-400 hover:text-white relative"
          aria-label="Notifications"
        >
          <Heart className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white" />
          )}
        </button>

        {/* Direct Messages */}
        <button
          onClick={() => setCurrentView('messages')}
          className="p-2 text-neutral-400 hover:text-white relative"
          aria-label="Direct Messages"
        >
          <Send className="w-5 h-5" />
          {unreadMessagesCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-white text-black text-[9px] font-black flex items-center justify-center">
              {unreadMessagesCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Persona Switcher Sheet */}
      {isSwitcherOpen && (
        <div className="absolute top-16 left-0 right-0 p-4 bg-[#141414] border-b border-white/10 shadow-2xl z-50">
          <div className="text-[10px] font-bold text-neutral-400 mb-3 uppercase tracking-wider">
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
                className={`flex items-center gap-2 p-2.5 rounded-2xl text-left text-xs ${
                  u.id === currentUser.id
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'bg-[#1e1e1e] text-neutral-200 hover:bg-[#262626]'
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
