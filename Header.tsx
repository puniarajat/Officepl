
import React from 'react';
import { UserProfile, View } from '../types';

interface HeaderProps {
  currentUser: UserProfile;
  setView: (view: View) => void;
  activeView: View;
}

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ currentUser, setView, activeView }) => {
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out? This will clear all your matches and conversations.")) {
      window.localStorage.removeItem('office-pal-user');
      window.localStorage.removeItem('office-pal-profiles');
      window.localStorage.removeItem('office-pal-liked');
      window.localStorage.removeItem('office-pal-index');
      window.localStorage.removeItem('office-pal-matches');
      window.location.reload();
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <img src={currentUser.imageUrls[0]} alt="My Profile" className="w-10 h-10 rounded-full object-cover border-2 border-indigo-400" />
            <button onClick={handleLogout} className="p-2 rounded-full text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <LogoutIcon />
            </button>
        </div>
        
        <div className="flex items-center space-x-2 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
            <span>Office Pal</span>
        </div>

        <div className="flex items-center space-x-4">
            <button onClick={() => setView(View.Swiping)} className={`p-2 rounded-full transition-colors duration-200 ${activeView === View.Swiping ? 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900' : 'text-gray-500 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <UsersIcon />
            </button>
             <button onClick={() => setView(View.Matches)} className={`p-2 rounded-full transition-colors duration-200 ${activeView === View.Matches || activeView === View.Chat ? 'text-purple-500 bg-purple-100 dark:bg-purple-900' : 'text-gray-500 hover:text-purple-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <ChatIcon />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;