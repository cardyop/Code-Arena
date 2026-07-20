const Database = require('better-sqlite3')
const path = require('path')

const db = new Database(path.join(__dirname, 'codearena.db'))

// Create users table
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        avatar TEXT,
        provider TEXT DEFAULT 'local',
        level TEXT DEFAULT 'beginner',
        elo INTEGER DEFAULT 1200,
        assessment_done INTEGER DEFAULT 0,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
`)

// User functions
const userDB = {
    // Create new user
    createUser(user) {
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO users (username, email, password, avatar, provider, level, elo, assessment_done)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `)
        return stmt.run(
            user.username,
            user.email,
            user.password || null,
            user.avatar || null,
            user.provider || 'local',
            user.level || 'beginner',
            user.elo || 1200,
            user.assessmentDone ? 1 : 0
        )
    },

    // Get user by email
    getUserByEmail(email) {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?')
        return stmt.get(email)
    },

    // Update user level after assessment
    updateLevel(email, level) {
        const stmt = db.prepare('UPDATE users SET level = ?, assessment_done = 1 WHERE email = ?')
        return stmt.run(level, email)
    },

    // Update ELO
    updateElo(email, elo, won) {
        const stmt = db.prepare(`
            UPDATE users SET 
            elo = ?,
            wins = wins + ?,
            losses = losses + ?
            WHERE email = ?
        `)
        return stmt.run(elo, won ? 1 : 0, won ? 0 : 1, email)
    },

    // Get all users (leaderboard)
    getLeaderboard() {
        const stmt = db.prepare('SELECT username, elo, wins, losses, level FROM users ORDER BY elo DESC LIMIT 100')
        return stmt.all()
    }
}

module.exports = userDB
