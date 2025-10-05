export interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  userName: string;
  timestamp: Date;
  tabId: string;
}

export interface User {
  id: string;
  name: string;
  tabId: string;
  isTyping: boolean;
  avatar?: string;
}

export interface TypingEvent {
  userId: string;
  userName: string;
  isTyping: boolean;
  timestamp: Date;
}

export interface ChatEvent {
  type: 'message' | 'typing' | 'user_join' | 'user_leave';
  data: ChatMessage | TypingEvent | User;
}
