import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  const sample1x1Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  const t0 = Date.now();
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: sample1x1Png,
            },
          },
          { text: 'Analyze this image and return JSON: {"topicTitle": "Sample Note"}' },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });
    console.log('gemini-3.1-flash-lite IMAGE SUCCESS in', Date.now() - t0, 'ms:', res.text);
  } catch (e) {
    console.log('FAILED:', e.message);
  }
}

run();
