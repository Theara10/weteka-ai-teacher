export type ContentBlockType = 'text' | 'image' | 'tool_use' | 'tool_result';

export type ContentBlock = {
  type: ContentBlockType;
  text?: string;
  source?: string;
  // Additional properties for different content types
  name?: string; // For tool_use blocks
  input?: Record<string, unknown>; // For tool_use blocks
  tool_use_id?: string; // For tool_result blocks
  content?: string | ContentBlock[]; // For tool_result blocks
  is_error?: boolean; // For tool_result blocks
};

export type MessageType = 'message';
export type MessageRole = 'user' | 'assistant';
export type StopReason = 'end_turn' | 'max_tokens' | 'stop_sequence' | 'tool_use' | null;

export type Message = {
  id: string;
  type: MessageType;
  role: MessageRole;
  content: ContentBlock[];
  model: string;
  stop_reason: StopReason;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
};

export type ChatMessageRole = 'user' | 'assistant' | 'system';

export type ChatMessage = {
  role: ChatMessageRole;
  content: string;
  timestamp?: number;
  id?: string;
  metadata?: {
    edited?: boolean;
    originalContent?: string;
    editedAt?: number;
    language?: 'km' | 'en' | 'auto';
    isError?: boolean;
  };
};

export type ChatHistory = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  messageCount?: number;
  lastMessagePreview?: string;
  tags?: string[];
};

// UI State Types
export type ThemeMode = 'light' | 'dark' | 'system';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type NavigationState = {
  currentPath: string;
  previousPath?: string;
  canGoBack: boolean;
};

export type AnalyticsEvent = {
  event: string;
  properties?: Record<string, unknown>;
  timestamp: number;
  userId?: string;
  sessionId?: string;
};

// Performance Monitoring Types
export type PerformanceMetric = {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count';
  timestamp: number;
  context?: Record<string, unknown>;
};

// Error Types
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export type AppError = {
  message: string;
  code?: string;
  severity: ErrorSeverity;
  timestamp: number;
  stack?: string;
  context?: Record<string, unknown>;
  recoverable: boolean;
};

// API Types
export type APIResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: number;
};

export type APIRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: number;
};

// Local Storage Types
export type StorageKey = 
  | 'weteka-current-conversation'
  | 'weteka-current-chat-id'
  | 'weteka-chat-histories'
  | 'weteka-theme-preference'
  | 'weteka-user-preferences'
  | 'weteka-analytics-session';

export type UserPreferences = {
  theme: ThemeMode;
  language: 'km' | 'en';
  fontSize: 'small' | 'medium' | 'large';
  reduceMotion: boolean;
  autoSave: boolean;
  notifications: {
    enabled: boolean;
    types: string[];
  };
};