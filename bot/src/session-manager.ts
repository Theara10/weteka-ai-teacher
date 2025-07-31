import { UserSession, ChatMessage } from './types';

export class SessionManager {
  private sessions: Map<number, UserSession> = new Map();
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
  private readonly MAX_MESSAGES_PER_SESSION = 50;

  constructor() {
    // Clean up expired sessions every hour
    setInterval(() => {
      this.cleanupExpiredSessions();
    }, 60 * 60 * 1000);
  }

  getSession(userId: number, username?: string, firstName?: string, lastName?: string): UserSession {
    let session = this.sessions.get(userId);
    
    if (!session || this.isSessionExpired(session)) {
      session = this.createNewSession(userId, username, firstName, lastName);
      this.sessions.set(userId, session);
    } else {
      // Update user info if provided
      if (username) session.username = username;
      if (firstName) session.firstName = firstName;
      if (lastName) session.lastName = lastName;
      session.lastActivity = Date.now();
    }

    return session;
  }

  addMessage(userId: number, message: ChatMessage): void {
    const session = this.sessions.get(userId);
    if (!session) {
      throw new Error(`Session not found for user ${userId}`);
    }

    session.messages.push(message);
    session.lastActivity = Date.now();

    // Trim messages if exceeding limit (keep system messages and recent conversation)
    if (session.messages.length > this.MAX_MESSAGES_PER_SESSION) {
      const systemMessages = session.messages.filter(msg => msg.role === 'assistant' && msg.content.includes('សូមស្វាគមន៍'));
      const recentMessages = session.messages.slice(-this.MAX_MESSAGES_PER_SESSION + systemMessages.length);
      session.messages = [...systemMessages, ...recentMessages];
    }
  }

  getMessages(userId: number): ChatMessage[] {
    const session = this.sessions.get(userId);
    return session ? [...session.messages] : [];
  }

  clearSession(userId: number): void {
    const session = this.sessions.get(userId);
    if (session) {
      session.messages = [];
      session.lastActivity = Date.now();
    }
  }

  getSessionHistory(userId: number): string[] {
    const session = this.sessions.get(userId);
    if (!session || session.messages.length === 0) {
      return [];
    }

    // Group messages by conversation (simple heuristic: time gaps > 30 minutes)
    const conversations: ChatMessage[][] = [];
    let currentConversation: ChatMessage[] = [];
    let lastTimestamp = 0;

    for (const message of session.messages) {
      if (message.timestamp - lastTimestamp > 30 * 60 * 1000 && currentConversation.length > 0) {
        conversations.push(currentConversation);
        currentConversation = [];
      }
      currentConversation.push(message);
      lastTimestamp = message.timestamp;
    }

    if (currentConversation.length > 0) {
      conversations.push(currentConversation);
    }

    // Generate summaries for each conversation
    return conversations.map((conv, index) => {
      const firstUserMessage = conv.find(msg => msg.role === 'user')?.content || '';
      const timestamp = new Date(conv[0].timestamp).toLocaleDateString('km-KH');
      const messageCount = conv.length;
      
      return `${index + 1}. ${timestamp} - ${firstUserMessage.substring(0, 50)}${firstUserMessage.length > 50 ? '...' : ''} (${messageCount} សារ)`;
    });
  }

  getActiveSessionsCount(): number {
    return this.sessions.size;
  }

  private createNewSession(userId: number, username?: string, firstName?: string, lastName?: string): UserSession {
    return {
      userId,
      username,
      firstName,
      lastName,
      messages: [],
      lastActivity: Date.now(),
      language: 'km', // Default to Khmer
    };
  }

  private isSessionExpired(session: UserSession): boolean {
    return Date.now() - session.lastActivity > this.SESSION_TIMEOUT;
  }

  private cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [userId, session] of Array.from(this.sessions.entries())) {
      if (now - session.lastActivity > this.SESSION_TIMEOUT) {
        this.sessions.delete(userId);
      }
    }
    
    console.log(`Session cleanup completed. Active sessions: ${this.sessions.size}`);
  }

  // Get statistics for monitoring
  getStats() {
    const now = Date.now();
    let activeLast24h = 0;
    let activeLast1h = 0;
    
    for (const session of Array.from(this.sessions.values())) {
      const hoursSinceActive = (now - session.lastActivity) / (60 * 60 * 1000);
      if (hoursSinceActive < 24) activeLast24h++;
      if (hoursSinceActive < 1) activeLast1h++;
    }

    return {
      totalSessions: this.sessions.size,
      activeLast24h,
      activeLast1h,
    };
  }
}