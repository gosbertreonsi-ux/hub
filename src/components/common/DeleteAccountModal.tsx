import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, ShieldAlert } from 'lucide-react';
import { useSocial } from '../../context/SocialContext';

export const DeleteAccountModal: React.FC = () => {
  const {
    isDeleteAccountModalOpen,
    setIsDeleteAccountModalOpen,
    userToDeleteId,
    setUserToDeleteId,
    currentUser,
    allUsers,
    deleteAccount,
  } = useSocial();

  const [isDeleting, setIsDeleting] = useState(false);

  if (!isDeleteAccountModalOpen) return null;

  const targetId = userToDeleteId || currentUser.id;
  const targetUser = allUsers.find(u => u.id === targetId) || currentUser;

  const handleConfirmDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      deleteAccount(targetId);
      setIsDeleting(false);
    }, 400);
  };

  const handleCancel = () => {
    setUserToDeleteId(null);
    setIsDeleteAccountModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none text-white animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={handleCancel} />

      <div className="relative z-10 w-full max-w-sm bg-[#141414] rounded-3xl overflow-hidden shadow-2xl border border-red-500/20 flex flex-col p-6 animate-in zoom-in-95">
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon */}
        <div className="mx-auto w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6 stroke-[2]" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="font-bold text-base text-white">
            Delete Account?
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Are you sure you want to permanently delete{' '}
            <span className="font-bold text-white">@{targetUser.username}</span>?
            All your uploaded photos, videos, reels, comments, and profile data will be permanently removed.
          </p>
        </div>

        {/* User Card */}
        <div className="my-4 p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
          <img
            src={targetUser.avatarUrl}
            alt={targetUser.displayName}
            className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10"
          />
          <div className="min-w-0 text-left">
            <div className="text-xs font-bold text-white truncate">
              {targetUser.displayName}
            </div>
            <div className="text-[11px] text-neutral-400 truncate">
              @{targetUser.username} · {targetUser.role}
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleConfirmDelete}
            className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Deleting Account...' : 'Permanently Delete Account'}</span>
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="w-full py-2.5 px-4 rounded-xl bg-[#222222] hover:bg-[#2c2c2c] text-neutral-300 font-semibold text-xs transition-colors"
          >
            Cancel, Keep Account
          </button>
        </div>
      </div>
    </div>
  );
};
