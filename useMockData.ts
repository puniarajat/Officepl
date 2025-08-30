
import { useState, useEffect } from 'react';
import { UserProfile } from '../types';

export function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue) {
        return JSON.parse(storedValue) as T;
      }
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, state]);

  return [state, setState];
}


const mockInterests = [
  "Photography", "Hiking", "Cooking", "Gaming", "Reading", "Yoga",
  "Traveling", "Coding", "Music", "Art", "Investing", "Startups",
  "Coffee", "Podcasts", "Blogging", "Rock Climbing", "Board Games",
  "Data Visualization", "Machine Learning", "Marathon Running", "Volunteering"
];

const firstNames = ["Alex", "Jordan", "Taylor", "Casey", "Riley", "Jamie", "Morgan", "Skyler", "Peyton", "Avery"];
const mockJobTitles = ["Software Engineer", "Product Manager", "UX/UI Designer", "Data Scientist", "Marketing Lead", "HR Specialist", "Content Strategist", "QA Engineer", "DevOps Specialist", "Sales Executive"];


const generateRandomUser = (id: number): UserProfile => {
  const name = firstNames[id % firstNames.length];
  const interestsCount = 3 + (id % 4); // 3 to 6 interests
  
  const interests = [...mockInterests]
    .sort((a, b) => a.localeCompare(b))
    .filter((_, index) => (index * id) % 3 === 0)
    .slice(0, interestsCount);

  return {
    id: `${name.toLowerCase()}-${id}`,
    name: name,
    jobTitle: mockJobTitles[id % mockJobTitles.length],
    imageUrls: [
        `https://picsum.photos/seed/${id}/600/800`,
        `https://picsum.photos/seed/${id + 100}/600/800`
    ],
    interests,
  };
};

export const generateMockProfiles = (currentUserId: string): UserProfile[] => {
  return Array.from({ length: 20 }, (_, i) => generateRandomUser(i + 1))
    .filter(p => p.id !== currentUserId);
};