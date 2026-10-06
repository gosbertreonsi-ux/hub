import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Ban,
  RotateCcw,
  Trash2,
  Search,
  Filter,
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

  // Metrics
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
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-8 select-none">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-neutral-900 text-white border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Platform Trust & Safety Console</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl">
            MIZIZI Admin Center
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Community guidelines enforcement, user account management, and content integrity moderation.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-neutral-400">Authenticated Operator</div>
          <div className="text-sm font-bold text-amber-400">@{currentUser.username} ({currentUser.role})</div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
          <div className="text-neutral-400 text-xs flex items-center justify-between">
            <span>Total Accounts</span>
            <Users className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 tabular-nums">
            {totalUsers}
          </div>
          <div className="text-[11px] text-emerald-500 font-medium">
            {activeUsers} active
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
          <div className="text-neutral-400 text-xs flex items-center justify-between">
            <span>Published Posts</span>
            <FileText className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 tabular-nums">
            {totalPosts}
          </div>
          <div className="text-[11px] text-neutral-400">across feeds & reels</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
          <div className="text-neutral-400 text-xs flex items-center justify-between">
            <span>Pending Reports</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-extrabold text-red-500 tabular-nums">
            {pendingReportsCount}
          </div>
          <div className="text-[11px] text-red-400">requires review</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
          <div className="text-neutral-400 text-xs flex items-center justify-between">
            <span>Server Status</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
            Healthy
          </div>
          <div className="text-[11px] text-emerald-500 font-medium">99.98% uptime</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'moderation'
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          Moderation Queue ({pendingReportsCount})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'users'
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          User Management ({allUsers.length})
        </button>
      </div>

      {/* Tab 1: Moderation Queue */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500">
              Showing {filteredReports.length} reports
            </span>
            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
              {(['ALL', 'PENDING', 'RESOLVED'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setReportFilter(f)}
                  className={`px-3 py-1 rounded-md text-[11px] font-medium capitalize ${
                    reportFilter === f
                      ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
                      : 'text-neutral-500'
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
                className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        rep.status === 'PENDING'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}
                    >
                      {rep.status}
                    </span>
                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      Reason: {rep.reason.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-neutral-400">· {rep.createdAt}</span>
                  </div>

                  <div className="text-xs text-neutral-500">
                    Reported by <span className="font-semibold text-neutral-700 dark:text-neutral-300">@{rep.reporterUsername}</span>
                  </div>
                </div>

                <div className="text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">Target Type:</span>{' '}
                    <span className="capitalize">{rep.targetType}</span> (ID: {rep.targetId})
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">Reported User:</span>{' '}
                    <span>@{rep.targetAuthor}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 italic">
                    "{rep.targetSummary}"
                  </div>
                </div>

                {/* Moderation Action Buttons (PRD Section 30: Dismiss, Remove Content, Suspend Account) */}
                {rep.status === 'PENDING' && (
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => resolveReport(rep.id, 'dismiss')}
                      className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                      Dismiss (No Violation)
                    </button>
                    <button
                      onClick={() => resolveReport(rep.id, 'remove_content')}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold hover:bg-amber-400 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Content</span>
                    </button>
                    <button
                      onClick={() => resolveReport(rep.id, 'suspend_user')}
                      className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-colors flex items-center gap-1"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Suspend @{rep.targetAuthor}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}

            {filteredReports.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-400 text-xs">
                No reports found in this view. All queues clean!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: User Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search users by username, email, or name..."
              value={userSearchQuery}
              onChange={e => setUserSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Followers</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30">
                    <td className="p-3.5 flex items-center gap-3">
                      <img
                        src={user.avatarUrl}
                        alt={user.displayName}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-neutral-900 dark:text-neutral-100 truncate">
                          {user.displayName}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate">
                          @{user.username}
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-medium text-neutral-700 dark:text-neutral-300">
                      {user.role}
                    </td>
                    <td className="p-3.5 tabular-nums text-neutral-700 dark:text-neutral-300">
                      {user.followersCount.toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          user.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {user.id !== currentUser.id && (
                        <button
                          onClick={() =>
                            toggleUserStatus(
                              user.id,
                              user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
                            )
                          }
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                            user.status === 'ACTIVE'
                              ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'
                              : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
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
