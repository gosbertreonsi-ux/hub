import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  FileText,
  AlertTriangle,
  Ban,
  Trash2,
  Search,
  CheckCircle,
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';

export const AdminDashboardView: React.FC = () => {
  const {
    allUsers,
    posts,
    reports,
    resolveReport,
    toggleUserStatus,
    currentUser,
  } = useSocial();

  const [activeTab, setActiveTab] = useState<'moderation' | 'users'>('moderation');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [reportFilter, setReportFilter] = useState<'ALL' | 'PENDING' | 'RESOLVED'>('ALL');

  const totalUsers = allUsers.length;
  const activeUsers = allUsers.filter(u => u.status === 'ACTIVE').length;
  const totalPosts = posts.length;
  const pendingReportsCount = reports.filter(r => r.status === 'PENDING').length;

  const filteredReports = reports.filter(r => {
    if (reportFilter === 'ALL') return true;
    return r.status === reportFilter;
  });

  const filteredUsers = allUsers.filter(u => {
    if (!userSearchQuery.trim()) return true;
    const q = userSearchQuery.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      u.displayName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6 text-white select-none">
      {/* Top Header matching oneImage.webp */}
      <div className="p-6 sm:p-8 rounded-[36px] bg-[#121212] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Platform Trust & Safety Console</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            MIZIZI Safety Center
          </h1>
          <p className="text-xs text-neutral-400">
            Community guidelines enforcement and content integrity moderation.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-neutral-400">Operator</div>
          <div className="text-sm font-extrabold text-white">@{currentUser.username} [{currentUser.role}]</div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-[28px] bg-[#121212] border border-white/10 shadow-xl space-y-1">
          <div className="text-neutral-400 text-xs flex items-center justify-between">
            <span>Total Accounts</span>
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums tracking-tight font-display">
            {totalUsers}
          </div>
          <div className="text-[11px] text-emerald-400 font-bold">
            {activeUsers} active
          </div>
        </div>

        <div className="p-5 rounded-[28px] bg-[#121212] border border-white/10 shadow-xl space-y-1">
          <div className="text-neutral-400 text-xs flex items-center justify-between">
            <span>Publications</span>
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums tracking-tight font-display">
            {totalPosts}
          </div>
          <div className="text-[11px] text-neutral-400">across feeds & reels</div>
        </div>

        <div className="p-5 rounded-[28px] bg-[#121212] border border-white/10 shadow-xl space-y-1">
          <div className="text-neutral-400 text-xs flex items-center justify-between">
            <span>Pending Reports</span>
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl font-extrabold text-white tabular-nums tracking-tight font-display">
            {pendingReportsCount}
          </div>
          <div className="text-[11px] text-neutral-400">queue status</div>
        </div>

        <div className="p-5 rounded-[28px] bg-[#121212] border border-white/10 shadow-xl space-y-1">
          <div className="text-neutral-400 text-xs flex items-center justify-between">
            <span>Security</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold text-white font-display">
            Optimal
          </div>
          <div className="text-[11px] text-emerald-400 font-bold">Encrypted Endpoints</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === 'moderation'
              ? 'bg-white text-black shadow-lg'
              : 'text-neutral-400 hover:text-white bg-[#141414]'
          }`}
        >
          Moderation Queue ({pendingReportsCount})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-white text-black shadow-lg'
              : 'text-neutral-400 hover:text-white bg-[#141414]'
          }`}
        >
          User Registry ({allUsers.length})
        </button>
      </div>

      {/* Tab 1: Moderation Queue */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">
              Showing {filteredReports.length} reports
            </span>
            <div className="flex items-center gap-1.5 p-1 bg-[#1a1a1a] rounded-full border border-white/10">
              {(['ALL', 'PENDING', 'RESOLVED'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setReportFilter(f)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize ${
                    reportFilter === f
                      ? 'bg-white text-black shadow-md'
                      : 'text-neutral-400'
                  }`}
                >
                  {f.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredReports.map(rep => (
              <div
                key={rep.id}
                className="p-5 rounded-[28px] bg-[#121212] border border-white/10 shadow-xl space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        rep.status === 'PENDING'
                          ? 'bg-white text-black'
                          : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      {rep.status}
                    </span>
                    <span className="text-xs font-bold text-white">
                      Reason: {rep.reason.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-neutral-500">· {rep.createdAt}</span>
                  </div>

                  <div className="text-xs text-neutral-400">
                    Reported by <span className="font-bold text-white">@{rep.reporterUsername}</span>
                  </div>
                </div>

                <div className="text-xs text-neutral-300 space-y-1">
                  <div>
                    <span className="font-semibold text-white">Reported User:</span>{' '}
                    <span>@{rep.targetAuthor}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#1c1c1c] text-neutral-200 border border-white/5">
                    "{rep.targetSummary}"
                  </div>
                </div>

                {rep.status === 'PENDING' && (
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => resolveReport(rep.id, 'dismiss')}
                      className="px-4 py-2 rounded-full bg-[#222222] text-neutral-300 text-xs font-bold hover:bg-[#303030] transition-colors"
                    >
                      Dismiss (No Violation)
                    </button>
                    <button
                      onClick={() => resolveReport(rep.id, 'remove_content')}
                      className="px-4 py-2 rounded-full bg-white text-black text-xs font-extrabold hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Content</span>
                    </button>
                    <button
                      onClick={() => resolveReport(rep.id, 'suspend_user')}
                      className="px-4 py-2 rounded-full bg-red-600 text-white text-xs font-extrabold hover:bg-red-500 transition-colors flex items-center gap-1.5"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Suspend User</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: User Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search user accounts..."
              value={userSearchQuery}
              onChange={e => setUserSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-[#141414] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white shadow-xl"
            />
          </div>

          <div className="overflow-x-auto rounded-[28px] border border-white/10 bg-[#121212]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181818] text-neutral-400 uppercase tracking-wider font-bold border-b border-white/10">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Followers</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-white/5">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={user.avatarUrl}
                        alt={user.displayName}
                        className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate">
                          {user.displayName}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate">
                          @{user.username}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-neutral-300">
                      {user.role}
                    </td>
                    <td className="p-4 tabular-nums text-neutral-300 font-bold">
                      {user.followersCount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                          user.status === 'ACTIVE'
                            ? 'bg-white text-black'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {user.id !== currentUser.id && (
                        <button
                          onClick={() =>
                            toggleUserStatus(
                              user.id,
                              user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
                            )
                          }
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                            user.status === 'ACTIVE'
                              ? 'bg-[#222222] text-neutral-300 hover:bg-white hover:text-black'
                              : 'bg-white text-black hover:bg-neutral-200'
                          }`}
                        >
                          {user.status === 'ACTIVE' ? 'Suspend' : 'Restore'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
