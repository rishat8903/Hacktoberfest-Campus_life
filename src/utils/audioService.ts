import { VoiceConfig, VoiceOption } from '../types/campus';

export const CURATED_VOICES: VoiceOption[] = [
  {
    id: 'Xb7hH8MSUJpSbSDYk0k2',
    name: 'Alice (Female • Academic Tutor)',
    gender: 'female',
    style: 'Clear, articulate, educational lecture tone (English & Bengali)',
  },
  {
    id: 'JBFqnCBsd6RMkjVDRZzb',
    name: 'George (Male • University Professor)',
    gender: 'male',
    style: 'Warm, engaging, natural campus advisor (English & Bengali)',
  },
  {
    id: 'pFZP5JQG7iQjIQuC4Bku',
    name: 'Lily (Female • Gentle Explainer)',
    gender: 'female',
    style: 'Warm, gentle, friendly conversational tone (English & Bengali)',
  },
  {
    id: 'nPczCjzI2devNBz1zQrb',
    name: 'Brian (Male • Transit Announcer)',
    gender: 'male',
    style: 'Deep, confident transit & schedule announcer (English & Bengali)',
  },
  {
    id: 'cgSgspJ2msm6clMCkdW9',
    name: 'Jessica (Female • Youthful Student)',
    gender: 'female',
    style: 'Youthful, crisp, relatable student tone (English & Bengali)',
  },
  {
    id: 'onwK4e9ZLuTAKqWW03F9',
    name: 'Daniel (Male • Campus Guide)',
    gender: 'male',
    style: 'Authoritative, calm, clear campus narrator (English & Bengali)',
  },
];

const STORAGE_KEY = 'iiuc_campusmate_voice_config_v2';
const API_KEY_STORAGE = 'iiuc_campusmate_eleven_key';

export function getStoredVoiceConfig(): VoiceConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Fall back to default
  }
  return {
    voiceId: 'Xb7hH8MSUJpSbSDYk0k2', // Alice
    name: 'Alice (Academic Tutor)',
    gender: 'female',
    speechLang: 'en',
    speed: 1.0,
  };
}

export function saveVoiceConfig(config: VoiceConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save voice config', err);
  }
}

export function getStoredElevenApiKey(): string {
  try {
    return localStorage.getItem(API_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function saveStoredElevenApiKey(key: string) {
  try {
    if (key.trim()) {
      localStorage.setItem(API_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(API_KEY_STORAGE);
    }
  } catch (err) {
    console.error('Failed to save API key', err);
  }
}

let activeAudioElement: HTMLAudioElement | null = null;

export function stopVoiceAudio() {
  if (activeAudioElement) {
    activeAudioElement.pause();
    activeAudioElement.currentTime = 0;
    activeAudioElement = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export interface PlayVoiceOptions {
  text: string;
  config?: VoiceConfig;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

/**
 * Intelligent TTS synthesis:
 * 1. Tries ElevenLabs Multilingual V2 via server proxy
 * 2. If no key / network failure, smoothly falls back to browser Web Speech API
 *    with curated non-robotic neural voices.
 */
export async function playVoiceSpeech({
  text,
  config,
  onStart,
  onEnd,
  onError,
}: PlayVoiceOptions): Promise<void> {
  stopVoiceAudio();
  onStart?.();

  const activeConfig = config || getStoredVoiceConfig();
  const clientKey = getStoredElevenApiKey();
  const voiceId = activeConfig.customVoiceId?.trim() || activeConfig.voiceId;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (clientKey) {
      headers['x-elevenlabs-key'] = clientKey;
    }

    const res = await fetch('/api/elevenlabs/tts', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text,
        voiceId,
      }),
    });

    if (res.ok) {
      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      activeAudioElement = audio;

      audio.playbackRate = activeConfig.speed || 1.0;
      audio.onended = () => {
        activeAudioElement = null;
        URL.revokeObjectURL(audioUrl);
        onEnd?.();
      };
      audio.onerror = () => {
        activeAudioElement = null;
        fallbackWebSpeech(text, activeConfig, onEnd);
      };

      await audio.play();
      return;
    }
  } catch {
    // Network or proxy error, fallback smoothly
  }

  // Graceful fallback to browser Web Speech
  fallbackWebSpeech(text, activeConfig, onEnd);
}

/**
 * Enhanced Web Speech API fallback:
 * Intelligently finds the most natural human-sounding voice in the browser
 * (e.g. Google US English, Microsoft Jenny / Guy Natural) instead of standard robot voice.
 */
function fallbackWebSpeech(
  text: string,
  config: VoiceConfig,
  onEnd?: () => void
) {
  if (!('speechSynthesis' in window)) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const isBn = config.speechLang === 'bn';

  utterance.lang = isBn ? 'bn-BD' : 'en-US';
  utterance.rate = config.speed || 0.95;
  utterance.pitch = config.gender === 'female' ? 1.05 : 0.95;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    if (isBn) {
      const bnVoice = voices.find((v) => v.lang.startsWith('bn'));
      if (bnVoice) utterance.voice = bnVoice;
    } else {
      // Find high quality natural English voice
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Jenny') ||
            v.name.includes('Samantha') ||
            v.name.includes('Guy'))
      );
      if (preferred) {
        utterance.voice = preferred;
      } else {
        const anyEn = voices.find((v) => v.lang.startsWith('en'));
        if (anyEn) utterance.voice = anyEn;
      }
    }
  }

  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);
}
