// TAB SWITCHING
document.getElementById('loginTab').addEventListener('click', () => {
    document.getElementById('loginTab').classList.add('active')
    document.getElementById('signupTab').classList.remove('active')
    document.getElementById('loginForm').classList.remove('hidden')
    document.getElementById('signupForm').classList.add('hidden')
})

document.getElementById('signupTab').addEventListener('click', () => {
    document.getElementById('signupTab').classList.add('active')
    document.getElementById('loginTab').classList.remove('active')
    document.getElementById('signupForm').classList.remove('hidden')
    document.getElementById('loginForm').classList.add('hidden')
})

// LOGIN
document.getElementById('loginBtn').addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value.trim()
    const password = document.getElementById('loginPassword').value.trim()
    const feedback = document.getElementById('feedback')

    if (!email || !password) {
        feedback.textContent = '⚠️ Please fill in all fields!'
        feedback.className = 'feedback error'
        return
    }

    const users = JSON.parse(localStorage.getItem('ca_users') || '[]')
    const user = users.find(u => u.email === email && u.password === password)

    if (user) {
        localStorage.setItem('ca_user', JSON.stringify(user))
        feedback.textContent = '✅ Login successful!'
        feedback.className = 'feedback success'
       setTimeout(() => {
    window.location.href = '../pages/gatekeeper.html'
}, 1000)
    } else {
        feedback.textContent = '❌ Invalid email or password!'
        feedback.className = 'feedback error'
    }
})

// SIGNUP
document.getElementById('signupBtn').addEventListener('click', () => {
    const username = document.getElementById('signupUsername').value.trim()
    const email = document.getElementById('signupEmail').value.trim()
    const password = document.getElementById('signupPassword').value.trim()
    const feedback = document.getElementById('feedback')

    if (!username || !email || !password) {
        feedback.textContent = '⚠️ Please fill in all fields!'
        feedback.className = 'feedback error'
        return
    }

    const users = JSON.parse(localStorage.getItem('ca_users') || '[]')
    const exists = users.find(u => u.email === email)

    if (exists) {
        feedback.textContent = '❌ Email already registered!'
        feedback.className = 'feedback error'
        return
    }

    const newUser = { username, email, password, level: 'beginner', elo: 1200 }
    users.push(newUser)
    localStorage.setItem('ca_users', JSON.stringify(users))
    localStorage.setItem('ca_user', JSON.stringify(newUser))

    feedback.textContent = '✅ Account created!'
    feedback.className = 'feedback success'
    setTimeout(() => {
        setTimeout(() => {
    window.location.href = 'assessment.html'
}, 1000)
    }, 1000)
})

document.getElementById('googleBtn').addEventListener('click', () => {
    const { shell } = require('electron')
    shell.openExternal('http://localhost:3000/auth/google')
    startPolling()
})

document.getElementById('githubBtn').addEventListener('click', () => {
    const { shell } = require('electron')
    shell.openExternal('http://localhost:3000/auth/github')
    startPolling()
})

document.getElementById('gmailBtn').addEventListener('click', () => {
    const feedback = document.getElementById('feedback')
    feedback.textContent = '🔄 Gmail login coming soon!'
    feedback.className = 'feedback'
})

// CHECK IF ALREADY LOGGED IN
const remembered = localStorage.getItem('ca_remember')
if (remembered === 'true') {
    window.location.href = 'gatekeeper.html'
}
// POLLING — checks backend every second for logged in user
function startPolling() {
    const feedback = document.getElementById('feedback')
    feedback.textContent = '🔄 Waiting for login...'
    feedback.className = 'feedback'

    const interval = setInterval(async () => {
        try {
            const response = await fetch('http://localhost:3000/auth/pending')
            const data = await response.json()

            if (data && data.user) {
                clearInterval(interval)
                
                // Save user to localStorage
                localStorage.setItem('ca_user', JSON.stringify(data.user))
                localStorage.setItem('ca_token', data.token)

                feedback.textContent = '✅ Login successful!'
                feedback.className = 'feedback success'

                setTimeout(() => {
                    window.location.href = '../pages/gatekeeper.html'
                }, 1000)
            }
        } catch (err) {
            console.log('Polling error:', err)
        }
    }, 1000) // check every second

    // Stop polling after 2 minutes
    setTimeout(() => {
        clearInterval(interval)
        feedback.textContent = '❌ Login timed out. Try again!'
        feedback.className = 'feedback error'
    }, 120000)
}