const { WetekaBotOffline } = require('./dist/bot-offline.js');

async function testAI() {
  console.log('🧪 Testing Weteka AI functionality...\n');
  
  const bot = new WetekaBotOffline();
  
  const testMessages = [
    'Hello, how are you?',
    'ជំរាបសួរ តើអ្នកសុខសប្បាយទេ?', // Khmer: Hello, how are you?
    'Can you help me learn Khmer?',
    'អ្វីជាភាសាអង់គ្លេសនៃពាក្យ "សុខសប្បាយ"?', // What is the English of "happy"?
  ];
  
  for (let i = 0; i < testMessages.length; i++) {
    const message = testMessages[i];
    console.log(`📤 User: ${message}`);
    
    try {
      const response = await bot.testAI(message);
      console.log(`🤖 AI: ${response}`);
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
    
    // Wait a bit between requests
    if (i < testMessages.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('✅ AI testing completed!');
}

// Load environment variables
require('dotenv').config();

testAI().catch(console.error);