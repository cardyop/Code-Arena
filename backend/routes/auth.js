let pendingUser = null
const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

// GOOGLE AUTH
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/auth/failed'
}), (req, res) => {
    const token = jwt.sign(req.user, process.env.JWT_SECRET, { expiresIn: '7d' })
    pendingUser = { user: req.user, token }
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
    const token = jwt.sign(req.user, process.env.JWT_SECRET, { expiresIn: '7d' })
    pendingUser = { user: req.user, token }
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

module.exports = router