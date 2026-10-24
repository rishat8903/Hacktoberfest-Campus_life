// Diagnostic script: verifies which Gemma models and ElevenLabs voices/models
// the configured API keys can actually reach. Never prints key values.
// Usage: node scripts/probe-apis.mjs
import 'dotenv/config';

const gKey = process.env.GEMINI_API_KEY;
const eKey = process.env.ELEVENLABS_API_KEY;

async function probeGemma() {
  if (!gKey) return console.log('[gemma] GEMINI_API_KEY not set');
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?pageSize=200&key=${gKey}`);
  if (!res.ok) return console.log('[gemma] list models failed', res.status, (await res.text()).slice(0, 200));
  const json = await res.json();
  const gemma = (json.models || []).filter((m) => m.name.includes('gemma'));
  console.log('[gemma] available:', gemma.map((m) => m.name.replace('models/', '')).join(', ') || 'none');
}

async function probeEleven() {
  if (!eKey) return console.log('[eleven] ELEVENLABS_API_KEY not set');
  const res = await fetch('https://api.elevenlabs.io/v1/voices', { headers: { 'xi-api-key': eKey } });
  if (!res.ok) return console.log('[eleven] voices failed', res.status, (await res.text()).slice(0, 200));
  const json = await res.json();
  for (const v of json.voices || []) {
    const l = v.labels || {};
    console.log(`[eleven] ${v.voice_id} | ${v.name} | ${l.gender || '?'} | ${l.accent || '?'} | ${v.category}`);
  }
  // Bangla synthesis test with eleven_v3
  const t = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'}`, {
    method: 'POST',
    headers: { 'xi-api-key': eKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'পরবর্তী বাস সকাল নয়টায় ছাড়বে।', model_id: 'eleven_v3' }),
  });
  console.log('[eleven] bangla eleven_v3 test:', t.status, t.headers.get('content-type'), t.ok ? '' : (await t.text()).slice(0, 200));
}

await probeGemma();
await probeEleven();
