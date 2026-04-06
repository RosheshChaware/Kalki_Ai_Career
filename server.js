import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import helmet from 'helmet';
import xss from 'xss';
import path from 'path';
import { fileURLToPath } from 'url';

// ── Resolve __dirname in ES Modules ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Load .env from project root ──
const envResult = dotenv.config();

if (envResult.error) {
  console.error('[ENV] FAILED to load .env from project root.');
  console.error('[ENV] Error:', envResult.error.message);
} else {
  console.log('[ENV] .env loaded successfully from project root.');
  console.log('[ENV] GROQ_API_KEY loaded:', !!process.env.GROQ_API_KEY);
  console.log(`[ENV] PORT: ${process.env.PORT}`);
  console.log(`[ENV] EMAIL_USER: ${process.env.EMAIL_USER}`);
}

// ── Startup validation — crash early with a clear message ──
if (!process.env.GROQ_API_KEY) {
  console.error('[FATAL] GROQ_API_KEY is not set. Add it to your .env file and restart the server.');
  console.error('[FATAL] Get your free key at: https://console.groq.com/keys');
  process.exit(1);
}

// ── Groq client (OpenAI-compatible) ──
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});
console.log('[Groq] Client initialized successfully. Model: llama-3.3-70b-versatile');

// ── Model constant ──
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// ── Helper: call Groq and return parsed JSON (all analysis endpoints) ──
const groqJSON = async (systemPrompt, userPrompt) => {
  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    response_format: { type: 'json_object' },
    temperature: 0.4,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });
  const raw = completion.choices[0].message.content;
  return JSON.parse(raw);
};

// ── Helper: call Groq for chat (returns plain text) ──
const groqChat = async (systemInstruction, history, userMessage) => {
  const messages = [
    { role: 'system', content: systemInstruction },
    ...history,
    { role: 'user', content: userMessage },
  ];
  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0.6,
    messages,
  });
  return completion.choices[0].message.content;
};

const app = express();

