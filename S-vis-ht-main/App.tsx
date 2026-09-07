import React from 'react';
import { useApp } from './lib/store';
import { AuthScreen } from './components/screens/AuthScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { SearchScreen } from './components/screens/SearchScreen';
import { RequestsScreen } from './components/screens/RequestsScreen';
import { MessagesScreen } from './components/screens/MessagesScreen';
import { ProfileScreen } from './components/screens/ProfileScreens';
import { Toast } from './components/Toast';
import { Home, Search, Calendar, MessageSquare, User } from 'lucide-react';

export default function App() {
  const { user, currentScreen, navigate, toastMessage } = useApp();

  // Si itilizatè a pa konekte, afiche paj Welcome/Login an dirèkteman
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F7F9F8]">
        <AuthScreen />
        <Toast message={toastMessage} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#17231C] font-sans antialiased max-w-md mx-auto shadow-xl relative border-x border-[#E5EBE7]">
      <main className="min-h-screen pb-20">
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'search' && <SearchScreen />}
        {currentScreen === 'requests' && <RequestsScreen />}
        {currentScreen === 'messages' && <MessagesScreen />}
        {currentScreen === 'profile' && <ProfileScreen />}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-[#E5EBE7] px-4 py-2 z-40">
        <div className="flex items-center justify-around">
          <button
            onClick={() => navigate('home')}
            className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
              currentScreen === 'home' ? 'text-[#159447]' : 'text-[#66736B]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold">Akèy</span>
          </button>

          <button
            onClick={() => navigate('search')}
            className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
              currentScreen === 'search' ? 'text-[#159447]' : 'text-[#66736B]'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-bold">Rechèch</span>
          </button>

          <button
            onClick={() => navigate('requests')}
            className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
              currentScreen === 'requests' ? 'text-[#159447]' : 'text-[#66736B]'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-bold">Demann</span>
          </button>

          <button
            onClick={() => navigate('messages')}
            className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
              currentScreen === 'messages' ? 'text-[#159447]' : 'text-[#66736B]'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] font-bold">Mesaj</span>
          </button>

          <button
            onClick={() => navigate('profile')}
            className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
              currentScreen === 'profile' ? 'text-[#159447]' : 'text-[#66736B]'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold">Profil</span>
          </button>
        </div>
      </nav>

      <Toast message={toastMessage} />
    </div>
  );
}
