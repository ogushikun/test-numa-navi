import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import path from 'path';

// Force load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testGemini() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    console.log('Testing with API Key:', apiKey ? 'FOUND (Starts with ' + apiKey.substring(0, 5) + '...)' : 'MISSING');

    if (!apiKey) {
        console.error('No API Key found in process.env');
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        console.log('Sending prompt to gemini-2.5-flash...');
        const result = await model.generateContent('Hello, are you working?');
        const response = await result.response;
        const text = response.text();
        console.log('Success! Response:', text);
    } catch (error: any) {
        console.error('Gemini Error:', error.message);
        if (error.message.includes('404')) {
            console.error('>>> DIAGNOSIS: Model not found. Check if "Generative Language API" is enabled in Google Cloud Console for this API Key.');
        }
    }
}

testGemini();
