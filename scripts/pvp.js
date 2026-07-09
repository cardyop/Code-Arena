let timerInterval = null
let timeLeft = 1800 // 30 minutes in seconds
let matchHistory = []

// SCREEN SWITCHING
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'))
    document.getElementById(screenId).classList.remove('hidden')
}

// TIMER
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--
        const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0')
        const secs = (timeLeft % 60).toString().padStart(2, '0')
        document.getElementById('timer').textContent = `${mins}:${secs}`

        if (timeLeft <= 0) {
            clearInterval(timerInterval)
            showResult(false)
        }
    }, 1000)
}

// MATCHMAKING → BATTLE
setTimeout(() => {
    document.getElementById('opponentName').textContent = 'CoderX'
    showScreen('battleScreen')
    startTimer()
}, 3000) // simulates finding opponent after 3 seconds

// CANCEL MATCHMAKING
document.getElementById('cancelBtn').addEventListener('click', () => {
    window.location.href = '../pages/pvp_lobby.html'
})

// LEAVE MATCH
document.getElementById('leaveBtn').addEventListener('click', () => {
    clearInterval(timerInterval)
    window.location.href = '../pages/pvp_lobby.html'
})

// SUBMIT CODE
document.getElementById('submitBtn').addEventListener('click', () => {
    clearInterval(timerInterval)
    showResult(true)
})

// SHOW RESULT
function showResult(won) {
    showScreen('resultScreen')
    
    const opponent = document.getElementById('opponentName').textContent
    const timeUsed = 1800 - timeLeft
    const mins = Math.floor(timeUsed / 60).toString().padStart(2, '0')
    const secs = (timeUsed % 60).toString().padStart(2, '0')
    const timeTaken = `${mins}:${secs}`

    const speedScore = Math.floor(Math.random() * 40 + 60)
    const complexityScore = Math.floor(Math.random() * 40 + 60)
    const qualityScore = Math.floor(Math.random() * 40 + 60)

    if (won) {
        document.getElementById('resultIcon').textContent = '🏆'
        document.getElementById('resultTitle').textContent = 'You Won!'
        document.getElementById('eloChange').textContent = '+25 ELO'
        document.getElementById('eloChange').style.color = '#22C55E'
    } else {
        document.getElementById('resultIcon').textContent = '💀'
        document.getElementById('resultTitle').textContent = 'You Lost!'
        document.getElementById('eloChange').textContent = '-20 ELO'
        document.getElementById('eloChange').style.color = '#EF4444'
    }

    document.getElementById('speedScore').textContent = speedScore
    document.getElementById('complexityScore').textContent = complexityScore
    document.getElementById('qualityScore').textContent = qualityScore

    // Save to localStorage
    const history = JSON.parse(localStorage.getItem('pvp_history') || '[]')
    history.unshift({
        opponent: opponent,
        result: won ? 'win' : 'loss',
        time: timeTaken,
        speed: speedScore,
        complexity: complexityScore,
        quality: qualityScore,
        date: new Date().toLocaleDateString()
    })
    localStorage.setItem('pvp_history', JSON.stringify(history))

    // Update ELO
    let elo = parseInt(localStorage.getItem('pvp_elo') || '1200')
    elo = won ? elo + 25 : elo - 20
    localStorage.setItem('pvp_elo', elo)

    // Update wins/losses
    let wins = parseInt(localStorage.getItem('pvp_wins') || '0')
    let losses = parseInt(localStorage.getItem('pvp_losses') || '0')
    if (won) wins++ 
    else losses++
    localStorage.setItem('pvp_wins', wins)
    localStorage.setItem('pvp_losses', losses)

    // Update best time
    const bestTime = localStorage.getItem('pvp_best_time')
    if (won && (!bestTime || timeTaken < bestTime)) {
        localStorage.setItem('pvp_best_time', timeTaken)
    }
}

// PLAY AGAIN
document.getElementById('playAgainBtn').addEventListener('click', () => {
    timeLeft = 1800
    showScreen('matchmakingScreen')
    setTimeout(() => {
        showScreen('battleScreen')
        startTimer()
    }, 3000)
})

// BACK TO LOBBY
document.getElementById('homeBtn').addEventListener('click', () => {
    window.location.href = '../pages/pvp_lobby.html'
})

// RUN CODE (simulated)
document.getElementById('runBtn').addEventListener('click', () => {
    document.getElementById('outputBox').innerHTML = 
        '<span style="color:#22C55E">✅ Code ran successfully!</span>'
})