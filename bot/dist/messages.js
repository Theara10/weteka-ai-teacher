"use strict";
// Khmer and English message templates for the Telegram bot
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalizedMessage = exports.messages = void 0;
exports.messages = {
    welcome: {
        km: `🎓 សូមស្វាគមន៍មកកាន់ Weteka AI!

ខ្ញុំគឺជាជំនួយការ AI ដែលបង្កើតឡើងជាពិសេសសម្រាប់ការរៀនសូត្រនៅកម្ពុជា។ ខ្ញុំអាចជួយអ្នក៖

🔹 ឆ្លើយសំណួរអំពីមុខវិជ្ជាផ្សេងៗ
🔹 ពន្យល់ងាយស្រួល និងជាមួយឧទាហរណ៍ជាក់ស្តែង
🔹 ជួយធ្វើកិច្ចការផ្ទះ និងលំហាត់
🔹 ផ្តល់ការណែនាំការរៀនបែបបុគ្គល

សូមចាប់ផ្តើមដោយការសួរសំណួរ ឬប្រើប្រាស់ពាក្យបញ្ជាខាងក្រោម៖`,
        en: `🎓 Welcome to Weteka AI!

I'm an AI assistant specifically designed for learning in Cambodia. I can help you with:

🔹 Answering questions about various subjects
🔹 Simple explanations with practical examples
🔹 Homework and exercise assistance
🔹 Personalized learning guidance

Start by asking a question or using the commands below:`
    },
    help: {
        km: `📖 របៀបប្រើប្រាស់ Weteka AI Bot

🤖 **ពាក្យបញ្ជាសំខាន់ៗ:**
/start - ចាប់ផ្តើមការសន្ទនាថ្មី
/help - បង្ហាញការណែនាំនេះ
/about - ព័ត៌មានអំពី Weteka AI
/new - សន្ទនាថ្មី
/history - មើលប្រវត្តិការសន្ទនា

💬 **របៀបសួរសំណួរ:**
• សរសេរសំណួរដោយផ្ទាល់ជាភាសាខ្មែរ
• ឧទាហរណ៍: "ពន្យល់ឱ្យខ្ញុំស្តីអំពីការគុណភាគ"
• ឬ: "ជួយធ្វើលំហាត់គណិតវិទ្យា"

🎯 **ជំនាញរបស់ខ្ញុំ:**
• គណិតវិទ្យា - ពីមូលដ្ឋានដល់កម្រិតខ្ពស់
• វិទ្យាសាស្ត្រ - រូបវិទ្យា គីមីវិទ្យា ជីววិទ្យា
• ភាសា - វេយ្យាករណ៍ និងការសរសេរ
• ប្រវត្តិសាស្ត្រ - ប្រវត្តិសាស្ត្រកម្ពុជា និងពិភពលោក
• ព័ត៌មានវិទ្យា - programming និង technology

ចាប់ផ្តើមសួរសំណួរណាមួយ! 🚀`,
        en: `📖 How to use Weteka AI Bot

🤖 **Main Commands:**
/start - Start a new conversation
/help - Show this guide
/about - Information about Weteka AI
/new - New conversation
/history - View conversation history

💬 **How to ask questions:**
• Write questions directly in Khmer
• Example: "Explain multiplication to me"
• Or: "Help with math exercises"

🎯 **My capabilities:**
• Mathematics - from basics to advanced
• Science - Physics, Chemistry, Biology
• Language - Grammar and writing
• History - Cambodian and world history
• Computer Science - programming and technology

Start asking any question! 🚀`
    },
    about: {
        km: `🏛️ អំពី Weteka AI

Weteka AI គឺជាអ្នកជំនាញ AI ដែលបង្កើតឡើងជាពិសេសសម្រាប់សិស្សានុសិស្ស និងអ្នកចង់រៀនជនជាតិខ្មែរ។

🎯 **បេសកកម្ម:**
ធ្វើឱ្យការអប់រំមានគុណភាពធ្លុះទៅដល់កូនខ្មែរគ្រប់រូប

✨ **លក្ខណៈពិសេស:**
• ស្គាល់ភាសាខ្មែរយ៉ាងជ្រាលជ្រៅ
• យល់ពីបរិបទវប្បធម៌កម្ពុជា
• ផ្តល់ការពន្យល់ងាយស្រួល
• ជំនួយការរៀនបែបផ្ទាល់ខ្លួន

🏢 **អភិវឌ្ឍដោយ:** ក្រុម Weteka AI
🌐 **គេហទំព័រ:** weteka.ai
📧 **ទំនាក់ទំនង:** contact@weteka.ai

រីករាយក្នុងការរៀនជាមួយគ្នា! 🎓`,
        en: `🏛️ About Weteka AI

Weteka AI is an AI specialist created specifically for Cambodian students and learners.

🎯 **Mission:**
Make quality education accessible to all Cambodian children

✨ **Special Features:**
• Deep understanding of Khmer language
• Understanding of Cambodian cultural context
• Simple explanations
• Personalized learning assistance

🏢 **Developed by:** Weteka AI Team
🌐 **Website:** weteka.ai
📧 **Contact:** contact@weteka.ai

Happy learning together! 🎓`
    },
    newConversation: {
        km: `🔄 ការសន្ទនាថ្មី

ប្រវត្តិការសន្ទនាចាស់ត្រូវបានសម្អាតហើយ។ តើអ្នកចង់សួរអ្វីថ្មី?

💡 **ប្រធានបទពេញនិយម:**
• គណិតវិទ្យា និងលំហាត់
• វិទ្យាសាស្ត្រ និងពិសោធន៍
• ភាសាខ្មែរ និងការសរសេរ
• ប្រវត្តិសាស្ត្រកម្ពុជា
• ព័ត៌មានវិទ្យា និងបច្ចេកវិទ្យា`,
        en: `🔄 New Conversation

Previous conversation history has been cleared. What would you like to ask?

💡 **Popular Topics:**
• Math and exercises
• Science and experiments
• Khmer language and writing
• Cambodian history
• Computer science and technology`
    },
    noHistory: {
        km: `📝 ប្រវត្តិការសន្ទនា

អ្នកមិនទាន់មានប្រវត្តិការសន្ទនាណាមួយនៅឡើយទេ។ សូមចាប់ផ្តើមសួរសំណួរដើម្បីចាប់ផ្តើម!`,
        en: `📝 Conversation History

You don't have any conversation history yet. Start asking questions to begin!`
    },
    error: {
        km: `❌ មានបញ្ហាកើតឡើង

សូមអភ័យទោស! មានបញ្ហាបច្ចេកទេសកើតឡើង។ សូមព្យាយាមម្តងទៀត។

បើបញ្ហានៅតែមាន សូមប្រើ /start ដើម្បីចាប់ផ្តើមឡើងវិញ។`,
        en: `❌ Something went wrong

Sorry! A technical issue occurred. Please try again.

If the problem persists, use /start to restart.`
    },
    typing: {
        km: `⏳ កំពុងគិត...`,
        en: `⏳ Thinking...`
    }
};
const getLocalizedMessage = (key, language = 'km') => {
    return exports.messages[key][language] || exports.messages[key].km;
};
exports.getLocalizedMessage = getLocalizedMessage;
//# sourceMappingURL=messages.js.map