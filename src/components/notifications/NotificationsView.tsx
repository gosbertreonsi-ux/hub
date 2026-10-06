import React from 'react';
import { Heart, MessageCircle, UserPlus, AtSign, Check } from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { NotificationItem } from '../../types';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationsCount,
    openUserProfile,
    toggleFollowUser,
    isFollowing,
  } = useSocial();

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 fill-white text-white" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 fill-white text-white" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-white" />;
      case 'mention':
        return <AtSign className="w-4 h-4 text-white" />;
      default:
        return <Heart className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-6 py-6 space-y-6 text-white select-none">
      {/* Header matching oneImage.webp */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-white">
            Notifications
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            {unreadNotificationsCount} unread activity alert{unreadNotificationsCount === 1 ? '' : 's'}
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black text-xs font-extrabold hover:bg-neutral-200 transition-colors shadow-md"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {notifications.map(item => (
          <div
            key={item.id}
            onClick={() => markNotificationAsRead(item.id)}
            className={`p-4 rounded-[24px] flex items-center justify-between gap-3.5 transition-colors border ${
              item.isRead
                ? 'bg-[#121212] border-white/5 text-neutral-400'
                : 'bg-[#1a1a1a] border-white/20 text-white shadow-xl'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Actor Avatar with Type Badge */}
              <div className="relative shrink-0">
                <img
                  src={item.actor.avatarUrl}
                  alt={item.actor.displayName}
                  onClick={e => {
                    e.stopPropagation();
                    openUserProfile(item.actor.id);
                  }}
                  className="w-11 h-11 rounded-full object-cover cursor-pointer ring-2 ring-white/10 hover:opacity-90"
                />
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-black border border-white/20 shadow-md">
                  {getIcon(item.type)}
                </span>
              </div>

              {/* Text */}
              <div className="min-w-0 text-xs leading-relaxed">
                <p>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      openUserProfile(item.actor.id);
                    }}
                    className="font-bold text-white hover:underline mr-1 focus:outline-none"
                  >
                    {item.actor.displayName}
                  </button>
                  <span className="text-neutral-300">
                    {item.text}
                  </span>
                </p>
                <div className="text-[10px] text-neutral-500 mt-0.5">
                  {item.createdAt}
                </div>
              </div>
            </div>

            {/* Right Action: Follow back button or post thumbnail */}
            <div className="shrink-0 flex items-center gap-2">
              {item.type === 'follow' ? (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    toggleFollowUser(item.actor.id);
                  }}
                  className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all ${
                    isFollowing(item.actor.id)
                      ? 'bg-[#222222] text-neutral-300 border border-white/10'
                      : 'bg-white text-black hover:bg-neutral-200'
                  }`}
                >
                  {isFollowing(item.actor.id) ? 'Following' : 'Follow Back'}
                </button>
              ) : item.postThumbnail ? (
                <img
                  src={item.postThumbnail}
                  alt="Post thumbnail"
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10"
                />
              ) : null}
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-xs">
            No notification activity recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};