// ── SECURITY MIDDLEWARE (order matters) ──
// CORS must come before helmet so preflight OPTIONS responses include CORS headers
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:4173', // Vite preview
  'http://localhost:3000', // fallback CRA / other
  process.env.FRONTEND_URL, // production URL from .env
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS policy: origin '${origin}' is not allowed.`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(helmet());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Rate Limiting temporarily removed for development phase

// ── NODEMAILER ──
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── UTILITIES ──
const sanitizeData = (data) => {
  if (typeof data === 'string') return xss(data.trim());
  if (Array.isArray(data)) return data.map(item => sanitizeData(item));
  if (typeof data === 'object' && data !== null) {
    const sanitizedObj = {};
    for (const key in data) sanitizedObj[key] = sanitizeData(data[key]);
    return sanitizedObj;
  }
  return data;
};

// ── MEMORY CACHE (SAVES API QUOTA) ──
const apiCache = new Map();
const getCacheKey = (endpoint, bodyPayload) => `${endpoint}_${JSON.stringify(bodyPayload || {})}`;

// ── IN-FLIGHT SET: prevents duplicate concurrent calls for same cache key ──
const inFlightRequests = new Set();

// ── THROTTLE MAP: tracks last call time per cache key to enforce minimum gap ──
const lastCallTime = new Map();
const MIN_CALL_GAP_MS = 10000; // 10 seconds between identical requests

// ── API ROUTES (V1) ──

app.post('/api/v1/auth/send-login-alert', async (req, res) => {
  try {
    const { email, displayName, userAgent } = sanitizeData(req.body);

    if (!email) return res.status(400).json({ error: 'Valid email is required' });

    const nameToUse = displayName || 'User';
    const currentDate = new Date().toLocaleString();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Security Alert: New Login to CareerPath',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5;">New Login Detected</h2>
          <p>Hi <b>${nameToUse}</b>,</p>
          <p>You have successfully logged in to your CareerPath account.</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Time:</strong> ${currentDate}</p>
            <p style="margin: 0;"><strong>Device/Browser Info:</strong> ${userAgent || 'Unknown device'}</p>
          </div>
          <p>If this was you, you can safely ignore this email.</p>
          <p>If you did not log in, please reset your password immediately and contact support.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">This is an automated message, please do not reply.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Login alert email sent successfully');
    res.status(200).json({ message: 'Login alert email sent' });
  } catch (error) {
    console.error('Error in send-login-alert:', error.message);
    res.status(500).json({ error: 'Failed to send login alert. System error.' });
  }
});

// ── ANALYZE ──
app.post('/api/v1/analyze', async (req, res) => {
  try {
    const payload = sanitizeData(req.body);
    const { inputData } = payload;

    console.log('[/analyze] Incoming request — Goal:', inputData?.targetGoal, '| Stream:', inputData?.stream, '| Class:', inputData?.currentClass);

    if (!inputData) return res.status(400).json({ error: 'Input form data is required' });

    // File Upload Security Check
    if (inputData.uploadedFileData) {
      const allowedTypes = ['data:image/jpeg', 'data:image/png', 'data:image/jpg', 'data:application/pdf'];
      const isValid = allowedTypes.some(type => inputData.uploadedFileData.startsWith(type));
      if (!isValid) return res.status(400).json({ error: 'Invalid file format. Only JPG, PNG, and PDF are allowed.' });
    }

    // ── CACHE ──
    const cacheKey = getCacheKey('analyze', {
      goal: inputData.targetGoal,
      stream: inputData.stream,
      cls: inputData.currentClass,
      strong: (inputData.strongSubjectsAll || []).join(','),
      weak: (inputData.weakSubjectsAll || []).join(','),
    });
    if (apiCache.has(cacheKey)) {
      console.log('[/analyze] Cache HIT — returning cached result, no Groq call.');
      return res.status(200).json(apiCache.get(cacheKey));
    }

    // THROTTLE
    const now = Date.now();
    const lastCall = lastCallTime.get(cacheKey) || 0;
    if (now - lastCall < MIN_CALL_GAP_MS) {
      const waitMs = MIN_CALL_GAP_MS - (now - lastCall);
      console.warn(`[/analyze] THROTTLED — same profile called ${Math.round(waitMs / 1000)}s too soon.`);
      return res.status(429).json({ error: `Please wait ${Math.ceil(waitMs / 1000)}s before re-analyzing the same profile.` });
    }

    // IN-FLIGHT LOCK
    if (inFlightRequests.has(cacheKey)) {
      console.warn('[/analyze] IN-FLIGHT LOCK HIT — duplicate concurrent call blocked.');
      return res.status(429).json({ error: 'An identical request is already being processed. Please wait.' });
    }
    inFlightRequests.add(cacheKey);
    lastCallTime.set(cacheKey, now);

    const buildContext = (d) => [
      `CLASS: ${d.currentClass}`,
      `STREAM: ${d.stream}`,
      `GOAL: ${d.targetGoal}`,
      `LANGUAGE: ${d.language}`,
      `STRONG: ${(d.strongSubjectsAll || []).join()}`,
      `WEAK: ${(d.weakSubjectsAll || []).join()}`,
      `WEAK TOPICS: ${(d.weakTopicsAll || []).join()}`,
      `CHALLENGE: ${d.biggestChallenge}`,
      `CONFIDENCE: ${d.confidence}`,
      ...(d.hasFileUpload ? ['NOTE: Student uploaded a test result document. Use it as added performance evidence.'] : []),
    ].join('\n');

    const SYSTEM_PROMPT = `You are an advanced academic AI. Predict subjects, learning styles, and careers accurately for an Indian high school audience.
