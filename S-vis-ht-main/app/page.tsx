'use client';

export const dynamic = "force-dynamic";

import React from 'react';
import { useApp } from '@/lib/store';
import { HomeDashboardScreen } from '@/components/screens/HomeDashboardScreen';
import { SearchScreen } from '@/components/screens/SearchScreen';
import { RequestsListScreen } from '@/components/screens/RequestsListScreen';
import { ChatInboxScreen, ChatConversationScreen } from '@/components/screens/ChatScreens';
import { ProfileScreen } from '@/components/screens/ProfileScreens';
import { BottomNav } from '@/components/BottomNav';

export default function Page() {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeDashboardScreen />;
      case 'search':
        return <SearchScreen />;
      case 'requests':
        return <RequestsListScreen />;
      case 'messages':
        return <ChatInboxScreen />;
      case 'chat':
        return <ChatConversationScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeDashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {renderScreen()}
      <BottomNav />
    </div>
  );
}
