'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { ScreenHeader } from '../ScreenHeader';
import { Bell, CheckCheck, Calendar, MessageSquare, ShieldAlert, Sparkles } from 'lucide-react';

export const NotificationsScreen: React.FC = () => {
  const { notifications, markAllNotificationsRead, navigate, t } = useApp();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'request':
        return <Calendar className="w-4 h-4 text-[#159447]" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'promo':
        return <Sparkles className="w-4 h-4 text-[#D99A2B]" />;
      default:
        return <Bell className="w-4 h-4 text-[#159447]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none">
      <ScreenHeader
        title={t.notificationsTitle}
        onBack={() => navigate('home')}
        rightAction={
          <button
            onClick={markAllNotificationsRead}
            className="text-xs font-bold text-[#159447] hover:underline flex items-center gap-1"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Li tout</span>
          </button>
        }
      />

      <div className="p-5 space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-[#E5EBE7]">
            <div className="w-14 h-14 bg-[#E8F6ED] rounded-full flex items-center justify-center mx-auto text-2xl mb-2">
              🔔
            </div>
            <h4 className="text-sm font-bold text-[#17231C]">Pa gen notifikasyon</h4>
            <p className="text-xs text-[#66736B] mt-1">
              Nou ap fè w konnen le gen mizajou sou demann ou yo.
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                if (notif.requestId) {
                  navigate('request_details', { requestId: notif.requestId });
                }
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                notif.isRead
                  ? 'bg-white border-[#E5EBE7]'
                  : 'bg-[#E8F6ED]/40 border-[#159447]/40 shadow-2xs'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-white border border-[#E5EBE7] flex items-center justify-center shrink-0 shadow-xs">
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#17231C] truncate">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-[#66736B] shrink-0">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs text-[#66736B] mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>

              {!notif.isRead && (
                <span className="w-2 h-2 rounded-full bg-[#159447] shrink-0 mt-1" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
