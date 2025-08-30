import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { generateInterests } from '../services/geminiService';

interface OnboardingProps {
  onComplete: (user: UserProfile) => void;
}

const PhotoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [images, setImages] = useState<(string | null)[]>([null, null]);
  const [allInterests, setAllInterests] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchInterests = async () => {
      setIsLoading(true);
      const interests = await generateInterests();
      setAllInterests(interests);
      setIsLoading(false);
    };
    fetchInterests();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => {
            const newImages = [...prev];
            newImages[activeImageIndex] = reader.result as string;
            return newImages;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = async () => {
    setIsTakingPhoto(true);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 600, height: 800, facingMode: 'user' } });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("Could not access camera. Please check permissions and try again.");
        setIsTakingPhoto(false);
    }
  };
  
  const handleCapture = () => {
      if (videoRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          // FIX: Corrected typo from `video` to `videoRef`.
          canvas.height = videoRef.current.videoHeight;
          const context = canvas.getContext('2d');
          context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          setImages(prev => {
              const newImages = [...prev];
              newImages[activeImageIndex] = dataUrl;
              return newImages;
          });
          stopCamera();
      }
  };

  const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsTakingPhoto(false);
  }

  const removeImage = (index: number) => {
    setImages(prev => {
        const newImages = [...prev];
        newImages[index] = null;
        return newImages;
    });
  }

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => {
      const newSet = new Set(prev);
      if (newSet.has(interest)) {
        newSet.delete(interest);
      } else if (newSet.size < 7) {
        newSet.add(interest);
      }
      return newSet;
    });
  };

  const handleComplete = () => {
    if (name.trim().length < 2) {
      alert("Please enter your name.");
      return;
    }
    if (jobTitle.trim().length < 3) {
      alert("Please enter your job title or department.");
      return;
    }
    if (images.every(img => img === null)) {
        alert("Please upload at least one photo.");
        return;
    }
    if (selectedInterests.size < 3) {
      alert("Please select at least 3 interests.");
      return;
    }
    const newUser: UserProfile = {
      id: `current-user-${Date.now()}`,
      name: name.trim(),
      jobTitle: jobTitle.trim(),
      imageUrls: images.filter((img): img is string => img !== null),
      interests: Array.from(selectedInterests),
    };
    onComplete(newUser);
  };
  
  const isButtonDisabled = name.trim().length < 2 || jobTitle.trim().length < 3 || selectedInterests.size < 3 || images.every(img => img === null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Create Your Profile</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Let's set you up to connect with colleagues.</p>
        
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

        <div className="mb-6 flex flex-col items-center gap-4">
          <div className="flex gap-4">
            {[0, 1].map(index => (
                <div key={index} className="w-32 h-40 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative overflow-hidden">
                    {images[index] ? (
                        <>
                            <img src={images[index]!} alt={`Profile photo ${index + 1}`} className="w-full h-full object-cover" />
                            <button onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 text-xs">&times;</button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <PhotoIcon />
                            <button onClick={() => { setActiveImageIndex(index); fileInputRef.current?.click(); }} className="text-xs bg-gray-300 dark:bg-gray-600 px-2 py-1 rounded">Upload</button>
                            <button onClick={() => { setActiveImageIndex(index); handleTakePhoto(); }} className="text-xs bg-gray-300 dark:bg-gray-600 px-2 py-1 rounded">Camera</button>
                        </div>
                    )}
                </div>
            ))}
          </div>
          <div className="w-full max-w-sm space-y-3">
             <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:border-purple-500 focus:ring-purple-500 rounded-lg py-2 px-4 outline-none text-center"
            />
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Job Title / Department"
              className="w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:border-purple-500 focus:ring-purple-500 rounded-lg py-2 px-4 outline-none text-center"
            />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Select Your Interests ({selectedInterests.size}/7)</h2>
        
        {isLoading ? (
          <div className="animate-pulse flex flex-wrap justify-center gap-3">
             {Array.from({ length: 15 }).map((_, index) => (
                <div key={index} className="h-10 w-32 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
             ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3">
            {allInterests.map(interest => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 ${
                  selectedInterests.has(interest)
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleComplete}
          disabled={isButtonDisabled}
          className="mt-8 w-full max-w-xs mx-auto bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          Find My Matches
        </button>
      </div>
      {isTakingPhoto && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-4">
            <video ref={videoRef} autoPlay playsInline className="w-full max-w-md h-auto rounded-lg mb-4"></video>
            <div className="flex gap-4">
                <button onClick={handleCapture} className="bg-green-500 text-white font-bold py-2 px-6 rounded-full">Capture</button>
                <button onClick={stopCamera} className="bg-red-500 text-white font-bold py-2 px-6 rounded-full">Cancel</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;