
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileCardProps {
  user: UserProfile;
  onLike: (user: UserProfile) => void;
  onPass: () => void;
}

const CrossIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);


const ProfileCard: React.FC<ProfileCardProps> = ({ user, onLike, onPass }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageNavigation = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const cardWidth = e.currentTarget.offsetWidth;
    const clickX = e.nativeEvent.offsetX;

    if (clickX > cardWidth / 2) { // Click on right half
      setCurrentImageIndex(prev => Math.min(prev + 1, user.imageUrls.length - 1));
    } else { // Click on left half
      setCurrentImageIndex(prev => Math.max(prev - 1, 0));
    }
  };


  return (
    <div className="w-full max-w-sm h-[70vh] bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col relative">
      <div className="absolute top-0 left-0 w-full h-full" onClick={handleImageNavigation}>
        {user.imageUrls.map((url, index) => (
            <img 
                key={index}
                src={url} 
                alt={`${user.name} ${index + 1}`} 
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`} 
            />
        ))}
      </div>
       {user.imageUrls.length > 1 && (
        <div className="absolute top-2 left-2 right-2 flex justify-center items-center gap-2">
            {user.imageUrls.map((_, index) => (
                <div key={index} className={`h-1.5 flex-1 rounded-full ${index === currentImageIndex ? 'bg-white/90' : 'bg-white/40'}`}></div>
            ))}
        </div>
      )}
      <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black via-black/70 to-transparent p-6 flex flex-col justify-end">
        <h2 className="text-3xl font-bold text-white shadow-lg">{user.name}</h2>
        <p className="text-md text-gray-200 shadow-lg">{user.jobTitle}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {user.interests.map(interest => (
            <span key={interest} className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
              {interest}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute bottom-6 right-6 left-6 flex justify-around items-center">
        <button onClick={onPass} className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center text-red-400 hover:bg-red-400 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg">
          <CrossIcon />
        </button>
        <button onClick={() => onLike(user)} className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center text-green-400 hover:bg-green-400 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg">
          <HeartIcon />
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;