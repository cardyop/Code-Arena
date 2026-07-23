CodeArena is a desktop coding learning platform built with Electron that combines a VS Code-style editor, AI-powered teaching, and competitive 1v1 coding battles — designed so every coder who uses it never forgets what they learn.

✨ Features
🔐 GateKeeper

The app won't open until you answer an AI-generated coding question correctly. Every session starts with your brain, not your mouse. Questions are generated fresh every time using Groq AI (Llama 3.1).

🎓 Smart Assessment

On first signup, the app asks 10 AI-generated MCQ questions that get progressively harder to detect your exact coding level. Beginner → Intermediate → Advanced → Expert.

🏠 Home Dashboard

Dashboard showing recent projects, quick actions and navigation to all features.

💻 Code Editor

A VS Code-inspired editor with file explorer, output panel, language selector and project management.

⚔️ 1v1 PVP Battle System

Real-time coding battles with ELO ranking system. Win → gain ELO. Lose → lose ELO. Match history and stats saved locally.

🏆 ELO Leaderboard

Rank tiers from 🥉 Bronze → 🥈 Silver → 🥇 Gold → 💎 Diamond → 👑 Grandmaster.

🔐 Authentication
Email/Password login and signup
Google OAuth
GitHub OAuth
Remember me functionality
🛠️ Tech Stack
Layer	Technology
Desktop UI	Electron + HTML/CSS/JS
AI Questions	Groq API (Llama 3.1)
Auth Backend	Express + Passport.js
OAuth	Google + GitHub OAuth2
Database	SQLite (better-sqlite3)
Local Storage	localStorage via db.js
Backend	Node.js + Express
🗂️ Project Structure
codearena/
├── pages/          # HTML pages
├── scripts/        # JavaScript files
├── styles/         # CSS files
├── backend/        # Express server + OAuth + SQLite
├── index.js        # Electron main process
└── package.json
🗺️ Roadmap
 Auth page (Login/Signup + OAuth)
 GateKeeper with AI questions
 Smart Assessment (10 AI questions)
 Home dashboard
 Code Editor
 PVP Lobby + Battle UI
 ELO system
 SQLite database
 Python compiler integration
 AI Teaching System
 AI Socratic Mentor in editor
 Pop-up Challenges (15min/1hr)
 Real-time PVP backend (WebSockets)
 Monaco Editor integration
 Global ELO Leaderboard
🚀 Getting Started
bash
git clone https://github.com/cardyop/Code-Arena.git
cd Code-Arena
npm install
cd backend
npm install
cd ..

Create backend/.env:

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
SESSION_SECRET=codearena-secret-key
JWT_SECRET=codearena-jwt-secret
PORT=3000

Create scripts/groq-ai.js:

javascript
const Groq = require('groq-sdk')

const groq = new Groq({
    apiKey: 'your-groq-api-key',
    dangerouslyAllowBrowser: true
})

async function generateQuestion(level = 'beginner') {
    try {
        const response = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                {
                    role: 'system',
                    content: 'You are a coding quiz generator. Respond with valid JSON only.'
                },
                {
                    role: 'user',
                    content: `Generate a ${level} coding MCQ. Use this exact format: {"question":"question here","options":["A option","B option","C option","D option"],"correct":"A","difficulty":"${level}"}`
                }
            ],
            max_tokens: 200,
            temperature: 0.5
        })
        const text = response.choices[0].message.content.trim()
        const cleaned = text.replace(/[\n\r]/g, ' ').trim()
        return JSON.parse(cleaned)
    } catch (err) {
        console.log('Groq error:', err)
        return null
    }
}

Run the backend:

bash
cd backend
node server.js

Run the app:

bash
npx electron .
⚠️ Important Notes
scripts/groq-ai.js is not included in the repo — create it manually with your Groq API key
backend/.env is not included — create it with your OAuth credentials
Backend must be running for Google/GitHub login to work
👨‍💻 Author

Built by @cardyop

CodeArena — Learn. Compete. Never Forget. 🏆
