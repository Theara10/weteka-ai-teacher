"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_offline_1 = require("./bot-offline");
async function main() {
    try {
        const bot = new bot_offline_1.WetekaBotOffline();
        await bot.launch();
    }
    catch (error) {
        console.error('💥 Failed to start offline bot:', error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=offline-mode.js.map