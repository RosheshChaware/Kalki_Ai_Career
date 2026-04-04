import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import helmet from 'helmet';
import xss from 'xss';

dotenv.config();

// Secure backend-only API key usage
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const app = express();

// ── SECURITY MIDDLEWARE ──
app.use(helmet()); 
app.use(cors());
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

    const info = await transporter.sendMail(mailOptions);
    console.log('Login alert email sent successfully');
    res.status(200).json({ message: 'Login alert email sent' });
  } catch (error) {
    console.error('Error in send-login-alert:', error.message);
    res.status(500).json({ error: 'Failed to send login alert. System error.' });
  }
});

app.post('/api/v1/analyze', async (req, res) => {
  try {
    const payload = sanitizeData(req.body);
    const { inputData } = payload;
    if (!inputData) return res.status(400).json({ error: 'Input form data is required' });
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'System AI config is missing' });

    // File Upload Security Check
    if (inputData.uploadedFileData) {
        const allowedTypes = ['data:image/jpeg', 'data:image/png', 'data:image/jpg', 'data:application/pdf'];
        const isValid = allowedTypes.some(type => inputData.uploadedFileData.startsWith(type));
        if (!isValid) return res.status(400).json({ error: 'Invalid file format. Only JPG, PNG, and PDF are allowed.' });
    }

    const cacheKey = getCacheKey('analyze_profile', { formData: inputData, hasFile: !!inputData.uploadedFileData });
    if (apiCache.has(cacheKey)) {
        console.log('[Cache Hit] Returning cached /analyze data to save API Quota.');
        return res.status(200).json(apiCache.get(cacheKey));
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const buildContext = (d) => {
      const lines = [
        `CLASS: ${d.currentClass}`,
        `STREAM: ${d.stream}`,
        `GOAL: ${d.targetGoal}`,
        `LANGUAGE: ${d.language}`,
        `STRONG: ${(d.strongSubjectsAll || []).join()}`,
        `WEAK: ${(d.weakSubjectsAll || []).join()}`,
        `WEAK TOPICS: ${(d.weakTopicsAll || []).join()}`,
        `CHALLENGE: ${d.biggestChallenge}`,
        `CONFIDENCE: ${d.confidence}`
      ];
      if (d.hasFileUpload) lines.push('NOTE: Student uploaded a test result document. Use it as added performance evidence.');
      return lines.join('\n');
    };

    const SYSTEM_PROMPT = `You are an advanced academic AI. Predict subjects, learning styles, and careers accurately for an Indian high school audience.
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
    const prompt = `${SYSTEM_PROMPT}\n\n--- STUDENT DATA ---\n${buildContext(inputData)}`;

    const result = await model.generateContent(prompt);
    const jsonOutput = JSON.parse(result.response.text());

    apiCache.set(cacheKey, jsonOutput); // Save to cache
    res.status(200).json(jsonOutput);
  } catch (error) {
    console.error('Error in /api/v1/analyze:', error.message);
    res.status(500).json({ error: 'AI Processing Failed. Server is busy or limits reached.' });
  }
});

app.post('/api/v1/roadmap/update', async (req, res) => {
  try {
    const { currentRoadmap, newProgress, userContext } = sanitizeData(req.body);
    if (!newProgress) return res.status(400).json({ error: 'New progress data is required' });
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'System AI config is missing' });

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const scoreNum = parseFloat(newProgress.testScore);
    const hasScore = !isNaN(scoreNum);
    const hasMessage = newProgress.experience && newProgress.experience.trim().length > 0;

    // Determine performance tier for scoring hints
    let scoreTier = '';
    if (hasScore) {
      if (scoreNum < 40) scoreTier = 'CRITICAL (below 40%) — drastically increase foundational steps, add remedial tasks, set priority to high for weak areas';
      else if (scoreNum < 60) scoreTier = 'LOW (40-59%) — add more practice steps, revisit fundamentals, increase priority on weak topics';
      else if (scoreNum < 75) scoreTier = 'MEDIUM (60-74%) — maintain balanced revision + practice, add checkpoint quizzes';
      else if (scoreNum < 90) scoreTier = 'GOOD (75-89%) — move toward application tasks, some advanced questions, reduce basic drill steps';
      else scoreTier = 'EXCELLENT (90%+) — advance to next-level content, challenge tasks, higher-order thinking';
    }

    const SYSTEM_PROMPT = `You are an expert AI academic mentor for Indian high school students.
Your task is to update and adapt a student's learning roadmap based on their recent input.

SCORE SIGNAL: ${hasScore ? `Test score = ${scoreNum}%. Tier: ${scoreTier}` : 'No score provided.'}
MESSAGE SIGNAL: ${hasMessage ? `Student says: "${newProgress.experience}"` : 'No message provided.'}
CURRENT SUBJECT FOCUS: ${newProgress.subject || 'General'}
EXISTING ROADMAP: ${JSON.stringify(currentRoadmap || [])}
USER CONTEXT: ${JSON.stringify(userContext || {})}

INSTRUCTIONS:
- Analyze both signals (score + message) together.
- If score is low: add more foundational steps, break tasks into smaller chunks, increase priority.
- If score is high: add advanced tasks, challenge problems, next-level learning.
- If student mentions a specific struggle topic (e.g., "integration", "optics"), make that topic the first high-priority roadmap item with detailed tasks.
- Generate 3 to 5 roadmap milestones (steps), each with clear, distinct titles and real tasks.
- Each task must be 1 specific, actionable learning step (not vague).
- Set status to "in-progress" only for the first item, "pending" for the rest.
- Keep the roadmap student-friendly, motivational, and subject-specific.

OUTPUT: Return STRICT JSON — a JSON ARRAY ONLY, no wrapper object. Conform exactly to this schema per item:
[
  {
    "id": "rm_0",
    "title": "<milestone title>",
    "status": "in-progress" | "pending" | "completed",
    "priority": "high" | "medium" | "low",
    "aiAdvice": "<1-2 sentence mentor tip for this milestone>",
    "tasks": [
      { "id": "t_0_0", "desc": "<specific task description>", "completed": false }
    ]
  }
]`;

    const result = await model.generateContent(SYSTEM_PROMPT);
    const rawText = result.response.text().trim();

    // Safely parse — strip any accidental markdown fences
    const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    const parsedRoadmap = JSON.parse(cleanJson);

    if (!Array.isArray(parsedRoadmap)) {
      return res.status(500).json({ error: 'AI returned invalid roadmap format. Please try again.' });
    }

    res.status(200).json({ roadmap: parsedRoadmap });
  } catch (error) {
    console.error('Error in /api/v1/roadmap/update:', error.message);
    res.status(500).json({ error: 'Failed to update roadmap. The AI service may be busy — please try again.' });
  }
});

app.post('/api/v1/roadmap/chat', async (req, res) => {
  try {
    const { message, context, history } = sanitizeData(req.body);
    if (!message) return res.status(400).json({ error: 'Message cannot be empty.' });

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: 'You are an intelligent AI mentor for students. Keep answers short, actionable, and student-friendly. Do NOT give generic answers.',
    });

    let chatHistory = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    while (chatHistory.length > 0 && chatHistory[0].role === 'model') chatHistory.shift();
    if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'user') chatHistory.pop();

    const chat = model.startChat({ history: chatHistory });
    const contextPrefix = context ? `[USER CONTEXT FOCUS: ${context.focus}] ` : '';
    const result = await chat.sendMessage(contextPrefix + message);
    
    res.status(200).json({ reply: result.response.text() });
  } catch (error) {
    console.error('Error in /api/v1/roadmap/chat:', error.message);
    res.status(500).json({ error: 'Failed to connect to the Chat system.' });
  }
});

app.post('/api/v1/career/details', async (req, res) => {
  try {
    const { career, userContext } = sanitizeData(req.body);
    if (!career) return res.status(400).json({ error: 'Career identifier is required' });

    const cacheKey = getCacheKey('career_details', career);
    if (apiCache.has(cacheKey)) {
        console.log(`[Cache Hit] Returning cached career details for ${career} to avoid API limits.`);
        return res.status(200).json(apiCache.get(cacheKey));
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const prompt = `Provide advanced career metrics for: ${career}. STRICT JSON format exactly mapping: { "overview": "", "successRate": "", "failureRate": "", "competition": "", "averageSalary": "", "growthPotential": "", "topCompanies": [], "roadmapSteps": [], "technicalSkills": [], "softSkills": [], "learningResources": [] }`;
    const result = await model.generateContent(prompt);
    const jsonOutput = JSON.parse(result.response.text());

    apiCache.set(cacheKey, jsonOutput); // Save to cache
    res.status(200).json(jsonOutput);
  } catch (error) {
    console.error('Error in /api/v1/career/details:', error.message);
    res.status(500).json({ error: 'Failed to retrieve advanced career metrics.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Secure V1 Server is actively running on port ${PORT}`);
});