IMPORTANT: YOU MUST RESPOND IN THE LANGUAGE SPECIFIED IN THE CONTEXT (e.g. Hindi, English).
Output EXACT STRICT JSON ONLY with the following structure:
{
  "strongSubjects": [{"subject": "", "confidence": 0, "reason": ""}],
  "weakSubjects": [{"subject": "", "confidence": 0, "reason": ""}],
  "subjectScores": [{"subject": "", "score": 0}],
  "learningProfile": { "learningStyle": "", "consistencyLevel": "", "focusLevel": "" },
  "learningIssues": [{"type": "", "severity": "low|medium|high", "reason": ""}],
  "recommendedFocus": [{ "subject": "", "priority": "high|medium|low", "reason": "", "actionPlan": ["step 1", "step 2"] }],
  "careerSuggestions": [{"career": "", "matchScore": 0, "reason": ""}],
  "insights": { "strengthSummary": "", "weaknessSummary": "", "overallAnalysis": "" }
}`;

    console.log('[/analyze] Sending prompt to Groq for goal:', inputData.targetGoal || 'unknown');
    const jsonOutput = await groqJSON(SYSTEM_PROMPT, buildContext(inputData));

    inFlightRequests.delete(cacheKey);
    apiCache.set(cacheKey, jsonOutput);
    console.log('[/analyze] Groq responded successfully. Keys:', Object.keys(jsonOutput));
    res.status(200).json(jsonOutput);
  } catch (error) {
    if (typeof cacheKey !== 'undefined') inFlightRequests.delete(cacheKey);
    const errMsg = error.message || '';
    const errStatus = error.status || error.statusCode || 0;
    if (errStatus === 429 || errMsg.includes('429') || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('rate')) {
      console.error('[/analyze] RATE LIMIT (429):', errMsg);
      return res.status(429).json({ error: 'Groq rate limit reached. Please wait a moment and try again.' });
    }
    console.error('[/analyze] FULL ERROR:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    res.status(500).json({ error: error.message || 'AI Processing Failed. Check server logs.' });
  }
});

// ── ROADMAP UPDATE ──
app.post('/api/v1/roadmap/update', async (req, res) => {
  try {
    const { currentRoadmap, newProgress, userContext } = sanitizeData(req.body);
    if (!newProgress) return res.status(400).json({ error: 'New progress data is required' });

    const scoreNum = parseFloat(newProgress.testScore);
    const hasScore = !isNaN(scoreNum);
    const hasMessage = newProgress.experience && newProgress.experience.trim().length > 0;

    let scoreTier = '';
    if (hasScore) {
      if (scoreNum < 40) scoreTier = 'CRITICAL (below 40%) — drastically increase foundational steps, add remedial tasks, set priority to high for weak areas';
      else if (scoreNum < 60) scoreTier = 'LOW (40-59%) — add more practice steps, revisit fundamentals, increase priority on weak topics';
      else if (scoreNum < 75) scoreTier = 'MEDIUM (60-74%) — maintain balanced revision + practice, add checkpoint quizzes';
      else if (scoreNum < 90) scoreTier = 'GOOD (75-89%) — move toward application tasks, some advanced questions, reduce basic drill steps';
      else scoreTier = 'EXCELLENT (90%+) — advance to next-level content, challenge tasks, higher-order thinking';
    }

    const systemPrompt = `You are an expert AI academic mentor for Indian high school students.
Your task is to update and adapt a student's learning roadmap based on their recent input.

INSTRUCTIONS:
- Analyze both signals (score + message) together.
- If score is low: add more foundational steps, break tasks into smaller chunks, increase priority.
- If score is high: add advanced tasks, challenge problems, next-level learning.
- If student mentions a specific struggle topic, make that topic the first high-priority roadmap item.
- Generate 3 to 5 roadmap milestones, each with clear distinct titles and real tasks.
- Each task must be 1 specific, actionable learning step (not vague).
- Set status to "in-progress" only for the first item, "pending" for the rest.

