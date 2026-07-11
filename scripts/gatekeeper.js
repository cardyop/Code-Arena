let currentQuestion = null
let selectedOption = null

async function fetchQuestion() {
    try {
        const q = await generateQuestion('beginner')
        currentQuestion = q
        loadQuestion()
    } catch (err) {
        // fallback question if API fails
        currentQuestion = {
            question: "What does a loop do in programming?",
            options: [
                "It stores data in memory",
                "It repeats a block of code multiple times",
                "It connects to the internet",
                "It deletes files from disk"
            ],
            correct: "B",
            difficulty: "Easy"
        }
        loadQuestion()
    }
}

// Set greeting based on time
function setGreeting() {
    const hour = new Date().getHours();
    const greetingText = document.getElementById('greetingText');
    const timeIcon = document.getElementById('timeIcon');
    const greetingSection = document.getElementById('greetingSection');
    const questionSection = document.getElementById('questionSection');

    if (hour < 12) {
        greetingText.textContent = 'Good Morning, Coder!';
        timeIcon.textContent = '🌅';
    } else if (hour < 18) {
        greetingText.textContent = 'Good Afternoon, Coder!';
        timeIcon.textContent = '☀️';
    } else {
        greetingText.textContent = 'Good Evening, Coder!';
        timeIcon.textContent = '🌙';
    }

    // After 2 seconds, fade out greeting
    setTimeout(() => {
        greetingSection.classList.add('fade-out');

        // After fade out, hide greeting and show question
        setTimeout(() => {
            greetingSection.style.display = 'none';
            questionSection.classList.remove('hidden');
            questionSection.style.display = 'block';
            questionSection.style.opacity = '0';
            questionSection.style.transform = 'translateY(20px)';

            // Fade in question
            setTimeout(() => {
                questionSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                questionSection.style.opacity = '1';
                questionSection.style.transform = 'translateY(0)';
            }, 50);

        }, 800);

    }, 2000);
}

function loadQuestion() {
    if (!currentQuestion) return
    document.getElementById('questionText').textContent = currentQuestion.question
    document.getElementById('difficulty').textContent = currentQuestion.difficulty

    const options = document.querySelectorAll('.option')
    options.forEach((option, index) => {
        const letter = String.fromCharCode(65 + index)
        option.setAttribute('data-option', letter)
        option.querySelector('.option-text').textContent = currentQuestion.options[index]
        option.classList.remove('selected', 'correct', 'wrong')
    })

    selectedOption = null
    document.getElementById('feedback').textContent = ''
    document.getElementById('feedback').className = 'feedback'
}

// Handle option click
document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function() {
        // Remove previous selection
        document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        
        // Mark this as selected
        this.classList.add('selected');
        selectedOption = this.getAttribute('data-option');
    });
});

// Handle submit
document.getElementById('submitBtn').addEventListener('click', function() {
    if (!selectedOption) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = '⚠️ Please select an answer first!';
        feedback.className = 'feedback error';
        return;
    }
    
    const q = currentQuestion
    const selectedEl = document.querySelector(`[data-option="${selectedOption}"]`);
    const correctEl = document.querySelector(`[data-option="${q.correct}"]`);
    
    if (selectedOption === q.correct) {
        // Correct answer
        selectedEl.classList.add('correct');
        const feedback = document.getElementById('feedback');
        feedback.textContent = '✅ Correct! Welcome to CodeArena!';
        feedback.className = 'feedback success';
        
        // Redirect to home page after 1.5 seconds
        setTimeout(() => {
    document.body.style.transition = 'opacity 0.8s ease';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        window.location.href = '../pages/home_page.html';
    }, 800);
}, 1500);
    } else {
        // Wrong answer
        selectedEl.classList.add('wrong');
        correctEl.classList.add('correct');
        const feedback = document.getElementById('feedback');
        feedback.textContent = '❌ Wrong! Try again!';
        feedback.className = 'feedback error';
    }
});

document.getElementById('hintBtn').addEventListener('click', async function() {
    const feedback = document.getElementById('feedback')
    feedback.textContent = '🔄 Getting new question...'
    feedback.className = 'feedback'
    await fetchQuestion()
})

// Initialize
setGreeting()
fetchQuestion()