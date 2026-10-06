import React from 'react';
import { Heart, MessageCircle, UserPlus, AtSign, Check, CheckCircle2 } from 'lucide-react';
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
        return <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 fill-amber-500 text-amber-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-emerald-500" />;
      case 'mention':
        return <AtSign className="w-4 h-4 text-sky-500" />;
      default:
        return <Heart className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <h1 className="font-display font-extrabold text-xl text-neutral-900 dark:text-neutral-100">
            Notifications
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {unreadNotificationsCount} unread notification{unreadNotificationsCount === 1 ? '' : 's'}
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications.map(item => (
          <div
            key={item.id}
            onClick={() => markNotificationAsRead(item.id)}
            className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-colors border ${
              item.isRead
                ? 'bg-white dark:bg-neutral-900/50 border-neutral-100 dark:border-neutral-800/40 text-neutral-600 dark:text-neutral-400'
                : 'bg-amber-500/5 dark:bg-amber-400/5 border-amber-500/20 text-neutral-900 dark:text-neutral-100'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Actor Avatar with Type Badge */}
              <div className="relative shrink-0">
                <img
                  src={item.actor.avatarUrl}
                  alt={item.actor.displayName}
                  onClick={e => {
                    e.stopPropagation();
                    openUserProfile(item.actor.id);
                  }}
                  className="w-11 h-11 rounded-full object-cover cursor-pointer ring-1 ring-neutral-200 dark:ring-neutral-700 hover:opacity-90"
                />
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white dark:bg-neutral-900 shadow-xs">
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
                    className="font-bold text-neutral-900 dark:text-neutral-100 hover:underline mr-1 focus:outline-none"
                  >
                    {item.actor.displayName}
                  </button>
                  <span className="text-neutral-700 dark:text-neutral-300">
                    {item.text}
                  </span>
                </p>
                <div className="text-[10px] text-neutral-400 mt-0.5">
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
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${
                    isFollowing(item.actor.id)
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                      : 'bg-amber-500 text-neutral-950 hover:bg-amber-400'
                  }`}
                >
                  {isFollowing(item.actor.id) ? 'Following' : 'Follow Back'}
                </button>
              ) : item.postThumbnail ? (
                <img
                  src={item.postThumbnail}
                  alt="Post thumbnail"
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : null}
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-16 text-neutral-400 text-xs">
            No notifications yet.
          </div>
        )}
      </div>
    </div>
  );
};
