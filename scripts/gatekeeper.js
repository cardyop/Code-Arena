// Sample questions pool
const questions = [
    {
        question: "What does a loop do in programming?",
        options: [
            "It stores data in memory",
            "It repeats a block of code multiple times",
            "It connects to the internet",
            "It deletes files from disk"
        ],
        correct: "B",
        difficulty: "Easy"
    },
    {
        question: "What is a variable in coding?",
        options: [
            "A type of loop",
            "A function that runs code",
            "A container that stores data",
            "A way to connect to internet"
        ],
        correct: "C",
        difficulty: "Easy"
    },
    {
        question: "What does an IF statement do?",
        options: [
            "Repeats code forever",
            "Makes a decision based on a condition",
            "Stores a number",
            "Deletes a variable"
        ],
        correct: "B",
        difficulty: "Easy"
    },
    {
        question: "What is a function in programming?",
        options: [
            "A bug in the code",
            "A type of variable",
            "A reusable block of code",
            "A way to style text"
        ],
        correct: "C",
        difficulty: "Medium"
    }
];

let currentQuestion = 0;
let selectedOption = null;

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

// Load question
function loadQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('questionText').textContent = q.question;
    document.getElementById('difficulty').textContent = q.difficulty;
    
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
        const letter = String.fromCharCode(65 + index); // A, B, C, D
        option.setAttribute('data-option', letter);
        option.querySelector('.option-text').textContent = q.options[index];
        option.classList.remove('selected', 'correct', 'wrong');
    });
    
    selectedOption = null;
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
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
    
    const q = questions[currentQuestion];
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

// Handle hint button
document.getElementById('hintBtn').addEventListener('click', function() {
    currentQuestion = (currentQuestion + 1) % questions.length;
    loadQuestion();
    const feedback = document.getElementById('feedback');
    feedback.textContent = '🔄 Question changed! Answer to unlock!';
    feedback.className = 'feedback';
});

// Initialize
setGreeting();
loadQuestion();