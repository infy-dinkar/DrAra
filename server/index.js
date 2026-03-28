import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { sql, initDb } from './db.js';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Initialize Database
initDb().catch(console.error);

// ------------------- Authentication -------------------

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    const existingUsers = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existingUsers.length > 0) return res.status(400).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id, name, email
    `;
    res.status(201).json({ success: true, user: newUser[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      path: '/'
    });

    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/me', (req, res) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ user: decoded });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('auth_token');
    res.json({ success: true });
});

// ------------------- Simli Integration -------------------

app.post('/api/simli/token', async (req, res) => {
    const SIMLI_API_KEY = process.env.SIMLI_API_KEY;
    const FACE_ID = process.env.NEXT_PUBLIC_SIMLI_FACE_ID;
    
    console.log('Simli Token Request Received. FaceID:', FACE_ID);

    if (!SIMLI_API_KEY) return res.status(500).json({ error: 'SIMLI_API_KEY missing' });

    try {
        const response = await fetch("https://api.simli.ai/compose/token", {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-simli-api-key": SIMLI_API_KEY },
            body: JSON.stringify({ faceId: FACE_ID, handleSilence: true, maxSessionLength: 3600, maxIdleTime: 300, model: "fasttalk" }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error('Simli API Token Error:', data);
            return res.status(response.status).json({ error: data.message || 'Simli API Error' });
        }

        console.log('Simli Token Generated Successfully:', data.session_token?.substring(0, 10) + '...');

        const iceResponse = await fetch("https://api.simli.ai/compose/ice", {
            method: "GET",
            headers: { "x-simli-api-key": SIMLI_API_KEY }
        });
        
        const iceServers = iceResponse.ok ? await iceResponse.json() : [{ urls: ["stun:stun.l.google.com:19302"] }];
        res.json({ sessionToken: data.session_token, iceServers });
    } catch (err) {
      console.error('Token fetch failed:', err);
      res.status(500).json({ error: err.message });
    }
});

// ------------------- TTS Proxy -------------------

app.post('/api/tts', async (req, res) => {
    const { text, lang = 'en' } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });

    try {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const buffer = Buffer.from(await response.arrayBuffer());
        res.set('Content-Type', 'audio/mpeg');
        res.send(buffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