OUTPUT: Return a JSON object with a "roadmap" key containing a JSON ARRAY. Conform exactly to:
{
  "roadmap": [
    {
      "id": "rm_0",
      "title": "<milestone title>",
      "status": "in-progress",
      "priority": "high",
      "aiAdvice": "<1-2 sentence mentor tip>",
      "tasks": [
        { "id": "t_0_0", "desc": "<specific task>", "completed": false }
      ]
    }
  ]
}`;

    const langPhrase = userContext?.language ? `\n[RESPOND IN LANGUAGE: ${userContext.language}]` : '';
    const userPrompt = `SCORE SIGNAL: ${hasScore ? `Test score = ${scoreNum}%. Tier: ${scoreTier}` : 'No score provided.'}
MESSAGE SIGNAL: ${hasMessage ? `Student says: "${newProgress.experience}"` : 'No message provided.'}
CURRENT SUBJECT FOCUS: ${newProgress.subject || 'General'}
EXISTING ROADMAP: ${JSON.stringify(currentRoadmap || [])}
USER CONTEXT: ${JSON.stringify(userContext || {})}${langPhrase}`;

    console.log('[/roadmap/update] Sending to Groq...');
    const jsonOutput = await groqJSON(systemPrompt, userPrompt);

    // Support both { roadmap: [...] } and direct array response
    const roadmapArray = Array.isArray(jsonOutput) ? jsonOutput : jsonOutput.roadmap;

    if (!Array.isArray(roadmapArray) || roadmapArray.length === 0) {
      return res.status(500).json({ error: 'AI returned invalid roadmap format. Please try again.' });
    }

    res.status(200).json({ roadmap: roadmapArray });
  } catch (error) {
    console.error('Error in /api/v1/roadmap/update:', error.message);
    res.status(500).json({ error: 'Failed to update roadmap. The AI service may be busy — please try again.' });
  }
});

// ── ROADMAP CHAT ──
app.post('/api/v1/roadmap/chat', async (req, res) => {
  try {
    const { message, context, history } = sanitizeData(req.body);
    if (!message) return res.status(400).json({ error: 'Message cannot be empty.' });

    // Convert history to OpenAI format (already {role, content} — just filter correctly)
    const chatHistory = (history || [])
      .filter(m => m.role === 'user' || m.role === 'model' || m.role === 'assistant')
      .map(m => ({
        role: m.role === 'model' ? 'assistant' : m.role,
        content: m.content,
      }));

    // Ensure history starts with user (Groq/OpenAI requirement)
    while (chatHistory.length > 0 && chatHistory[0].role !== 'user') chatHistory.shift();
    // Remove trailing user message — it goes as the current message
    if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'user') chatHistory.pop();

    const systemInstruction = `You are an expert AI academic roadmap mentor for Indian high school and college students.
You help students understand their learning roadmap, break down tasks, and stay motivated.
Keep responses concise, encouraging, and actionable. Always consider the Indian education context.`;

    const contextPrefix = context?.focus ? `[USER CONTEXT FOCUS: ${context.focus}] ` : '';
    const langPrefix = context?.language ? `[RESPOND IN LANGUAGE: ${context.language}] ` : '';
    const reply = await groqChat(systemInstruction, chatHistory, contextPrefix + langPrefix + message);
    res.status(200).json({ reply });
  } catch (error) {
    console.error('Error in /api/v1/roadmap/chat:', error.message);
    res.status(500).json({ error: 'Failed to connect to the Chat system.' });
  }
});

// ── ASSISTANT CHAT ──
app.post('/api/v1/assistant/chat', async (req, res) => {
  try {
    const { message, context, history } = sanitizeData(req.body);
    if (!message) return res.status(400).json({ error: 'Message cannot be empty.' });

    const chatHistory = (history || [])
      .filter(m => m.role === 'user' || m.role === 'model' || m.role === 'assistant')
      .map(m => ({
        role: m.role === 'model' ? 'assistant' : m.role,
        content: m.content,
      }));

    while (chatHistory.length > 0 && chatHistory[0].role !== 'user') chatHistory.shift();
    if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'user') chatHistory.pop();

    const systemInstruction = `You are Smart AI Assistant — a friendly, knowledgeable AI mentor built into a career guidance platform for Indian students (classes 10-12 and college).
