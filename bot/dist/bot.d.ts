import { Telegraf } from 'telegraf';
import { SessionManager } from './session-manager';
export declare class WetekaBot {
    private bot;
    private aiService;
    private sessionManager;
    constructor();
    private setupCommands;
    private setupMiddleware;
    private setupHandlers;
    private sendLongMessage;
    launch(): Promise<void>;
    getBot(): Telegraf;
    getSessionManager(): SessionManager;
}
//# sourceMappingURL=bot.d.ts.map