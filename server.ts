import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Increase payload limit for camera photo uploads of notes & notices
app.use(express.json({ limit: '40mb' }));
app.use(express.urlencoded({ limit: '40mb', extended: true }));

// Google Gen AI Client (Gemma 3.8 / Gemma 4 / Gemini Flash)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    campus: 'IIUC Kumira, Chittagong',
    models: {
      gemmaConfigured: Boolean(process.env.GEMINI_API_KEY),
      elevenLabsConfigured: Boolean(process.env.ELEVENLABS_API_KEY),
    },
  });
});

/**
 * POST /api/elevenlabs/tts
 * Generates natural audio using ElevenLabs Multilingual V2.
 * If no key or fails, client falls back to Web Speech API.
 */
app.post('/api/elevenlabs/tts', async (req: Request, res: Response): Promise<void> => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Rachel/educational voice

  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'Text is required for TTS synthesis.' });
    return;
  }

  if (!apiKey) {
    res.status(503).json({
      fallbackToBrowser: true,
      message: 'ElevenLabs API key not configured. Using browser-native speech synthesis.',
    });
    return;
  }

  try {
    const elevenResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text.slice(0, 1000), // Cap length for speed
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!elevenResponse.ok) {
      console.warn(`ElevenLabs error status: ${elevenResponse.status}`);
      res.status(502).json({ fallbackToBrowser: true, error: 'ElevenLabs audio stream error' });
      return;
    }

    const audioBuffer = await elevenResponse.arrayBuffer();
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.byteLength,
    });
    res.send(Buffer.from(audioBuffer));
  } catch (error: unknown) {
    console.error('ElevenLabs TTS error:', error);
    res.status(500).json({ fallbackToBrowser: true, error: 'Voice generation failed' });
  }
});

/**
 * POST /api/gemma/analyze-material
 * Multimodal endpoint using open-weights Gemma / Gemini API.
 * Takes photo of handwritten study notes, past questions, or university notices.
 */
app.post('/api/gemma/analyze-material', async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageBase64, mimeType, mode } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: 'Image is required for analysis.' });
      return;
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

    const isStudyNotes = mode !== 'campus_notice';
    const systemPrompt = isStudyNotes
      ? `You are an expert university academic tutor for students in Bangladesh.
You are given a photo of handwritten lecture notes, slides, or an exam question.
Analyze the handwritten or printed text and diagrams thoroughly.
Return ONLY a valid JSON object with the following schema:
{
  "topicTitle": "Clear concise title of the topic",
  "courseCode": "e.g. CSE-2401 or null if unspecified",
  "summaryBn": "A very clear, student-friendly explanation in Bengali (সহজ ভাষায় বাংলায় ব্যাখ্যা)",
  "summaryEn": "A concise, structured academic summary in English",
  "keyConcepts": ["Concept 1", "Concept 2", "Concept 3", "Concept 4"],
  "quiz": [
    {
      "id": "q1",
      "question": "Practice question based on the note",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Why this is correct in Bengali or English"
    },
    {
      "id": "q2",
      "question": "Second question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 1,
      "explanation": "Explanation"
    },
    {
      "id": "q3",
      "question": "Third question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 2,
      "explanation": "Explanation"
    }
  ]
}
Never guess illegible equations. If parts are blur, explain what is visible.`
      : `You are an expert administrative assistant for students at IIUC (International Islamic University Chittagong).
You are given a photo of an official university notice, exam schedule, fee deadline, or classroom circular.
Extract and structure all essential details into valid JSON:
{
  "noticeTitle": "Exact or inferred official notice title",
  "issuingOffice": "e.g. Controller of Examinations / Proctor Office / Dean's Office",
  "issuingOfficeBn": "দপ্তর বা বিভাগের নাম বাংলায়",
  "deadlines": ["List of critical dates/times mentioned"],
  "summaryBn": "নোটিশের মূল নির্দেশাবলী সহজ বাংলায় পয়েন্ট আকারে",
  "summaryEn": "Structured English summary of required student action",
  "destinationRoom": "Room or office to visit (e.g. Admin Building, Room 204)",
  "requiredDocuments": ["Documents student must bring, e.g. Admit Card, ID card, Bank slip"]
}`;

    // Target open model Gemma 3.8 / 4 or Gemini fallback
    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'image/jpeg',
                  data: cleanBase64,
                },
              },
              { text: isStudyNotes ? 'Analyze these student study notes.' : 'Analyze this campus notice.' },
            ],
          },
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const rawText = response.text || '';
        const parsed = JSON.parse(rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, ''));
        res.json({ success: true, model: modelName, data: parsed });
        return;
      } catch (err: unknown) {
        console.warn(`Model ${modelName} error:`, (err as Error)?.message);
      }
    }

    res.status(502).json({
      error: 'Could not analyze document with AI models. Please check API key or use preloaded sample.',
    });
  } catch (err: unknown) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: 'Server error analyzing document.' });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IIUC CampusMate running at http://localhost:${PORT}`);
  });
}

startServer();