You help with: academic guidance, career planning, scholarship discovery, study strategies, exam preparation (JEE, NEET, boards), college selection, and learning roadmaps.
Keep answers concise (2-4 paragraphs max), actionable, and student-friendly. Use bullet points for lists.
Be encouraging and supportive. Always consider the Indian education context.
If the user context mentions a specific focus area, tailor your response to that domain.`;

    const contextPrefix = context?.focus ? `[CONTEXT: ${context.focus}] ` : '';
    const langPrefix = context?.language ? `[RESPOND IN LANGUAGE: ${context.language}] ` : '';
    const reply = await groqChat(systemInstruction, chatHistory, contextPrefix + langPrefix + message);
    res.status(200).json({ reply });
  } catch (error) {
    console.error('Error in /api/v1/assistant/chat:', error.message);
    res.status(500).json({ error: 'Failed to get a response from the AI assistant.' });
  }
});

// ── CAREER DETAILS ──
app.post('/api/v1/career/details', async (req, res) => {
  try {
    const { career, language } = sanitizeData(req.body);
    if (!career) return res.status(400).json({ error: 'Career identifier is required' });

    const cacheKey = getCacheKey('career_details', { career, language });
    if (apiCache.has(cacheKey)) {
      console.log(`[Cache Hit] Returning cached career details for ${career} to avoid API limits.`);
      return res.status(200).json(apiCache.get(cacheKey));
    }

    const systemPrompt = `You are a career research expert. Provide detailed, accurate career information for Indian students. Output STRICT JSON ONLY.
IMPORTANT: YOU MUST RESPOND IN THE FOLLOWING LANGUAGE: ${language || 'English'}.`;
    const userPrompt = `Provide advanced career metrics for: ${career}.
Return JSON exactly mapping:
{
  "overview": "",
  "successRate": "",
  "failureRate": "",
  "competition": "",
  "averageSalary": "",
  "growthPotential": "",
  "topCompanies": [],
  "roadmapSteps": [],
  "technicalSkills": [],
  "softSkills": [],
  "learningResources": []
}`;

    const jsonOutput = await groqJSON(systemPrompt, userPrompt);
    apiCache.set(cacheKey, jsonOutput);
    res.status(200).json(jsonOutput);
  } catch (error) {
    console.error('Error in /api/v1/career/details:', error.message);
    res.status(500).json({ error: 'Failed to retrieve advanced career metrics.' });
  }
});

// ── AI STUDY MATERIALS ──
app.post('/api/v1/content/study-materials', async (req, res) => {
  try {
    const { goal, subjects, weakTopics, strongSubjects, currentClass, language } = sanitizeData(req.body);
    if (!goal) return res.status(400).json({ error: 'goal is required' });

    const cacheKey = getCacheKey('study_materials', { goal, currentClass, language });
    if (apiCache.has(cacheKey)) {
      console.log(`[Cache Hit] study-materials for ${goal}`);
      return res.status(200).json(apiCache.get(cacheKey));
    }

    const systemPrompt = `You are an expert Indian education resource curator. Generate personalized study materials for a student. Output STRICT JSON ONLY.
IMPORTANT: YOU MUST RESPOND IN THE FOLLOWING LANGUAGE: ${language || 'English'}.`;
    const userPrompt = `Generate study materials for a student with the following profile:
- Goal: ${goal}
- Class/Year: ${currentClass || 'Not specified'}
- Subjects: ${(subjects || []).join(', ') || 'Not specified'}
- Weak topics: ${(weakTopics || []).join(', ') || 'None'}
- Strong subjects: ${(strongSubjects || []).join(', ') || 'None'}

