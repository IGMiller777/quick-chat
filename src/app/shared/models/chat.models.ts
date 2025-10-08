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
export type ChatEvent =
  | { type: 'message'; data: ChatMessage }
  | { type: 'typing'; data: TypingEvent }
  | { type: 'user_join'; data: User }
  | { type: 'user_leave'; data: User };
