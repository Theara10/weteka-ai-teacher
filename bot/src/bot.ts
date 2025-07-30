import { Telegraf, Context } from 'telegraf';
import { config } from './config';
import { AIService } from './ai-service';
import { SessionManager } from './session-manager';
import { messages, getLocalizedMessage } from './messages';
import { ChatMessage } from './types';

export class WetekaBot {
  private bot: Telegraf;
  private aiService: AIService;
  private sessionManager: SessionManager;

  constructor() {
    this.bot = new Telegraf(config.telegram.botToken, {
      handlerTimeout: 90000, // 90 seconds timeout
      telegram: {
        apiRoot: 'https://api.telegram.org',
        webhookReply: false,
        agent: undefined, // Use default agent
        attachmentAgent: undefined,
      },
    });
    this.aiService = new AIService();
    this.sessionManager = new SessionManager();
    
    this.setupMiddleware();
    this.setupHandlers();
  }

  private async setupCommands() {
    // Set bot commands for Telegram UI with retry logic
    const maxRetries = 3;
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        await this.bot.telegram.setMyCommands([
          { command: 'start', description: 'ចាប់ផ្តើមការសន្ទនាថ្មី (Start new conversation)' },
          { command: 'help', description: 'ការណែនាំប្រើប្រាស់ (Usage guide)' },
          { command: 'about', description: 'អំពី Weteka AI (About Weteka AI)' },
          { command: 'new', description: 'សន្ទនាថ្មី (New conversation)' },
          { command: 'history', description: 'ប្រវត្តិការសន្ទនា (Conversation history)' },
        ]);
        console.log('✅ Bot commands set successfully');
        break;
      } catch (error) {
        retries++;
        console.warn(`⚠️ Failed to set commands (attempt ${retries}/${maxRetries}):`, error instanceof Error ? error.message : 'Unknown error');
        
        if (retries >= maxRetries) {
          console.error('❌ Could not set bot commands after multiple attempts. Bot will still work, but commands won\'t appear in Telegram UI.');
        } else {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 2000 * retries));
        }
      }
    }
  }

  private setupMiddleware() {
    // Logging middleware
    this.bot.use(async (ctx, next) => {
      const start = Date.now();
      const user = ctx.from;
      console.log(`📥 [${new Date().toISOString()}] User ${user?.id} (${user?.username || user?.first_name || 'Unknown'}): ${ctx.message ? 'message' : ctx.callbackQuery ? 'callback' : 'update'}`);
      
      await next();
      
      const ms = Date.now() - start;
      console.log(`📤 [${new Date().toISOString()}] Response time: ${ms}ms`);
    });

    // Error handling middleware
    this.bot.catch((err, ctx) => {
      console.error('Bot Error:', err);
      const userId = ctx.from?.id;
      if (userId) {
        const session = this.sessionManager.getSession(userId);
        const errorMsg = getLocalizedMessage('error', session.language);
        ctx.reply(errorMsg).catch(console.error);
      }
    });
  }

  private setupHandlers() {
    // Start command
    this.bot.start(async (ctx) => {
      const user = ctx.from;
      const session = this.sessionManager.getSession(
        user.id,
        user.username,
        user.first_name,
        user.last_name
      );

      const welcomeMessage = getLocalizedMessage('welcome', session.language);
      
      // Add welcome message to session
      const welcomeMsgObj: ChatMessage = {
        role: 'assistant',
        content: welcomeMessage,
        timestamp: Date.now(),
      };
      this.sessionManager.addMessage(user.id, welcomeMsgObj);

      await ctx.reply(welcomeMessage);
    });

    // Help command
    this.bot.help(async (ctx) => {
      const user = ctx.from;
      const session = this.sessionManager.getSession(user.id);
      const helpMessage = getLocalizedMessage('help', session.language);
      
      await ctx.reply(helpMessage);
    });

    // About command
    this.bot.command('about', async (ctx) => {
      const user = ctx.from;
      const session = this.sessionManager.getSession(user.id);
      const aboutMessage = getLocalizedMessage('about', session.language);
      
      await ctx.reply(aboutMessage);
    });

    // New conversation command
    this.bot.command('new', async (ctx) => {
      const user = ctx.from;
      this.sessionManager.clearSession(user.id);
      const session = this.sessionManager.getSession(user.id);
      const newConvMessage = getLocalizedMessage('newConversation', session.language);
      
      await ctx.reply(newConvMessage);
    });

    // History command
    this.bot.command('history', async (ctx) => {
      const user = ctx.from;
      const session = this.sessionManager.getSession(user.id);
      const history = this.sessionManager.getSessionHistory(user.id);
      
      if (history.length === 0) {
        const noHistoryMessage = getLocalizedMessage('noHistory', session.language);
        await ctx.reply(noHistoryMessage);
      } else {
        const historyText = `📝 ប្រវត្តិការសន្ទនារបស់អ្នក:\n\n${history.join('\n')}`;
        await ctx.reply(historyText);
      }
    });

    // Handle text messages
    this.bot.on('text', async (ctx) => {
      const user = ctx.from;
      const messageText = ctx.message.text;

      // Skip if it's a command (handled above)
      if (messageText.startsWith('/')) {
        return;
      }

      // Get or create session
      const session = this.sessionManager.getSession(
        user.id,
        user.username,
        user.first_name,
        user.last_name
      );

      // Add user message to session
      const userMessage: ChatMessage = {
        role: 'user',
        content: messageText,
        timestamp: Date.now(),
      };
      this.sessionManager.addMessage(user.id, userMessage);

      // Show typing indicator
      const typingMessage = getLocalizedMessage('typing', session.language);
      const typingMsgPromise = ctx.reply(typingMessage);

      try {
        // Send typing action
        await ctx.sendChatAction('typing');

        // Get conversation history
        const conversationHistory = this.sessionManager.getMessages(user.id);
        
        // Generate AI response
        const aiResponse = await this.aiService.generateResponse(conversationHistory);

        // Delete typing message
        typingMsgPromise.then(msg => {
          ctx.telegram.deleteMessage(ctx.chat.id, msg.message_id).catch(() => {});
        });

        if (aiResponse.error) {
          const errorMessage = getLocalizedMessage('error', session.language);
          await ctx.reply(errorMessage);
          return;
        }

        // Add AI response to session
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: aiResponse.content,
          timestamp: Date.now(),
        };
        this.sessionManager.addMessage(user.id, assistantMessage);

        // Split long messages if needed (Telegram has 4096 character limit)
        await this.sendLongMessage(ctx, aiResponse.content);

      } catch (error) {
        console.error('Error processing message:', error);
        
        // Delete typing message on error
        typingMsgPromise.then(msg => {
          ctx.telegram.deleteMessage(ctx.chat.id, msg.message_id).catch(() => {});
        });

        const errorMessage = getLocalizedMessage('error', session.language);
        await ctx.reply(errorMessage);
      }
    });

    // Handle callback queries (for inline keyboards if added later)
    this.bot.on('callback_query', async (ctx) => {
      await ctx.answerCbQuery();
      // Handle callback queries here if needed
    });
  }

  private async sendLongMessage(ctx: Context, text: string): Promise<void> {
    const maxLength = 4000; // Leave some buffer for Telegram's 4096 limit
    
    if (text.length <= maxLength) {
      await ctx.reply(text);
      return;
    }

    // Split by paragraphs first, then by sentences if needed
    const paragraphs = text.split('\n\n');
    let currentMessage = '';
    
    for (const paragraph of paragraphs) {
      if ((currentMessage + paragraph).length <= maxLength) {
        currentMessage += (currentMessage ? '\n\n' : '') + paragraph;
      } else {
        if (currentMessage) {
          await ctx.reply(currentMessage);
          currentMessage = '';
        }
        
        // If single paragraph is too long, split by sentences
        if (paragraph.length > maxLength) {
          const sentences = paragraph.split('. ');
          let currentPart = '';
          
          for (const sentence of sentences) {
            if ((currentPart + sentence).length <= maxLength) {
              currentPart += (currentPart ? '. ' : '') + sentence;
            } else {
              if (currentPart) {
                await ctx.reply(currentPart + (currentPart.endsWith('.') ? '' : '.'));
              }
              currentPart = sentence;
            }
          }
          
          if (currentPart) {
            currentMessage = currentPart + (currentPart.endsWith('.') ? '' : '.');
          }
        } else {
          currentMessage = paragraph;
        }
      }
    }
    
    if (currentMessage) {
      await ctx.reply(currentMessage);
    }
  }

  async launch(): Promise<void> {
    console.log('🚀 Starting Weteka AI Telegram Bot...');
    
    // Set up commands in background (don't let this block startup)
    this.setupCommands().catch(err => {
      console.warn('⚠️ Commands setup failed, but bot will still work:', err.message);
    });
    
    try {
      if (config.environment === 'production' && config.telegram.webhookUrl) {
        // Production: Use webhooks
        console.log('📡 Setting up webhook for production...');
        try {
          await this.bot.telegram.setWebhook(config.telegram.webhookUrl + '/webhook', {
            secret_token: config.telegram.webhookSecret,
          });
          console.log(`✅ Webhook set to: ${config.telegram.webhookUrl}/webhook`);
        } catch (error) {
          console.error('❌ Failed to set webhook:', error instanceof Error ? error.message : 'Unknown error');
          throw error;
        }
      } else {
        // Development: Use long polling with timeout handling
        console.log('🔄 Starting in development mode with long polling...');
        
        // Add network error handling for polling
        this.bot.catch((err) => {
          if (err instanceof Error && (err.message.includes('ETIMEDOUT') || err.message.includes('ECONNRESET'))) {
            console.warn('⚠️ Network timeout during polling, this is usually temporary...');
          } else {
            console.error('Bot polling error:', err);
          }
        });
        
        await this.bot.launch({
          dropPendingUpdates: true, // Skip old messages
        });
      }

      console.log('✅ Weteka AI Bot is running and ready to receive messages!');
      console.log('📱 You can now message the bot on Telegram');
      
      // Try to get bot info but don't fail if it doesn't work
      setTimeout(async () => {
        try {
          const botInfo = await this.bot.telegram.getMe();
          console.log(`🤖 Bot Info: @${botInfo.username} (ID: ${botInfo.id})`);
        } catch (error) {
          console.log('⚠️ Could not fetch bot info due to network issues, but bot should still work');
        }
      }, 3000);
      
      // Graceful stop
      process.once('SIGINT', () => {
        console.log('🛑 Received SIGINT, stopping bot gracefully...');
        this.bot.stop('SIGINT');
      });
      
      process.once('SIGTERM', () => {
        console.log('🛑 Received SIGTERM, stopping bot gracefully...');
        this.bot.stop('SIGTERM');
      });
      
    } catch (error) {
      console.error('💥 Failed to start bot:', error);
      
      // Check if it's a network-related error
      if (error instanceof Error && (error.message.includes('ETIMEDOUT') || error.message.includes('ECONNRESET'))) {
        console.log('🔍 This appears to be a network connectivity issue.');
        console.log('💡 The bot is configured correctly, but there seems to be a network problem.');
        console.log('💡 Try:');
        console.log('   1. Wait a few minutes and try again (Telegram API might be temporarily unreachable)');
        console.log('   2. Check your internet connection');
        console.log('   3. Try a different network if possible');
        console.log('   4. The bot will likely work fine once network connectivity improves');
      }
      
      throw error;
    }
  }

  // Get bot instance for webhook setup
  getBot(): Telegraf {
    return this.bot;
  }

  // Get session manager for monitoring
  getSessionManager(): SessionManager {
    return this.sessionManager;
  }
}