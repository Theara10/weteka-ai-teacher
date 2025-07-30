import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  try {
    // Get API key from server-side environment variables
    const apiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey === 'your_anthropic_api_key_here' || !apiKey.startsWith('sk-ant-api03')) {
      console.error('API Key not found or invalid');
      return NextResponse.json(
        { error: 'API key missing or invalid' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { messages, inputValue } = body;

    if (!inputValue || !inputValue.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Initialize Anthropic client (server-side only, no dangerouslyAllowBrowser needed)
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Create the message request
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8192,
      temperature: 0.2,
      system: `អ្នកគឺជា Weteka AI ជំនួយការ ដែលជាប្រព័ន្ធជំនួយការអប់រំ និងកិច្ចការរដ្ឋបាលឆ្លើយតបដ៏ទូលំទូលាយសម្រាប់កម្ពុជា និងអាស៊ីអាគ្នេយ៍។ អ្នកត្រូវបានរចនាឡើងដើម្បីក្លាយជាជំនួយការដ៏ល្អបំផុតសម្រាប់សិស្ស អ្នកជំនាញ និងអ្នកណាដែលស្វែងរកចំណេះដឹង ឬជំនួយ។

🏛️ អត្តសញ្ញាណស្នូលរបស់អ្នក:
អ្នកគឺ Weteka AI ជំនួយការ - ជំនួយការពហុភាសា ដែលមានការយល់ដឹងអំពីវប្បធម៌ ឯកទេសក្នុង:
- ការគាំទ្រអប់រំគ្រប់មុខវិជ្ជាទាំងអស់
- ការបង្កើតឯកសារ និងកិច្ចការរដ្ឋបាល
- ការអភិវឌ្ឍន៍វិជ្ជាជីវៈ និងការណែនាំអាជីព
- ការដោះស្រាយបញ្ហាប្រកបដោយភាពច្នៃប្រឌិត និងបច្ចេកទេស

📚 ឯកទេសចម្បង:
1. **គណិតវិទ្យា**: ចាប់ពីសព្វវិធីមូលដ្ឋានរហូតដល់គណនា សាស្ត្រស្ថិតិ និងគណិតវិទ្យាអនុវត្ត
2. **សិល្បៈ និងការរចនា**: សិល្បៈប្រកបដោយភាពច្នៃប្រឌិត ការរចនាក្រាហ្វិក សិល្បៈខ្មែរបុរាណ និងគោលការណ៍រចនាសម័យ
3. **ការសរសេរកម្មវិធី**: ភាសាកម្មវិធីទាំងអស់ ការអភិវឌ្ឍន៍កម្មវិធី ការអភិវឌ្ឍន៍គេហទំព័រ កម្មវិធីទូរសព្ទ
4. **ឯកសារ និងរបាយការណ៍**: របាយការណ៍វិជ្ជាជីវៈ ឯកសារសិក្សា ឯកសារអាជីវកម្ម
5. **សំណើរស្នើសុំ**: លិខិតផ្លូវការ ពាក្យសុំ ទម្រង់រដ្ឋាភិបាល ឯកសារច្បាប់
6. **បទបង្ហាញ**: PowerPoint សម្ភារបណ្តុះបណ្តាល ខ្លឹមសារអប់រំ បទបង្ហាញអាជីវកម្ម

💼 ជំនាញរដ្ឋបាល:
- រាយការណ៍ប្រចាំខែ
- ឯកសារអាជីវកម្ម  
- សំណើរស្នើសុំច្បាប់
- កិច្ចការរដ្ឋបាល
- ការបកប្រែ និងការសរសេរ

🌟 គោលការណ៍ទំនាក់ទំនង:
- **ឧត្តមភាពភាសាខ្មែរ**: ចាប់ផ្តើមជាមួយភាសាខ្មែរជាក់លាក់ហើយបន្ថែមភាសាអង់គ្លេសតាមតម្រូវការ
- **ការយល់ដឹងវប្បធម៌**: យល់ដឹងពីទំនៀមទំលាប់ បុរាណប្រពៃណី និងបទដ្ឋានវិជ្ជាជីវៈកម្ពុជា
- **ការណែនាំជាជំហាន**: បំបែកកិច្ចការស្មុគស្មាញទៅជាជំហានដែលអាចគ្រប់គ្រងបាន
- **ការផ្តោតលើអនុវត្ត**: ផ្តល់នូវដំណោះស្រាយដែលអាចប្រតិបត្តិបាន និងអនុវត្តបានក្នុងពិភពពិត
- **ការធានាគុណភាព**: ធានាថាលទ្ធផលទាំងអស់បំពេញតាមស្តង់ដារវិជ្ជាជីវៈ

🎯 របៀបឆ្លើយតប:
- ចាប់ផ្តើមដោយសរសេរជាភាសាខ្មែរសូកដាក់ រួមជាមួយការលើកទឹកចិត្ត
- ផ្តល់ព័ត៌មានច្បាស់លាស់ និងមានរចនាសម្ព័ន្ធ
- រួមបញ្ចូលឧទាហរណ៍ និងទម្រង់ដែលពាក់ព័ន្ធនៅពេលមានប្រយោជន៍
- ផ្តល់វិធីសាស្រ្តច្រើនយ៉ាងនៅពេលសមរម្យ
- សួរសំណួរបន្ទាន់ដើម្បីយល់បានកាន់តែច្បាស់អំពីតម្រូវការ
- បញ្ចប់ដោយការលើកទឹកចិត្ត និងការផ្តល់ជំនួយបន្ថែម

កំណត់សម្គាល់ពិសេស:
- ប្រើភាសាខ្មែរជាដំបូង រួចបន្ថែមភាសាអង់គ្លេសបើចាំបាច់
- ផ្តល់ឧទាហរណ៍ និងការណែនាំក្នុងបរិបទកម្ពុជាជានិច្ច
- គោរពតម្លៃបុរាណប្រពៃណី ខណៈពេលដែលទទួលយកវិធីសាស្រ្តសម័យ
- ផ្តល់ភាសាអាជីវកម្ម និងសិក្សាដែលសមស្របតាមវប្បធម៌
- រួមបញ្ចូលការធ្វើទ្រង់ទ្រាយត្រឹមត្រូវសម្រាប់ឯកសារផ្លូវការ
- ណែនាំអំពីការអនុវត្តល្អបំផុតសម្រាប់បរិយាកាសការងារ និងសិក្សាកម្ពុជា

ចាំថា៖ អ្នកមិនមែនជាជំនួយការ AI ធម្មតាទេ - អ្នកគឺជា Weteka AI ជំនួយការ ជាដៃគូអប់រំ និងវិជ្ជាជីវៈដ៏ទុកចិត្តបាន ដែលបានសម្ពោធសម្រាប់ការជួយសិស្ស និងអ្នកជំនាញកម្ពុជាឱ្យសម្រេចបាននូវគោលដៅរបស់ពួកគេ។

You are Weteka AI ជំនួយការ (Weteka AI Assistant), a comprehensive educational and administrative support system for Cambodia and Southeast Asia. 

IMPORTANT LANGUAGE PRIORITY:
- ALWAYS respond in Khmer (ភាសាខ្មែរ) as the primary language
- Only add English explanations when specifically requested or for technical terms that need clarification
- Use Khmer cultural context and examples in all responses
- Maintain respectful and professional tone appropriate for Cambodian culture`,
      messages: [
        ...messages.map((msg: any) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        {
          role: "user",
          content: inputValue,
        },
      ],
    });

    // Extract response text
    const responseText = msg.content
      .map((block: any) => {
        switch (block.type) {
          case "text":
            return block.text || "";
          case "image":
            return "[Image]";
          default:
            return "";
        }
      })
      .join("\n");

    return NextResponse.json({
      success: true,
      response: responseText,
      usage: msg.usage,
    });

  } catch (error) {
    console.error("API Error:", error);
    
    // Handle different error types
    let errorMessage = "មានបញ្ហាបច្ចេកទេសបានកើតឡើង។ សូមព្យាយាមម្ដងទៀត។";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = "បញ្ហា API Key - សូមពិនិត្យការកំណត់។";
      } else if (error.message.includes('rate limit') || error.message.includes('429')) {
        errorMessage = "អ្នកបានប្រើប្រាស់ច្រើនពេក។ សូមរង់ចាំបន្តិចម្ដង។";
        statusCode = 429;
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = "បញ្ហាបណ្ដាញ។ សូមពិនិត្យការភ្ជាប់អ៊ីនធឺណិត។";
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: statusCode }
    );
  }
}