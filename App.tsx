

import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, Match, Message, View } from './types';
import { usePersistentState, generateMockProfiles } from './hooks/useMockData';
import { generateIcebreaker } from './services/geminiService';
import Onboarding from './components/Onboarding';
import Header from './components/Header';
import ProfileCard from './components/ProfileCard';
import MatchesList from './components/MatchesList';
import ChatWindow from './components/ChatWindow';
import HomePage from './components/HomePage';

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

type AppState = 'landing' | 'onboarding' | 'main';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = usePersistentState<UserProfile | null>('office-pal-user', null);
  const [profiles, setProfiles] = usePersistentState<UserProfile[]>('office-pal-profiles', []);
  const [likedProfiles, setLikedProfiles] = usePersistentState<string[]>('office-pal-liked', []);
  const [currentIndex, setCurrentIndex] = usePersistentState<number>('office-pal-index', 0);
  const [matches, setMatches] = usePersistentState<Match[]>('office-pal-matches', []);
  
  const [activeChat, setActiveChat] = useState<Match | null>(null);
  const [view, setView] = useState<View>(View.Swiping);
  const [showMatchAnimation, setShowMatchAnimation] = useState<UserProfile | null>(null);
  const [appState, setAppState] = useState<AppState>('main');

  useEffect(() => {
    // This effect determines the correct app state based on whether a user exists.
    if (!currentUser) {
      setAppState('landing');
    } else {
      setAppState('main');
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && profiles.length === 0) {
      const generatedProfiles = generateMockProfiles(currentUser.id);
      setProfiles(generatedProfiles);
    }
  }, [currentUser, profiles.length, setProfiles]);
  
  useEffect(() => {
    if (view !== View.Chat) {
      setActiveChat(null);
    }
    if (activeChat) {
      const updatedMatch = matches.find(m => m.id === activeChat.id);
      if (updatedMatch) {
        if (JSON.stringify(updatedMatch) !== JSON.stringify(activeChat)) {
            setActiveChat(updatedMatch);
        }
      } else {
        setActiveChat(null);
      }
    }
  }, [view, matches, activeChat]);

  const handleOnboardingComplete = (user: UserProfile) => {
    if (currentUser?.id !== user.id) {
        setProfiles([]);
        setLikedProfiles([]);
        setCurrentIndex(0);
        setMatches([]);
    }
    setCurrentUser(user);
    setAppState('main');
  };

  const getSharedInterests = (user1: UserProfile, user2: UserProfile): string[] => {
    return user1.interests.filter(interest => user2.interests.includes(interest));
  };

  const handleLike = useCallback(async (likedUser: UserProfile) => {
    if (!currentUser) return;

    setLikedProfiles(prev => [...prev, likedUser.id]);

    const combinedIds = [currentUser.id, likedUser.id].sort().join('');
    let hash = 0;
    for (let i = 0; i < combinedIds.length; i++) {
        const char = combinedIds.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const theyLikedMe = (Math.abs(hash) % 10) > 2; 

    if (theyLikedMe) {
      setShowMatchAnimation(likedUser);
      const sharedInterests = getSharedInterests(currentUser, likedUser);
      let icebreaker = "You both have some interesting hobbies! Say hi!";
      if (sharedInterests.length > 0) {
        icebreaker = await generateIcebreaker(sharedInterests);
      }
      
      const newMatch: Match = {
        id: `${currentUser.id}-${likedUser.id}`,
        user: likedUser,
        messages: [{ senderId: likedUser.id, text: icebreaker, timestamp: new Date() }],
        sharedInterests,
      };
      setMatches(prev => prev.some(m => m.id === newMatch.id) ? prev : [...prev, newMatch]);

      setTimeout(() => setShowMatchAnimation(null), 3000);
    }

    setCurrentIndex(prev => prev + 1);
  }, [currentUser, setLikedProfiles, setMatches, setCurrentIndex]);

  const handlePass = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const handleSendMessage = (text: string) => {
    if (!activeChat || !currentUser) return;
    const newMessage: Message = { senderId: currentUser.id, text, timestamp: new Date() };
    const updatedChat = { ...activeChat, messages: [...activeChat.messages, newMessage] };

    setMatches(prevMatches =>
      prevMatches.map(match => (match.id === activeChat.id ? updatedChat : match))
    );
  };

  if (appState === 'landing') {
    return <HomePage onGetStarted={() => setAppState('onboarding')} />;
  }

  if (appState === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }
  
  // FIX: If there's no user, we must not render the main app.
  // This prevents a crash on the initial render before the useEffect determines the correct appState.
  if (!currentUser) {
    // Render nothing while the useEffect runs to set the state to 'landing'.
    return null;
  }
  
  const currentProfile = profiles && currentIndex < profiles.length ? profiles[currentIndex] : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-sans">
      <Header currentUser={currentUser} setView={setView} activeView={view} />
      <main className="flex-grow container mx-auto relative overflow-hidden">
        {/* Swiping View Container */}
        <div className={`absolute inset-0 transition-transform duration-500 ease-in-out flex items-center justify-center p-4 ${view === View.Swiping ? 'translate-x-0' : '-translate-x-full'}`}>
          {currentProfile ? (
            <ProfileCard user={currentProfile} onLike={handleLike} onPass={handlePass} />
          ) : (
            <div className="text-center p-8 bg-white dark:bg-gray-700 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">That's everyone for now!</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Check back later for new people.</p>
            </div>
          )}
        </div>

        {/* Matches & Chat View Container */}
        <div className={`absolute inset-0 transition-transform duration-500 ease-in-out flex ${(view === View.Matches || view === View.Chat) ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="w-1/3 md:w-1/4 h-full border-r border-gray-200 dark:border-gray-700">
            <MatchesList
              matches={matches}
              onSelectMatch={match => {
                setActiveChat(match);
                setView(View.Chat);
              }}
              currentUser={currentUser}
            />
          </div>
          <div className="w-2/3 md:w-3/4 h-full">
            {activeChat ? (
              <ChatWindow 
                match={activeChat} 
                currentUser={currentUser} 
                onSendMessage={handleSendMessage} 
                onBack={() => { 
                  setActiveChat(null); 
                  setView(View.Matches); 
                }} 
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 bg-white dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Your Matches</h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Select a match from the list to start chatting.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showMatchAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="text-center text-white animate-pulse">
            <h1 className="text-6xl font-extrabold" style={{ textShadow: '0 0 15px #f60, 0 0 25px #f06' }}>It's a Match!</h1>
            <div className="flex justify-center items-center mt-8 space-x-4">
              <img src={currentUser.imageUrls[0]} alt="You" className="w-32 h-32 rounded-full border-4 border-pink-500 object-cover" />
              <HeartIcon />
              <img src={showMatchAnimation.imageUrls[0]} alt="Matched User" className="w-32 h-32 rounded-full border-4 border-pink-500 object-cover" />
            </div>
            <p className="mt-6 text-xl">You and {showMatchAnimation.name} have liked each other.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;