// Checks whether Gemma 4 on the Gemini API accepts systemInstruction + JSON mode,
// so server.ts uses only features that actually work.
// Usage: node scripts/probe-gemma.mjs
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = process.argv[2] || 'gemma-4-26b-a4b-it';

async function attempt(label, config) {
  const t0 = Date.now();
  try {
    const r = await ai.models.generateContent({
      model,
      contents: 'Return JSON {"ok": true, "lang": "<detected language of: আমি ভালো আছি>"}',
      config,
    });
    console.log(`${label}: OK ${Date.now() - t0}ms ->`, (r.text || '').slice(0, 120).replace(/\s+/g, ' '));
  } catch (e) {
    console.log(`${label}: FAIL ${Date.now() - t0}ms ->`, String(e.message).slice(0, 160));
  }
}

await attempt('plain', {});
await attempt('systemInstruction', { systemInstruction: 'You only output JSON.' });
await attempt('jsonMime', { responseMimeType: 'application/json' });
