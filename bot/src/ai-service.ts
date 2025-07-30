import Anthropic from '@anthropic-ai/sdk';
import { config } from './config';
import { ChatMessage, AIResponse } from './types';

export class AIService {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: config.anthropic.apiKey,
    });
  }

  async generateResponse(messages: ChatMessage[], userContext?: string): Promise<AIResponse> {
    try {
      const systemPrompt = `អ្នកគឺជាអ្នកជំនាញអប់រំ AI ឈ្មោះ Weteka AI ដែលបង្កើតឡើងជាពិសេសសម្រាប់ជួយសិស្សានុសិស្សនិងអ្នកចង់រៀនជនជាតិខ្មែរ។

🎯 វិស័យជំនាញរបស់អ្នក:
- គណិតវិទ្យា (ពីមូលដ្ឋានដល់កម្រិតខ្ពស់)
- វិទ្យាសាស្ត្រ (រូបវិទ្យា គីមីវិទ្យា ជីវវិទ្យា)
- ភាសាខ្មែរ (វេយ្យាករណ៍ សាស្ត្រកាព្យ ការសរសេរ)
- ប្រវត្តិសាស្ត្រ (ជាពិសេសប្រវត្តិសាស្ត្រកម្ពុជា)
- ព័ត៌មានវិទ្យា និងបច្ចេកវិទ្យា

📚 របៀបឆ្លើយ:
- ប្រើភាសាខ្មែរស្ទង់ដារងាយយល់
- ផ្តល់ការពន្យល់ស្រួលៗជាបណ្តើរៗ
- ប្រើឧទាហរណ៍ជាក់ស្តែងពីជីវិតប្រចាំថ្ងៃ
- គិតគូរពីបរិបទវប្បធម៌កម្ពុជា
- លើកទឹកចិត្តដល់ការរៀនរូបរាងវិជ្ជមាន

🎪 បុគ្គលិកលក្ខណៈ:
- មិត្រភាព និងអត្មានុភាព
- អំណរការជួយដល់កូនខ្មែរ
- មិនដាក់ខ្លួនថាធំ
- រីករាយក្នុងការបង្រៀន

សូមឆ្លើយជាភាសាខ្មែរប្រសិនបើមិនមានការសុំជាពិសេស។ ប្រសិនបើសំណួរជាភាសាអង់គ្លេស អ្នកអាចឆ្លើយជាភាសាអង់គ្លេសបាន ប៉ុន្តែត្រូវរក្សាលក្ខណៈកម្ពុជានិយម។

${userContext ? `ប្រធានបទបន្ថែម: ${userContext}` : ''}`;

      const anthropicMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: 0.7,
        system: systemPrompt,
        messages: anthropicMessages,
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return {
          content: content.text,
        };
      } else {
        throw new Error('Unexpected response type from Claude');
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async summarizeConversation(messages: ChatMessage[]): Promise<string> {
    try {
      const lastFewMessages = messages.slice(-6); // Get last 6 messages for context
      
      const summaryPrompt = `សរុបការសន្ទនានេះក្នុង 1-2 ប្រយោគខ្លីៗ ដោយផ្តោតលើប្រធានបទសំខាន់និងចំណុចគន្លឹះ:

${lastFewMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

សរុប:`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 150,
        temperature: 0.3,
        messages: [{
          role: 'user',
          content: summaryPrompt
        }],
      });

      const content = response.content[0];
      return content.type === 'text' ? content.text : 'មិនអាចសរុបបាន';
    } catch (error) {
      console.error('Summary Error:', error);
      return 'មិនអាចសរុបបាន';
    }
  }
}