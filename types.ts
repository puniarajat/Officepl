
export interface UserProfile {
  id: string;
  name: string;
  jobTitle: string;
  imageUrls: string[];
  interests: string[];
}

export interface Message {
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface Match {
  id: string;
  user: UserProfile;
  messages: Message[];
  sharedInterests: string[];
}

export enum View {
  Swiping = 'SWIPING',
  Matches = 'MATCHES',
  Chat = 'CHAT',
}