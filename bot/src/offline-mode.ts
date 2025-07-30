import { WetekaBotOffline } from './bot-offline';

async function main() {
  try {
    const bot = new WetekaBotOffline();
    await bot.launch();
  } catch (error) {
    console.error('💥 Failed to start offline bot:', error);
    process.exit(1);
  }
}

main();