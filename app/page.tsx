'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { BottomNav } from '@/components/BottomNav';
import { Toast } from '@/components/Toast';

// Screens
import { OnboardingScreen } from '@/components/screens/OnboardingScreen';
import {
  LoginScreen,
  RegisterScreen,
  OtpVerificationScreen,
  ForgotPasswordScreen,
} from '@/components/screens/AuthScreens';
import { HomeDashboardScreen } from '@/components/screens/HomeDashboardScreen';
import { AllCategoriesScreen } from '@/components/screens/AllCategoriesScreen';
import { CategoryDetailsScreen } from '@/components/screens/CategoryDetailsScreen';
import { SearchScreen } from '@/components/screens/SearchScreen';
import { ProProfileScreen } from '@/components/screens/ProProfileScreen';
import { RequestFlowScreen } from '@/components/screens/RequestFlowScreen';
import { RequestsListScreen } from '@/components/screens/RequestsListScreen';
import { RequestDetailsScreen } from '@/components/screens/RequestDetailsScreen';
import { ChatInboxScreen, ChatConversationScreen } from '@/components/screens/ChatScreens';
import { PaymentScreen } from '@/components/screens/PaymentScreen';
import { LeaveReviewScreen } from '@/components/screens/LeaveReviewScreen';
import { NotificationsScreen } from '@/components/screens/NotificationsScreen';
import { ProfileScreen, EditProfileScreen } from '@/components/screens/ProfileScreens';
import { ProDashboardScreen } from '@/components/screens/ProDashboardScreen';
import { SettingsScreen, HelpCenterScreen } from '@/components/screens/SettingsAndHelpScreens';

export default function MainPage() {
  const { currentScreen } = useApp();

  // Determine whether to display the BottomNav
  const showBottomNav = [
    'home',
    'search',
    'requests_list',
    'chat_inbox',
    'profile',
    'all_categories',
  ].includes(currentScreen);

  // Render the current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen />;
      case 'login':
        return <LoginScreen />;
      case 'register':
        return <RegisterScreen />;
      case 'otp':
        return <OtpVerificationScreen />;
      case 'forgot_password':
        return <ForgotPasswordScreen />;
      case 'home':
        return <HomeDashboardScreen />;
      case 'all_categories':
        return <AllCategoriesScreen />;
      case 'category_details':
        return <CategoryDetailsScreen />;
      case 'search':
        return <SearchScreen />;
      case 'pro_profile':
        return <ProProfileScreen />;
      case 'request_flow':
        return <RequestFlowScreen />;
      case 'requests_list':
        return <RequestsListScreen />;
      case 'request_details':
        return <RequestDetailsScreen />;
      case 'chat_inbox':
        return <ChatInboxScreen />;
      case 'chat_conversation':
        return <ChatConversationScreen />;
      case 'payment':
      case 'payment_screen':
        return <PaymentScreen />;
      case 'leave_review':
        return <LeaveReviewScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'edit_profile':
        return <EditProfileScreen />;
      case 'pro_dashboard':
        return <ProDashboardScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'help_center':
        return <HelpCenterScreen />;
      default:
        return <HomeDashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F1] flex justify-center">
      {/* Clean application container */}
      <div className="w-full max-w-md bg-white h-screen overflow-hidden relative flex flex-col shadow-md">
        <Toast />

        {/* Dynamic Screen View */}
        <div className="flex-1 overflow-y-auto relative">
          {renderScreen()}
        </div>

        {/* Global Bottom Navigation */}
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
}
