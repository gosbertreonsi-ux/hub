import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Image as ImageIcon,
  Smile,
  ChevronLeft,
  Phone,
  Video,
  Info,
  CheckCheck,
  Search,
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

  // Default to first conversation if none selected
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [activeConversationId, conversations, setActiveConversationId]);

  const activeConv = conversations.find(c => c.id === activeConversationId);
  const otherUser = activeConv?.participants.find(p => p.id !== currentUser.id);
  const currentMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  // Scroll to bottom on new message
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
    <div className="max-w-6xl mx-auto px-2 sm:px-6 py-4 h-[calc(100vh-5rem)] md:h-[calc(100vh-2rem)] flex rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
      {/* Left Conversations Sidebar */}
      <div
        className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-neutral-200 dark:border-neutral-800 ${
          activeConversationId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* User Handle & Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="font-display font-bold text-base text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
            <span>{currentUser.username}</span>
          </div>
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Direct Messages
          </span>
        </div>

        {/* Search Chats */}
        <div className="p-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/40">
          {filteredConversations.map(conv => {
            const recipient = conv.participants.find(p => p.id !== currentUser.id);
            const isSelected = conv.id === activeConversationId;
            return (
              <button
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`w-full p-3.5 flex items-center gap-3 text-left transition-colors ${
                  isSelected
                    ? 'bg-neutral-100 dark:bg-neutral-800/80'
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                }`}
              >
                <div className="relative">
                  <img
                    src={recipient?.avatarUrl}
                    alt={recipient?.displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                      {recipient?.displayName}
                    </span>
                    <span className="text-[10px] text-neutral-400 shrink-0">
                      {conv.lastMessage.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
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
        className={`flex-1 flex flex-col bg-neutral-50/50 dark:bg-neutral-950/30 ${
          !activeConversationId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {activeConv && otherUser ? (
          <>
            {/* Chat Header */}
            <div className="p-3.5 px-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-900">
              <div className="flex items-center gap-3">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setActiveConversationId(null)}
                  className="md:hidden p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={() => openUserProfile(otherUser.id)}
                  className="flex items-center gap-2.5 text-left focus:outline-none"
                >
                  <img
                    src={otherUser.avatarUrl}
                    alt={otherUser.displayName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      {otherUser.displayName}
                    </div>
                    <div className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Active now</span>
                    </div>
                  </div>
                </button>
              </div>

              {/* Chat action icons */}
              <div className="flex items-center gap-2 text-neutral-500">
                <button
                  onClick={() => alert(`Voice call feature on roadmap (V3)`)}
                  className="p-2 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  title="Phone Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alert(`Video call feature on roadmap (V3)`)}
                  className="p-2 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  title="Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openUserProfile(otherUser.id)}
                  className="p-2 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  title="View Profile"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Privacy notice banner */}
              <div className="text-center py-2">
                <span className="text-[10px] text-neutral-400 bg-neutral-100 dark:bg-neutral-800/80 px-3 py-1 rounded-full">
                  🔒 Messages are end-to-end simulated for demo privacy
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
                      className={`max-w-[75%] sm:max-w-md rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                        isMine
                          ? 'bg-amber-500 text-neutral-950 font-medium rounded-br-xs'
                          : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200/60 dark:border-neutral-700/60 rounded-bl-xs'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      <div
                        className={`text-[9px] mt-1 flex items-center justify-end gap-1 ${
                          isMine ? 'text-neutral-800/80' : 'text-neutral-400'
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
              className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() =>
                  setInputText(
                    prev =>
                      prev + (prev.length === 0 ? '✨ Checking out your profile! ' : ' 🎉')
                  )
                }
                className="p-2 text-neutral-400 hover:text-amber-500 transition-colors"
                title="Add quick emoji"
              >
                <Smile className="w-5 h-5" />
              </button>

              <input
                type="text"
                placeholder={`Message @${otherUser.username}...`}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-1 bg-neutral-100 dark:bg-neutral-800 border-none rounded-xl px-4 py-2 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 transition-colors disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-400">
            <Send className="w-12 h-12 mb-3 stroke-1 text-neutral-300 dark:text-neutral-700" />
            <h3 className="font-display font-bold text-base text-neutral-700 dark:text-neutral-300">
              Your Messages
            </h3>
            <p className="text-xs mt-1 max-w-sm">
              Send direct messages, share posts, and connect directly with creators and friends across MIZIZI.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
