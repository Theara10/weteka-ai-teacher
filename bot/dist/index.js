"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("./bot");
const config_1 = require("./config");
async function main() {
    try {
        console.log('🔧 Initializing Weteka AI Telegram Bot...');
        // Log configuration (without sensitive data)
        console.log('📋 Configuration:');
        console.log(`   Environment: ${config_1.config.environment}`);
        console.log(`   Port: ${config_1.config.server.port}`);
        console.log(`   Bot Token: ${config_1.config.telegram.botToken ? '✅ Set' : '❌ Missing'}`);
        console.log(`   Anthropic API Key: ${config_1.config.anthropic.apiKey ? '✅ Set' : '❌ Missing'}`);
        console.log(`   Webhook URL: ${config_1.config.telegram.webhookUrl || 'Not set (using polling)'}`);
        // Create and launch bot
        const bot = new bot_1.WetekaBot();
        await bot.launch();
        // Keep the process alive
        console.log('🎯 Bot is ready to serve Cambodian learners!');
    }
    catch (error) {
        console.error('💥 Failed to start bot:', error);
        process.exit(1);
    }
}
// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
// Start the bot
main();
//# sourceMappingURL=index.js.map