For URLs use ONLY real well-known educational URLs (YouTube channels, Khan Academy, NCERT, official exam sites, GeeksForGeeks, Vedantu, Unacademy). Never invent URLs.

Return JSON with this exact structure:
{
  "conceptLearning": [
    { "title": "", "description": "", "type": "Video", "url": "https://...", "subject": "", "difficulty": "Beginner|Intermediate|Advanced" }
  ],
  "practiceResources": [
    { "title": "", "description": "", "type": "Article", "url": "https://...", "subject": "", "difficulty": "Beginner|Intermediate|Advanced" }
  ],
  "revisionNotes": [
    { "title": "", "description": "", "type": "Article", "url": "https://...", "subject": "", "difficulty": "Beginner|Intermediate|Advanced" }
  ],
  "studyTopics": [
    { "topic": "", "subject": "", "explanation": "", "keyPoints": ["", "", ""], "priority": "high|medium|low" }
  ]
}

Rules:
- conceptLearning: 4 items (YouTube channels: Khan Academy, Physics Wallah, 3Blue1Brown, Unacademy)
- practiceResources: 4 items (IndiaBix, Testbook, PracticeMock, official exam practice portals)
- revisionNotes: 3 items (ncert.nic.in, byju.com, vedantu.com)
- studyTopics: 5 items focused on weak areas`;

    console.log(`[/content/study-materials] API CALL → Groq for: ${goal}`);
    const output = await groqJSON(systemPrompt, userPrompt);
    apiCache.set(cacheKey, output);
    console.log(`[/content/study-materials] Generated for: ${goal}`);
    res.status(200).json(output);
  } catch (error) {
    console.error('[/content/study-materials] Error:', error.message);
    res.status(500).json({ error: 'Failed to generate study materials. Please try again.' });
  }
});

// ── AI QUIZ (MCQ) ──
app.post('/api/v1/content/quiz', async (req, res) => {
  try {
    const { goal, weakSubject, subjects, currentClass, language } = sanitizeData(req.body);
    if (!goal) return res.status(400).json({ error: 'goal is required' });

    const focusSubject = weakSubject || (subjects || [])[0] || 'General';
    const cacheKey = getCacheKey('quiz', { goal, focusSubject, currentClass, language });
    if (apiCache.has(cacheKey)) {
      console.log(`[/content/quiz] Cache HIT for ${goal} - ${focusSubject}`);
      return res.status(200).json(apiCache.get(cacheKey));
    }

    const systemPrompt = `You are an expert exam question setter for Indian competitive and academic exams. Output STRICT JSON ONLY — a JSON array of questions, wrapped in an object.
IMPORTANT: YOU MUST RESPOND IN THE FOLLOWING LANGUAGE: ${language || 'English'}.`;
    const userPrompt = `Generate exactly 8 high-quality MCQ questions for:
- Exam/Goal: ${goal}
- Subject Focus: ${focusSubject}
- Class/Year: ${currentClass || 'Not specified'}

Requirements: exam-difficulty questions, 3 easy + 3 medium + 2 hard, 4 options each, one correct answer, brief explanation.

