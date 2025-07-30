import { ChatMessage, AIResponse } from './types';
export declare class AIService {
    private anthropic;
    constructor();
    generateResponse(messages: ChatMessage[], userContext?: string): Promise<AIResponse>;
    summarizeConversation(messages: ChatMessage[]): Promise<string>;
}
//# sourceMappingURL=ai-service.d.ts.map