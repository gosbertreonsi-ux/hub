/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SocialProvider, useSocial } from './context/SocialContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { BottomNav } from './components/layout/BottomNav';
import { FeedView } from './components/feed/FeedView';
import { ExploreView } from './components/explore/ExploreView';
import { ReelsView } from './components/reels/ReelsView';
import { MessagesView } from './components/messages/MessagesView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { ProfileView } from './components/profile/ProfileView';
import { CreatorDashboardView } from './components/creator/CreatorDashboardView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { StoriesViewerModal } from './components/stories/StoriesViewerModal';
import { CreatePostModal } from './components/create/CreatePostModal';
import { DownloadFolderModal } from './components/common/DownloadFolderModal';
import { SubscriptionModal } from './components/common/SubscriptionModal';
import { AuthModal } from './components/common/AuthModal';
import { DeleteAccountModal } from './components/common/DeleteAccountModal';
import { DatabaseStatusModal } from './components/common/DatabaseStatusModal';

const AppContent: React.FC = () => {
  const { currentView } = useSocial();

  const renderActiveView = () => {
    switch (currentView) {
      case 'feed':
        return <FeedView />;
      case 'explore':
        return <ExploreView />;
      case 'reels':
        return <ReelsView />;
      case 'messages':
        return <MessagesView />;
      case 'notifications':
        return <NotificationsView />;
      case 'profile':
        return <ProfileView />;
      case 'creator':
        return <CreatorDashboardView />;
      case 'admin':
        return <AdminDashboardView />;
      default:
        return <FeedView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row transition-colors duration-200 selection:bg-white selection:text-black">
      {/* Desktop Left Navigation Sidebar */}
      <Sidebar />

      {/* Mobile Top Header */}
      <TopHeader />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pb-20 md:pb-8">
        {renderActiveView()}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />

      {/* Global Interactive Modals */}
      <StoriesViewerModal />
      <CreatePostModal />
      <DownloadFolderModal />
      <SubscriptionModal />
      <AuthModal />
      <DeleteAccountModal />
      <DatabaseStatusModal />
    </div>
  );
};

export default function App() {
  return (
    <SocialProvider>
      <AppContent />
    </SocialProvider>
  );
}
