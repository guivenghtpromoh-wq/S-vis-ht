import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { ScreenHeader } from '../ScreenHeader';
import { Send, MessageSquare, User, ArrowLeft } from 'lucide-react';

export const MessagesScreen: React.FC = () => {
  const { user, messages, sendMessage, listenToMessages } = useApp();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');

  // Lis demonstrasyon pwofesyonèl pou chat
  const chatList = [
    { id: 'pro_1', name: 'John Elektrik', category: 'Elektriyen', avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=200' },
    { id: 'pro_2', name: 'Plonb Service', category: 'Plonbye', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
  ];

  useEffect(() => {
    if (activeChat) {
      const unsubscribe = listenToMessages(activeChat);
      return () => unsubscribe();
    }
  }, [activeChat, listenToMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;
    const textToSend = inputText;
    setInputText('');
    await sendMessage(activeChat, textToSend);
  };

  const currentPartner = chatList.find((c) => c.id === activeChat);

  if (activeChat && currentPartner) {
    return (
      <div className="min-h-screen bg-[#F7F9F8] flex flex-col justify-between max-w-md mx-auto">
        {/* Header Chat */}
        <div className="p-4 bg-white border-b border-[#E5EBE7] flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => setActiveChat(null)} className="p-1.5 text-[#17231C]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img src={currentPartner.avatar} alt={currentPartner.name} className="w-9 h-9 rounded-full object-cover border border-[#E5EBE7]" />
          <div>
            <h4 className="text-xs font-bold text-[#17231C]">{currentPartner.name}</h4>
            <p className="text-[10px] text-[#159447] font-semibold">{currentPartner.category}</p>
          </div>
        </div>

        {/* List Mesaj an tan reyèl */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto min-h-[60vh]">
          {messages.length === 0 ? (
            <div className="text-center py-10 text-[11px] text-[#66736B]">
              Voye yon mesaj pou kòmanse diskite an tan reyèl.
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === user?.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs ${
                    isMe 
                      ? 'bg-[#159447] text-white rounded-br-xs shadow-xs' 
                      : 'bg-white text-[#17231C] border border-[#E5EBE7] rounded-bl-xs'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Mesaj */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#E5EBE7] flex items-center gap-2 sticky bottom-16 z-30">
          <input
            type="text"
            placeholder="Ekri yon mesaj..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-[#F7F9F8] border border-[#E5EBE7] rounded-2xl px-4 py-2.5 text-xs outline-none focus:border-[#159447]"
          />
          <button
            type="submit"
            className="w-10 h-10 bg-[#159447] text-white rounded-2xl flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none">
      <ScreenHeader title="Mesaj Yo" showBack={false} />

      <div className="p-4 space-y-3">
        <p className="text-[11px] font-bold text-[#66736B] uppercase tracking-wider">Pwofesyonèl pou chat</p>
        {chatList.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setActiveChat(chat.id)}
            className="bg-white p-3 rounded-2xl border border-[#E5EBE7] flex items-center gap-3 cursor-pointer active:bg-[#F7F9F8] transition-colors shadow-2xs"
          >
            <img src={chat.avatar} alt={chat.name} className="w-11 h-11 rounded-full object-cover border border-[#E5EBE7]" />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#17231C] truncate">{chat.name}</h4>
              <p className="text-[10px] text-[#159447] font-medium">{chat.category}</p>
            </div>
            <MessageSquare className="w-4 h-4 text-[#66736B]" />
          </div>
        ))}
      </div>
    </div>
  );
};
