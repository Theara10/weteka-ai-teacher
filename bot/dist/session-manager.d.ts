import { UserSession, ChatMessage } from './types';
export declare class SessionManager {
    private sessions;
    private readonly SESSION_TIMEOUT;
    private readonly MAX_MESSAGES_PER_SESSION;
    constructor();
    getSession(userId: number, username?: string, firstName?: string, lastName?: string): UserSession;
    addMessage(userId: number, message: ChatMessage): void;
    getMessages(userId: number): ChatMessage[];
    clearSession(userId: number): void;
    getSessionHistory(userId: number): string[];
    getActiveSessionsCount(): number;
    private createNewSession;
    private isSessionExpired;
    private cleanupExpiredSessions;
    getStats(): {
        totalSessions: number;
        activeLast24h: number;
        activeLast1h: number;
    };
}
//# sourceMappingURL=session-manager.d.ts.map