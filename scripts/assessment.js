const TOTAL_QUESTIONS = 10
const LEVELS = [
    { name: 'beginner', label: '🟢 Beginner', count: 3 },
    { name: 'intermediate', label: '🟡 Intermediate', count: 3 },
    { name: 'advanced', label: '🔴 Advanced', count: 3 },
    { name: 'expert', label: '🏆 Expert', count: 1 }
]

let currentQuestionIndex = 0
let currentQuestion = null
let selectedOption = null
let scores = { beginner: 0, intermediate: 0, advanced: 0, expert: 0 }
let answers = []

// Get level for current question index
function getLevelForIndex(index) {
    if (index < 3) return 'beginner'
    if (index < 6) return 'intermediate'
    if (index < 9) return 'advanced'
    return 'expert'
}

// Update header level indicator
function updateLevelIndicator(level) {
    const labels = {
        beginner: '🟢 Beginner',
        intermediate: '🟡 Intermediate',
        advanced: '🔴 Advanced',
        expert: '🏆 Expert'
    }
    document.getElementById('levelIndicator').textContent = labels[level]

    const colors = {
        beginner: '#22C55E',
        intermediate: '#EAB308',
        advanced: '#EF4444',
        expert: '#8B5CF6'
    }
    document.getElementById('difficultyBadge').textContent = labels[level]
    document.getElementById('difficultyBadge').style.color = colors[level]
}

// Update progress bar
function updateProgress() {
    const percent = (currentQuestionIndex / TOTAL_QUESTIONS) * 100
    document.getElementById('progressFill').style.width = percent + '%'
    document.getElementById('progressText').textContent = 
        `Question ${currentQuestionIndex + 1} of ${TOTAL_QUESTIONS}`
}

// Show loading screen
function showLoading() {
    document.getElementById('loadingScreen').classList.remove('hidden')
    document.getElementById('questionScreen').classList.add('hidden')
}

// Show question screen
function showQuestion() {
    document.getElementById('loadingScreen').classList.add('hidden')
    document.getElementById('questionScreen').classList.remove('hidden')
}

// Load question from Groq AI
async function loadQuestion() {
    showLoading()
    selectedOption = null

    const level = getLevelForIndex(currentQuestionIndex)
    updateLevelIndicator(level)
    updateProgress()

    try {
        const q = await generateQuestion(level)
        currentQuestion = q

        document.getElementById('questionText').textContent = q.question
        document.getElementById('optA').textContent = q.options[0]
        document.getElementById('optB').textContent = q.options[1]
        document.getElementById('optC').textContent = q.options[2]
        document.getElementById('optD').textContent = q.options[3]

        // Reset options
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected', 'correct', 'wrong')
        })

        document.getElementById('feedback').textContent = ''
        document.getElementById('feedback').className = 'feedback'
        document.getElementById('nextBtn').classList.add('hidden')

        showQuestion()

    } catch (err) {
        console.log('Error loading question:', err)
        // Retry after 2 seconds
        setTimeout(loadQuestion, 2000)
    }
}

// Handle option click
document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function() {
        if (document.getElementById('nextBtn').classList.contains('hidden') === false) return

        document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'))
        this.classList.add('selected')
        selectedOption = this.getAttribute('data-option')

        // Check answer
        const correct = currentQuestion.correct
        const level = getLevelForIndex(currentQuestionIndex)
        const feedback = document.getElementById('feedback')

        if (selectedOption === correct) {
            this.classList.add('correct')
            feedback.textContent = '✅ Correct!'
            feedback.className = 'feedback success'
            scores[level]++
        } else {
            this.classList.add('wrong')
            document.querySelector(`[data-option="${correct}"]`).classList.add('correct')
            feedback.textContent = '❌ Wrong! The correct answer was ' + correct
            feedback.className = 'feedback error'
        }

        answers.push({ level, correct: selectedOption === correct })
        document.getElementById('nextBtn').classList.remove('hidden')
    })
})

// Next question
document.getElementById('nextBtn').addEventListener('click', () => {
    currentQuestionIndex++

    if (currentQuestionIndex >= TOTAL_QUESTIONS) {
        showResult()
    } else {
        loadQuestion()
    }
})

// Show result
function showResult() {
    document.getElementById('questionScreen').classList.add('hidden')
    document.getElementById('loadingScreen').classList.add('hidden')
    document.getElementById('resultScreen').classList.remove('hidden')

    const total = scores.beginner + scores.intermediate + scores.advanced + scores.expert

    // Determine level
    let finalLevel = 'beginner'
    let icon = '🟢'
    let desc = ''

    if (scores.expert >= 1 && scores.advanced >= 2) {
        finalLevel = 'expert'
        icon = '🏆'
        desc = 'Incredible! You have mastered coding. You will face the hardest challenges!'
    } else if (scores.advanced >= 2) {
        finalLevel = 'advanced'
        icon = '🔴'
        desc = 'Impressive! You have strong coding skills. Advanced challenges await!'
    } else if (scores.intermediate >= 2) {
        finalLevel = 'intermediate'
        icon = '🟡'
        desc = 'Good work! You know the basics well. Time to level up your skills!'
    } else {
        finalLevel = 'beginner'
        icon = '🟢'
        desc = 'Welcome! Everyone starts somewhere. We will guide you from zero to hero!'
    }

    document.getElementById('resultIcon').textContent = icon
    document.getElementById('resultLevel').textContent = 
        finalLevel === 'beginner' ? '🟢 Beginner' :
        finalLevel === 'intermediate' ? '🟡 Intermediate' :
        finalLevel === 'advanced' ? '🔴 Advanced' : '🏆 Expert'
    document.getElementById('resultDesc').textContent = desc
    document.getElementById('scoreNumber').textContent = `${total}/10`
    document.getElementById('beginnerScore').textContent = `${scores.beginner}/3`
    document.getElementById('intermediateScore').textContent = `${scores.intermediate}/3`
    document.getElementById('advancedScore').textContent = `${scores.advanced}/3`
    document.getElementById('expertScore').textContent = `${scores.expert}/1`

    // Save level to user profile
    const user = JSON.parse(localStorage.getItem('ca_user') || 'null')
    if (user) {
        user.level = finalLevel
        user.assessmentDone = true
        localStorage.setItem('ca_user', JSON.stringify(user))

        // Update in users array too
        const users = JSON.parse(localStorage.getItem('ca_users') || '[]')
        const index = users.findIndex(u => u.email === user.email)
        if (index !== -1) {
            users[index].level = finalLevel
            users[index].assessmentDone = true
            localStorage.setItem('ca_users', JSON.stringify(users))
        }
    }
}

// Start CodeArena button
document.getElementById('startBtn').addEventListener('click', () => {
    window.location.href = 'gatekeeper.html'
})

// Start assessment
loadQuestion()