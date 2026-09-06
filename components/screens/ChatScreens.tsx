'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/store';
import { ScreenHeader } from '../ScreenHeader';
import {
  Search,
  Send,
  Phone,
  MessageSquare,
  Image as ImageIcon,
  CheckCheck,
  Smile,
  MoreVertical,
} from 'lucide-react';

export const ChatInboxScreen: React.FC = () => {
  const { conversations, pros, navigate, t } = useApp();
  const [search, setSearch] = useState('');

  const filtered = conversations.filter((c) =>
    c.proName.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none">
      <ScreenHeader title={t.chatTitle} showBack={false} />

      <div className="p-5 space-y-4">
        {/* Search inside messages */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#66736B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Chèche nan konvèsasyon yo..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5EBE7] rounded-2xl text-xs font-medium text-[#17231C] outline-none focus:border-[#159447] shadow-2xs"
          />
        </div>

        {/* Conversations List */}
        <div className="space-y-2.5">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-[#E5EBE7]">
              <div className="w-16 h-16 bg-[#E8F6ED] rounded-full flex items-center justify-center mx-auto text-2xl mb-2">
                💬
              </div>
              <h4 className="text-sm font-bold text-[#17231C]">Pa gen mesaj</h4>
              <p className="text-xs text-[#66736B] mt-1">
                Lè w kontakte yon pwofesyonèl, mesaj yo ap parèt isit la.
              </p>
            </div>
          ) : (
            filtered.map((conv) => {
              const pro = pros.find((p) => p.id === conv.proId);

              return (
                <div
                  key={conv.id}
                  onClick={() =>
                    navigate('chat_conversation', {
                      conversationId: conv.id,
                      proId: conv.proId,
                    })
                  }
                  className="p-3.5 bg-white border border-[#E5EBE7] rounded-2xl hover:border-[#159447] hover:shadow-xs active:scale-99 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={conv.proAvatar}
                        alt={conv.proName}
                        className="w-12 h-12 rounded-full object-cover border border-[#E5EBE7]"
                      />
                      {pro?.isAvailable && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#159447] border-2 border-white rounded-full" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-black text-[#17231C] truncate">
                          {conv.proName}
                        </h4>
                        <span className="text-[10px] text-[#66736B]">• {conv.proCategory}</span>
                      </div>
                      <p className="text-xs text-[#66736B] truncate mt-0.5">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[10px] text-[#66736B]">{conv.lastMessageTime}</span>
                    {conv.unreadCount > 0 ? (
                      <span className="w-5 h-5 bg-[#159447] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    ) : (
                      <CheckCheck className="w-3.5 h-3.5 text-[#159447]" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export const ChatConversationScreen: React.FC = () => {
  const {
    screenParams,
    conversations,
    pros,
    sendMessage,
    navigate,
    showToast,
  } = useApp();

  const conversationId = screenParams?.conversationId || 'conv_1';
  const conv = conversations.find((c) => c.id === conversationId) || conversations[0];
  const pro = pros.find((p) => p.id === conv.proId) || pros[0];

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    'Èske w lib jodi a?',
    'Konbyen sa ap koute?',
    'Mwen voye kote a sou kat la.',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conv.messages]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;
    sendMessage(conv.id, text.trim());
    setInputMessage('');
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Bonjou ${pro.name}! M ap ekri w depi sou aplikasyon SÈVIS HT.`
    );
    window.open(`https://wa.me/${pro.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] flex flex-col justify-between max-w-md mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white border-b border-[#E5EBE7] px-4 py-2.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => navigate('chat_inbox')}
            className="w-8 h-8 rounded-full bg-[#F7F9F8] flex items-center justify-center text-[#17231C] text-sm font-bold"
          >
            ←
          </button>
          <div
            onClick={() => navigate('pro_profile', { proId: pro.id })}
            className="flex items-center gap-2.5 cursor-pointer min-w-0"
          >
            <div className="relative shrink-0">
              <img
                src={pro.avatar}
                alt={pro.name}
                className="w-9 h-9 rounded-full object-cover border border-[#159447]"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#159447] border-2 border-white rounded-full" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-[#17231C] truncate">{pro.name}</h4>
              <span className="text-[10px] text-[#159447] font-semibold block">
                Disponib kounye a
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openWhatsApp}
            className="w-8 h-8 rounded-full bg-[#E8F6ED] text-[#159447] flex items-center justify-center hover:bg-[#159447] hover:text-white transition-colors"
            title="Louvri WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.open(`tel:${pro.phone}`)}
            className="w-8 h-8 rounded-full bg-[#F7F9F8] border border-[#E5EBE7] text-[#17231C] flex items-center justify-center hover:bg-gray-100"
            title="Rele"
          >
            <Phone className="w-4 h-4 text-[#159447]" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {/* Timestamp header */}
        <div className="text-center my-2">
          <span className="text-[10px] font-bold text-[#66736B] bg-white border border-[#E5EBE7] px-3 py-1 rounded-full">
            Jodi a
          </span>
        </div>

        {conv.messages.map((msg) => {
          const isMe = msg.sender === 'customer';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[78%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                  isMe
                    ? 'bg-[#159447] text-white rounded-br-xs'
                    : 'bg-white border border-[#E5EBE7] text-[#17231C] rounded-bl-xs'
                }`}
              >
                <p>{msg.text}</p>
                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                    isMe ? 'text-white/80' : 'text-[#66736B]'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions chips */}
      <div className="px-4 py-2 bg-[#F7F9F8] border-t border-[#E5EBE7] flex items-center gap-2 overflow-x-auto no-scrollbar">
        {quickReplies.map((reply, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(reply)}
            className="px-3 py-1 bg-white border border-[#E5EBE7] text-[11px] font-semibold text-[#17231C] rounded-full whitespace-nowrap hover:border-[#159447] hover:text-[#159447]"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Message Input Bar */}
      <div className="p-3 bg-white border-t border-[#E5EBE7] flex items-center gap-2 sticky bottom-0">
        <button
          onClick={() => showToast('Chwazi foto pou voye ba pro a')}
          className="w-9 h-9 rounded-full bg-[#F7F9F8] text-[#66736B] hover:text-[#159447] flex items-center justify-center shrink-0"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Ekri yon mesaj..."
          className="flex-1 px-4 py-2.5 bg-[#F7F9F8] border border-[#E5EBE7] rounded-2xl text-xs font-medium text-[#17231C] outline-none focus:border-[#159447]"
        />

        <button
          onClick={() => handleSend()}
          className="w-10 h-10 rounded-full bg-[#159447] hover:bg-[#0B7A3B] text-white flex items-center justify-center shrink-0 shadow-xs active:scale-95 transition-all"
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
