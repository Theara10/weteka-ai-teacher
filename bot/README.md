# Weteka AI Telegram Bot

🎓 **Telegram bot version of Weteka AI - AI assistant for Cambodian learners**

## 🚀 Features

### Core Bot Commands
- `/start` - Welcome message and introduction in Khmer
- `/help` - Comprehensive usage instructions
- `/about` - Information about Weteka AI
- `/new` - Start new conversation (clears history)
- `/history` - Show recent conversation summaries

### AI Capabilities
- **Subject Expertise**: Math, Science, Khmer Language, History, Computer Science
- **Khmer Language**: Native-level understanding and responses
- **Cultural Context**: Understands Cambodian educational context
- **Personalized**: Adapts to individual learning needs

### Technical Features
- **Session Management**: 24-hour session persistence with automatic cleanup
- **Message History**: Maintains conversation context (up to 50 messages)
- **Long Message Handling**: Automatically splits responses over Telegram's 4096 character limit
- **Error Recovery**: Graceful error handling with user-friendly messages
- **Performance Monitoring**: Built-in session statistics and logging

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- Telegram Bot Token (from @BotFather)
- Anthropic API Key (Claude AI)

### Installation

1. **Install Dependencies**
   ```bash
   cd bot
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Development Mode**
   ```bash
   npm run dev
   ```

4. **Production Build**
   ```bash
   npm run build
   npm start
   ```

### Environment Variables

```bash
# Required
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional
NODE_ENV=development
PORT=3001
TELEGRAM_WEBHOOK_URL=https://yourdomain.com  # For production
WEBHOOK_SECRET=your_webhook_secret
```

## 🎯 Getting Bot Token

1. **Create Bot with @BotFather**
   - Message @BotFather on Telegram
   - Send `/newbot`
   - Choose name: "Weteka AI" 
   - Choose username: "weteka_ai_bot" (or available alternative)
   - Copy the token provided

2. **Configure Bot Settings**
   ```
   /setdescription - Weteka AI - AI ជំនួយការអប់រំសម្រាប់កូនខ្មែរ
   /setabouttext - Weteka AI គឺជា AI ជំនួយការដែលបង្កើតឡើងជាពិសេសសម្រាប់ជួយការរៀនសូត្រនៅកម្ពុជា
   /setuserpic - Upload Weteka AI logo
   ```

## 📱 Bot Commands Setup

The bot automatically registers these commands with Telegram:

```javascript
[
  { command: 'start', description: 'ចាប់ផ្តើមការសន្ទនាថ្មី (Start new conversation)' },
  { command: 'help', description: 'ការណែនាំប្រើប្រាស់ (Usage guide)' },
  { command: 'about', description: 'អំពី Weteka AI (About Weteka AI)' },
  { command: 'new', description: 'សន្ទនាថ្មី (New conversation)' },
  { command: 'history', description: 'ប្រវត្តិការសន្ទនា (Conversation history)' }
]
```

## 🏗️ Architecture

### File Structure
```
bot/
├── src/
│   ├── ai-service.ts      # Claude AI integration
│   ├── bot.ts             # Main bot logic and handlers
│   ├── config.ts          # Environment configuration
│   ├── index.ts           # Application entry point
│   ├── messages.ts        # Khmer/English message templates
│   ├── session-manager.ts # User session management
│   └── types.ts           # TypeScript type definitions
├── package.json           # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── .env.example          # Environment template
```

### Key Components

1. **AIService**: Handles Claude AI API interactions with Khmer-optimized prompts
2. **SessionManager**: Manages user sessions, conversation history, and cleanup
3. **WetekaBot**: Main bot class with command handlers and message processing
4. **Messages**: Localized message templates in Khmer and English

## 🚦 Deployment

### Development
```bash
npm run dev  # Runs with tsx watch for hot reloading
```

### Production (Polling)
```bash
npm run build && npm start
```

### Production (Webhook)
1. Set up HTTPS endpoint (e.g., with nginx + SSL)
2. Configure `TELEGRAM_WEBHOOK_URL` in environment
3. Bot will automatically set webhook on startup

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3001
CMD ["npm", "start"]
```

## 📊 Monitoring

### Session Statistics
The bot provides built-in session monitoring:
- Total active sessions
- Users active in last 24 hours
- Users active in last hour
- Automatic session cleanup

### Logging
- Structured logging with timestamps
- User interaction tracking
- Performance metrics (response times)
- Error tracking and reporting

## 🔧 Customization

### Adding New Commands
```typescript
// In bot.ts
this.bot.command('mycommand', async (ctx) => {
  // Command logic here
});
```

### Modifying AI Behavior
Edit the system prompt in `ai-service.ts` to adjust the AI's personality and capabilities.

### Adding Languages
Extend the `messages.ts` file with additional language support.

## ⚠️ Important Notes

1. **Rate Limits**: Telegram bots have rate limits (30 messages/second)
2. **Message Length**: Responses are automatically split at 4000 characters
3. **Session Cleanup**: User sessions expire after 24 hours of inactivity
4. **Privacy**: No user data is stored permanently; all sessions are in-memory

## 🐛 Troubleshooting

### Common Issues

1. **Bot doesn't respond**
   - Check bot token is correct
   - Verify bot is not already running elsewhere
   - Check network connectivity

2. **AI responses fail**
   - Verify Anthropic API key
   - Check API rate limits and billing
   - Review error logs for details

3. **Webhook issues**
   - Ensure HTTPS endpoint is accessible
   - Check webhook URL configuration
   - Verify SSL certificate is valid

### Debug Mode
Set `NODE_ENV=development` for detailed logging and error reporting.

## 📞 Support

For issues and contributions, please contact the Weteka AI team or create an issue in the project repository.

---

🇰🇭 **Built with ❤️ for Cambodian learners by the Weteka AI team**