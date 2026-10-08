import React, { useState } from 'react';
import {
  X,
  UserPlus,
  LogIn,
  Sparkles,
  ShieldCheck,
  Check,
  Crown,
  Trash2,
  ArrowRight,
  User,
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { UserRole } from '../../types';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face',
];

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    register,
    login,
    currentUser,
    allUsers,
    switchUser,
    setIsDeleteAccountModalOpen,
    setUserToDeleteId,
  } = useSocial();

  const [mode, setMode] = useState<'register' | 'switch'>('register');

  // Register form state
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState<UserRole>('CREATOR');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [customAvatarSeed, setCustomAvatarSeed] = useState('');

  // Switch form search
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAuthModalOpen) return null;

  const currentAvatarUrl = customAvatarSeed
    ? `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(customAvatarSeed)}`
    : selectedAvatar;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    register(
      username.trim(),
      displayName.trim() || username.trim(),
      email.trim(),
      currentAvatarUrl,
      bio.trim() || 'Visual storyteller on MIZIZI SOCIAL 🌍✨',
      role
    );
  };

  const filteredUsers = allUsers.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none text-white animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={() => setIsAuthModalOpen(false)} />

      <div className="relative z-10 w-full max-w-md bg-[#121212] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white text-black font-black text-sm flex items-center justify-center">
              M
            </div>
            <div>
              <h2 className="font-bold text-sm text-white tracking-tight">
                MIZIZI Accounts
              </h2>
              <p className="text-[11px] text-neutral-400">
                Free Entry · View & Post With VIP Pass
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3">
          <div className="grid grid-cols-2 p-1 bg-[#1a1a1a] rounded-xl border border-white/5 text-xs font-semibold">
            <button
              onClick={() => setMode('register')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-white text-black font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
            <button
              onClick={() => setMode('switch')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'switch'
                  ? 'bg-white text-black font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Switch / Sign In</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {mode === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-neutral-300 flex items-start gap-2.5">
                <Crown className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold text-white">Anyone can register for free!</span> You can browse and view content immediately. To publish posts and reels, you must subscribe to the VIP Creator Pass.
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Choose Profile Avatar
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {AVATAR_PRESETS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(url);
                        setCustomAvatarSeed('');
                      }}
                      className={`relative shrink-0 rounded-full overflow-hidden transition-all ${
                        currentAvatarUrl === url
                          ? 'ring-2 ring-white scale-105'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="preset" className="w-10 h-10 object-cover" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const seed = Math.random().toString(36).substring(7);
                      setCustomAvatarSeed(seed);
                    }}
                    className="shrink-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-[10px] text-neutral-300 font-bold"
                    title="Generate unique avatar"
                  >
                    Dice
                  </button>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Username *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs font-bold">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="your_handle"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Display / Full Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="e.g. Jane Mkwawa"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white"
                />
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Account Type
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {(['CREATOR', 'BUSINESS', 'USER'] as UserRole[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 px-2 rounded-xl border text-[11px] font-bold capitalize transition-all ${
                        role === r
                          ? 'bg-white text-black border-white'
                          : 'bg-[#181818] text-neutral-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {r.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Bio (Optional)
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell your story..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
              >
                <span>Create Account & Join Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Search profiles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#181818] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white"
              />

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {filteredUsers.map(u => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <div
                      key={u.id}
                      className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-white/10 border-white/20'
                          : 'bg-[#181818] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <button
                        onClick={() => {
                          switchUser(u.id);
                          setIsAuthModalOpen(false);
                        }}
                        className="flex items-center gap-2.5 min-w-0 text-left flex-1"
                      >
                        <img
                          src={u.avatarUrl}
                          alt={u.displayName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                            <span>{u.displayName}</span>
                            {isCurrent && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-normal">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-neutral-400 truncate">
                            @{u.username} · {u.role} · {u.subscriptionStatus === 'SUBSCRIBER_MONTHLY' || u.subscriptionStatus === 'SUBSCRIBER_ANNUAL' ? 'VIP' : 'Free'}
                          </div>
                        </div>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setUserToDeleteId(u.id);
                            setIsAuthModalOpen(false);
                            setIsDeleteAccountModalOpen(true);
                          }}
                          className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors rounded-lg"
                          title="Delete Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-xs text-neutral-400 hover:text-white underline underline-offset-4"
                >
                  Need a new account? Create one now →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
