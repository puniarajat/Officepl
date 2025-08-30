
import React, { useState, useRef, useEffect } from 'react';
import { Match, UserProfile } from '../types';

interface ChatWindowProps {
  match: Match;
  currentUser: UserProfile;
  onSendMessage: (text: string) => void;
  onBack: () => void;
}

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);


const ChatWindow: React.FC<ChatWindowProps> = ({ match, currentUser, onSendMessage, onBack }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [match.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-r-xl shadow-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden">
          <BackIcon />
        </button>
        <img src={match.user.imageUrls[0]} alt={match.user.name} className="w-12 h-12 rounded-full object-cover" />
        <div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{match.user.name}</h3>
            <div className="flex flex-wrap items-center gap-1 mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Shared:</span>
                {match.sharedInterests.slice(0, 3).map(interest => (
                     <span key={interest} className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                        {interest}
                    </span>
                ))}
            </div>
        </div>
      </div>
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="space-y-4">
          {match.messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
              {msg.senderId !== currentUser.id && (
                <img src={match.user.imageUrls[0]} className="w-8 h-8 rounded-full object-cover" alt="avatar" />
              )}
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl shadow ${
                  msg.senderId === currentUser.id
                    ? 'bg-indigo-500 text-white rounded-br-none'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
                }`}
              >
                <p>{msg.text}</p>
                 <p className={`text-xs mt-1 opacity-70 ${msg.senderId === currentUser.id ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-2 bg-white dark:bg-gray-800">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow bg-gray-100 dark:bg-gray-700 border-transparent focus:border-transparent focus:ring-0 rounded-full py-2 px-4 outline-none"
        />
        <button type="submit" className="bg-indigo-500 text-white p-3 rounded-full hover:bg-indigo-600 transition-colors duration-200 transform hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;