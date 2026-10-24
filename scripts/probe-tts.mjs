// Tests ElevenLabs TTS directly for candidate premade voices and models.
// Usage: node scripts/probe-tts.mjs
import 'dotenv/config';

const eKey = process.env.ELEVENLABS_API_KEY;
const voices = {
  'Laura (F)': 'FGY2WhTYpPnrIDTdsKH5',
  'Alice (F)': 'Xb7hH8MSUJpSbSDYk0k2',
  'Matilda (F)': 'XrExE9yKIg1WjnnlVkGX',
  'Jessica (F)': 'cgSgspJ2msm6clMCkdW9',
  'Lily (F)': 'pFZP5JQG7iQjIQuC4Bku',
  'Aria (F)': '9BWtsMINqrJLrRacOk9x',
  'Charlotte (F)': 'XB0fDUnXU5powFXDhCwa',
  'George (M)': 'JBFqnCBsd6RMkjVDRZzb',
  'Daniel (M)': 'onwK4e9ZLuTAKqWW03F9',
  'Liam (M)': 'TX3LPaxmHKxFdv7VOQHJ',
};
const tests = [
  { model: 'eleven_v3', text: 'পরবর্তী বাস সকাল নয়টায় ছাড়বে।' },
  { model: 'eleven_multilingual_v2', text: 'The next bus leaves at nine.' },
];

for (const [name, id] of Object.entries(voices)) {
  for (const t of tests) {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${id}`, {
      method: 'POST',
      headers: { 'xi-api-key': eKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: t.text, model_id: t.model }),
    });
    const body = r.ok ? `${(await r.arrayBuffer()).byteLength} bytes` : (await r.text()).slice(0, 90);
    console.log(`${name.padEnd(14)} ${t.model.padEnd(24)} ${r.status} ${body}`);
  }
}
