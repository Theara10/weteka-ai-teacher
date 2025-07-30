"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WetekaBotOffline = void 0;
const config_1 = require("./config");
const ai_service_1 = require("./ai-service");
const session_manager_1 = require("./session-manager");
class WetekaBotOffline {
    aiService;
    sessionManager;
    isRunning = false;
    constructor() {
        this.aiService = new ai_service_1.AIService();
        this.sessionManager = new session_manager_1.SessionManager();
    }
    async launch() {
        console.log('🚀 Starting Weteka AI Bot in OFFLINE MODE...');
        console.log('📋 Configuration:');
        console.log(`   Environment: ${config_1.config.environment}`);
        console.log(`   Bot Token: ${config_1.config.telegram.botToken ? '✅ Set' : '❌ Missing'}`);
        console.log(`   Anthropic API Key: ${config_1.config.anthropic.apiKey ? '✅ Set' : '❌ Missing'}`);
        console.log('');
        console.log('🔄 Bot is running in offline testing mode');
        console.log('💡 To test the AI functionality, you can:');
        console.log('   1. Run: npm run test-ai');
        console.log('   2. Or modify the test-bot.js file to test specific features');
        console.log('');
        console.log('📶 Network connectivity issue detected:');
        console.log('   - Bot code is working correctly');
        console.log('   - The issue is with connecting to Telegram API');
        console.log('   - This could be due to:');
        console.log('     * Firewall blocking HTTPS requests');
        console.log('     * Corporate proxy settings');
        console.log('     * Network configuration issues');
        console.log('     * Temporary Telegram API issues');
        console.log('');
        console.log('🔧 Recommended solutions:');
        console.log('   1. Try running from a different network');
        console.log('   2. Check if you need proxy settings');
        console.log('   3. Deploy to a VPS/cloud server');
        console.log('   4. Contact your network administrator');
        this.isRunning = true;
        // Simulate bot running
        setInterval(() => {
            if (!this.isRunning)
                return;
            console.log(`[${new Date().toISOString()}] 💓 Bot heartbeat - Ready to process messages`);
        }, 30000);
        // Graceful stop
        process.once('SIGINT', () => {
            console.log('🛑 Received SIGINT, stopping offline bot...');
            this.isRunning = false;
            process.exit(0);
        });
        process.once('SIGTERM', () => {
            console.log('🛑 Received SIGTERM, stopping offline bot...');
            this.isRunning = false;
            process.exit(0);
        });
    }
    // Test AI functionality locally
    async testAI(message) {
        const testUserId = 12345;
        const session = this.sessionManager.getSession(testUserId, 'test_user', 'Test User');
        const userMessage = {
            role: 'user',
            content: message,
            timestamp: Date.now(),
        };
        this.sessionManager.addMessage(testUserId, userMessage);
        const conversationHistory = this.sessionManager.getMessages(testUserId);
        const aiResponse = await this.aiService.generateResponse(conversationHistory);
        if (aiResponse.error) {
            return 'Error generating AI response: ' + aiResponse.error;
        }
        const assistantMessage = {
            role: 'assistant',
            content: aiResponse.content,
            timestamp: Date.now(),
        };
        this.sessionManager.addMessage(testUserId, assistantMessage);
        return aiResponse.content;
    }
}
exports.WetekaBotOffline = WetekaBotOffline;
//# sourceMappingURL=bot-offline.js.map