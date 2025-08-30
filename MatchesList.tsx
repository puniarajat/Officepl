
import React from 'react';
import { Match, UserProfile } from '../types';

interface MatchesListProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  currentUser: UserProfile;
}

const MatchesList: React.FC<MatchesListProps> = ({ matches, onSelectMatch, currentUser }) => {
  return (
    <aside className="w-full h-full bg-white dark:bg-gray-900 p-4 rounded-l-xl shadow-lg flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Matches</h2>
      {matches.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-center text-gray-500 dark:text-gray-400">
            <p>You haven't matched with anyone yet. Keep mingling!</p>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto">
          {matches.map(match => (
            <button key={match.id} onClick={() => onSelectMatch(match)} className="w-full text-left p-2 flex items-center space-x-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <img src={match.user.imageUrls[0]} alt={match.user.name} className="w-14 h-14 rounded-full object-cover border-2 border-purple-400" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">{match.user.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {match.messages[match.messages.length - 1]?.senderId === currentUser.id ? 'You: ' : ''}
                  {match.messages[match.messages.length - 1]?.text}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
};

export default MatchesList;