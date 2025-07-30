export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface UserSession {
  userId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  messages: ChatMessage[];
  lastActivity: number;
  language: 'km' | 'en';
}

export interface BotContext {
  userId: number;
  messageId: number;
  text?: string;
  command?: string;
}

export interface AIResponse {
  content: string;
  error?: string;
}