Return JSON with this exact structure:
{
  "questions": [
    {
      "text": "Full question text?",
      "subject": "${focusSubject}",
      "difficulty": "Easy|Medium|Hard",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}`;

    console.log(`[/content/quiz] API CALL → Groq for ${goal} - ${focusSubject}`);
    const jsonOutput = await groqJSON(systemPrompt, userPrompt);
    const questions = Array.isArray(jsonOutput) ? jsonOutput : jsonOutput.questions;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(500).json({ error: 'AI returned invalid quiz format.' });
    }

    const output = { questions, subject: focusSubject };
    apiCache.set(cacheKey, output);
    setTimeout(() => apiCache.delete(cacheKey), 60 * 60 * 1000); // Cache 1hr

    console.log(`[/content/quiz] Generated ${questions.length} Qs for ${goal} - ${focusSubject}`);
    res.status(200).json(output);
  } catch (error) {
    if (error.status === 429 || (error.message || '').includes('429') || (error.message || '').toLowerCase().includes('rate')) {
      return res.status(429).json({ error: 'Groq rate limit reached. Please try again in a moment.' });
    }
    console.error('[/content/quiz] Error:', error.message);
    res.status(500).json({ error: 'Failed to generate quiz questions. Please try again.' });
  }
});

// ── AI PYQ PRACTICE (with cache) ──
app.post('/api/v1/content/pyq', async (req, res) => {
  try {
    const { goal, subjects, weakTopics, currentClass, language } = sanitizeData(req.body);
    if (!goal) return res.status(400).json({ error: 'goal is required' });

    const cacheKey = getCacheKey('pyq', { goal, currentClass, language });
    if (apiCache.has(cacheKey)) {
      console.log(`[/content/pyq] Cache HIT for ${goal}`);
      return res.status(200).json(apiCache.get(cacheKey));
    }

    if (inFlightRequests.has(cacheKey)) {
      console.warn('[/content/pyq] IN-FLIGHT LOCK HIT — blocked duplicate call.');
      return res.status(429).json({ error: 'Same PYQ request is already in progress. Please wait.' });
    }
    inFlightRequests.add(cacheKey);

    const systemPrompt = `You are an expert in Indian competitive exam previous year questions (PYQs). Output STRICT JSON ONLY.
IMPORTANT: YOU MUST RESPOND IN THE FOLLOWING LANGUAGE: ${language || 'English'}.`;
    const userPrompt = `Generate 10 PYQ-style questions for:
- Exam: ${goal}
- Subjects: ${(subjects || []).join(', ') || 'General'}
- Class/Year: ${currentClass || 'Not specified'}
- Weak areas: ${(weakTopics || []).join(', ') || 'All topics'}

Requirements: resemble actual PYQ pattern, 3 subjects minimum, 4 easy + 4 medium + 2 hard, include year hint.
Also generate 5 real official PYQ paper links (official exam websites, byju.com, vedantu.com, cbseacademic.nic.in).

Return JSON with this exact structure:
{
  "questions": [
    {
      "text": "Full question text?",
      "subject": "Subject name",
      "difficulty": "Easy|Medium|Hard",
      "yearHint": "JEE Main 2022 style",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "Why this is correct"
    }
  ],
  "papers": [
    { "title": "Paper title", "exam": "${goal}", "url": "https://verified-url.com" }
  ]
}`;

    console.log(`[/content/pyq] API CALL → Groq for ${goal}`);
    const output = await groqJSON(systemPrompt, userPrompt);
    inFlightRequests.delete(cacheKey);

    if (!output.questions || !Array.isArray(output.questions)) {
      return res.status(500).json({ error: 'AI returned invalid PYQ format.' });
    }

    apiCache.set(cacheKey, output);
    setTimeout(() => apiCache.delete(cacheKey), 60 * 60 * 1000); // 1hr cache

    console.log(`[/content/pyq] Generated ${output.questions.length} PYQs for ${goal}`);
    res.status(200).json(output);
  } catch (error) {
    inFlightRequests.delete(getCacheKey('pyq', { goal: req.body?.goal, currentClass: req.body?.currentClass }));
    if (error.status === 429 || (error.message || '').toLowerCase().includes('rate')) {
      return res.status(429).json({ error: 'Groq rate limit reached. Please try again in a moment.' });
    }
    console.error('[/content/pyq] Error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    res.status(500).json({ error: 'Failed to generate PYQ practice. Please try again.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Secure V1 Server is actively running on port ${PORT}`);
  console.log(`✅ AI Provider: Groq (${GROQ_MODEL})`);
});
