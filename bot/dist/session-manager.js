"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = void 0;
class SessionManager {
    sessions = new Map();
    SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
    MAX_MESSAGES_PER_SESSION = 50;
    constructor() {
        // Clean up expired sessions every hour
        setInterval(() => {
            this.cleanupExpiredSessions();
        }, 60 * 60 * 1000);
    }
    getSession(userId, username, firstName, lastName) {
        let session = this.sessions.get(userId);
        if (!session || this.isSessionExpired(session)) {
            session = this.createNewSession(userId, username, firstName, lastName);
            this.sessions.set(userId, session);
        }
        else {
            // Update user info if provided
            if (username)
                session.username = username;
            if (firstName)
                session.firstName = firstName;
            if (lastName)
                session.lastName = lastName;
            session.lastActivity = Date.now();
        }
        return session;
    }
    addMessage(userId, message) {
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
    getMessages(userId) {
        const session = this.sessions.get(userId);
        return session ? [...session.messages] : [];
    }
    clearSession(userId) {
        const session = this.sessions.get(userId);
        if (session) {
            session.messages = [];
            session.lastActivity = Date.now();
        }
    }
    getSessionHistory(userId) {
        const session = this.sessions.get(userId);
        if (!session || session.messages.length === 0) {
            return [];
        }
        // Group messages by conversation (simple heuristic: time gaps > 30 minutes)
        const conversations = [];
        let currentConversation = [];
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
    getActiveSessionsCount() {
        return this.sessions.size;
    }
    createNewSession(userId, username, firstName, lastName) {
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
    isSessionExpired(session) {
        return Date.now() - session.lastActivity > this.SESSION_TIMEOUT;
    }
    cleanupExpiredSessions() {
        const now = Date.now();
        for (const [userId, session] of this.sessions.entries()) {
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
        for (const session of this.sessions.values()) {
            const hoursSinceActive = (now - session.lastActivity) / (60 * 60 * 1000);
            if (hoursSinceActive < 24)
                activeLast24h++;
            if (hoursSinceActive < 1)
                activeLast1h++;
        }
        return {
            totalSessions: this.sessions.size,
            activeLast24h,
            activeLast1h,
        };
    }
}
exports.SessionManager = SessionManager;
//# sourceMappingURL=session-manager.js.map