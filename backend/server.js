require('dotenv').config()
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const cors = require('cors')
const authRoutes = require('./routes/auth')

require('./config/passport')

const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use('/auth', authRoutes)

app.get('/', (req, res) => {
    res.json({ message: 'CodeArena Backend Running!' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})