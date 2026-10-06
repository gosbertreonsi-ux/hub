import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  ChevronLeft,
  Phone,
  Video,
  Info,
  CheckCheck,
  Search,
  Smile,
  Shield,
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';

export const MessagesView: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    messages,
    sendMessage,
    currentUser,
    openUserProfile,
  } = useSocial();

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [activeConversationId, conversations, setActiveConversationId]);

  const activeConv = conversations.find(c => c.id === activeConversationId);
  const otherUser = activeConv?.participants.find(p => p.id !== currentUser.id);
  const currentMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;
    sendMessage(activeConversationId, inputText);
    setInputText('');
  };

  const filteredConversations = conversations.filter(c => {
    const other = c.participants.find(p => p.id !== currentUser.id);
    if (!searchQuery.trim()) return true;
    return (
      other?.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      other?.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-6 py-4 h-[calc(100vh-5rem)] md:h-[calc(100vh-2rem)] flex rounded-[32px] overflow-hidden bg-[#111111] border border-white/10 shadow-2xl text-white select-none">
      {/* Left Conversations Sidebar */}
      <div
        className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-white/10 ${
          activeConversationId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="font-display font-black text-lg text-white flex items-center gap-2">
            <span>Messages</span>
          </div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
            Encrypted
          </span>
        </div>

        {/* Search Chats */}
        <div className="p-3 border-b border-white/10">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-full bg-[#1a1a1a] border border-white/5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {filteredConversations.map(conv => {
            const recipient = conv.participants.find(p => p.id !== currentUser.id);
            const isSelected = conv.id === activeConversationId;
            return (
              <button
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`w-full p-4 flex items-center gap-3.5 text-left transition-colors ${
                  isSelected
                    ? 'bg-[#1c1c1c]'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="relative">
                  <img
                    src={recipient?.avatarUrl}
                    alt={recipient?.displayName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-black" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">
                      {recipient?.displayName}
                    </span>
                    <span className="text-[10px] text-neutral-400 shrink-0">
                      {conv.lastMessage.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 truncate mt-0.5">
                    {conv.lastMessage.text}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Chat Pane */}
      <div
        className={`flex-1 flex flex-col bg-[#0d0d0d] ${
          !activeConversationId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {activeConv && otherUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 px-5 border-b border-white/10 flex items-center justify-between bg-[#111111]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveConversationId(null)}
                  className="md:hidden p-1 text-neutral-400 hover:text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={() => openUserProfile(otherUser.id)}
                  className="flex items-center gap-3 text-left focus:outline-none"
                >
                  <img
                    src={otherUser.avatarUrl}
                    alt={otherUser.displayName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">
                      {otherUser.displayName}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Active Now</span>
                    </div>
                  </div>
                </button>
              </div>

              {/* Chat action icons */}
              <div className="flex items-center gap-2 text-neutral-400">
                <button
                  onClick={() => openUserProfile(otherUser.id)}
                  className="p-2 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                  title="View Profile"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
              <div className="text-center py-2">
                <span className="text-[10px] text-neutral-400 bg-white/5 border border-white/10 px-3.5 py-1 rounded-full">
                  Direct encrypted connection with @{otherUser.username}
                </span>
              </div>

              {currentMessages.map(msg => {
                const isMine = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] sm:max-w-md rounded-[20px] px-4 py-2.5 text-xs shadow-xl ${
                        isMine
                          ? 'bg-white text-black font-semibold rounded-br-xs'
                          : 'bg-[#1a1a1a] text-white border border-white/10 rounded-bl-xs'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      <div
                        className={`text-[9px] mt-1 flex items-center justify-end gap-1 ${
                          isMine ? 'text-neutral-600' : 'text-neutral-400'
                        }`}
                      >
                        <span>{msg.createdAt}</span>
                        {isMine && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-4 border-t border-white/10 bg-[#111111] flex items-center gap-2.5"
            >
              <input
                type="text"
                placeholder={`Message @${otherUser.username}...`}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-full px-5 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-3 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-colors disabled:opacity-30 shadow-md"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-400">
            <Send className="w-12 h-12 mb-3 stroke-1 text-neutral-600" />
            <h3 className="font-display font-extrabold text-lg text-white">
              Direct Messages
            </h3>
            <p className="text-xs mt-1 max-w-sm text-neutral-400">
              Select a conversation to communicate with creators, brands, and friends.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
