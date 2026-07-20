let pendingUser = null
const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const userDB = require('../database')

// GOOGLE AUTH
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/auth/failed'
}), (req, res) => {
    // Save to SQLite
    let dbUser = userDB.getUserByEmail(req.user.email)
    if (!dbUser) {
        userDB.createUser({
            username: req.user.username || req.user.displayName,
            email: req.user.email,
            avatar: req.user.avatar,
            provider: 'google',
            level: 'beginner',
            elo: 1200,
            assessmentDone: false
        })
        dbUser = userDB.getUserByEmail(req.user.email)
    }
    const token = jwt.sign(dbUser, process.env.JWT_SECRET, { expiresIn: '7d' })
    pendingUser = { user: dbUser, token }
    res.send(`
        <html><body>
        <script>window.close()</script>
        <h2>✅ Login successful! You can close this window.</h2>
        </body></html>
    `)
})

// GITHUB AUTH
router.get('/github', passport.authenticate('github', {
    scope: ['user:email']
}))

router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/auth/failed'
}), (req, res) => {
    // Save to SQLite
    let dbUser = userDB.getUserByEmail(req.user.email)
    if (!dbUser) {
        userDB.createUser({
            username: req.user.username,
            email: req.user.email,
            avatar: req.user.avatar,
            provider: 'github',
            level: 'beginner',
            elo: 1200,
            assessmentDone: false
        })
        dbUser = userDB.getUserByEmail(req.user.email)
    }
    const token = jwt.sign(dbUser, process.env.JWT_SECRET, { expiresIn: '7d' })
    pendingUser = { user: dbUser, token }
    res.send(`
        <html><body>
        <script>window.close()</script>
        <h2>✅ Login successful! You can close this window.</h2>
        </body></html>
    `)
})

// FAILED
router.get('/failed', (req, res) => {
    res.json({ error: 'Authentication failed' })
})

// GET CURRENT USER
router.get('/user', (req, res) => {
    if (req.user) {
        res.json(req.user)
    } else {
        res.json({ error: 'Not logged in' })
    }
})

// POLLING ROUTE
router.get('/pending', (req, res) => {
    if (pendingUser) {
        const data = pendingUser
        pendingUser = null
        res.json(data)
    } else {
        res.json(null)
    }
})

// LOGOUT
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.json({ message: 'Logged out' })
    })
})

// REGISTER LOCAL USER
router.post('/register', express.json(), (req, res) => {
    const { username, email, password, level, elo } = req.body
    try {
        const existing = userDB.getUserByEmail(email)
        if (existing) {
            return res.json({ success: false, message: 'User already exists' })
        }
        userDB.createUser({ username, email, password, level, elo, assessmentDone: false })
        res.json({ success: true })
    } catch (err) {
        res.json({ success: false, error: err.message })
    }
})

module.exports = router