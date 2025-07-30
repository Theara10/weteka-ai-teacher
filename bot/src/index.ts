import { WetekaBot } from './bot';
import { config } from './config';

async function main() {
  try {
    console.log('🔧 Initializing Weteka AI Telegram Bot...');
    
    // Log configuration (without sensitive data)
    console.log('📋 Configuration:');
    console.log(`   Environment: ${config.environment}`);
    console.log(`   Port: ${config.server.port}`);
    console.log(`   Bot Token: ${config.telegram.botToken ? '✅ Set' : '❌ Missing'}`);
    console.log(`   Anthropic API Key: ${config.anthropic.apiKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`   Webhook URL: ${config.telegram.webhookUrl || 'Not set (using polling)'}`);

    // Create and launch bot
    const bot = new WetekaBot();
    await bot.launch();

    // Keep the process alive
    console.log('🎯 Bot is ready to serve Cambodian learners!');
    
  } catch (error) {
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