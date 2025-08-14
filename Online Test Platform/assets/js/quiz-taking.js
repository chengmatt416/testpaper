// SecureTest - Quiz Taking JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize quiz functionality
    initQuizTaking();
    
    // Initialize timer
    initTimer();
    
    // Initialize navigation
    initQuizNavigation();
    
    // Initialize submit modal
    initSubmitModal();
    
    // Initialize anti-cheat for quiz
    initQuizAntiCheat();
});

// Quiz data and state
let quizData = {
    currentQuestion: 0,
    totalQuestions: 10,
    timeRemaining: 30 * 60, // 30 minutes in seconds
    answers: {},
    flagged: new Set(),
    started: false,
    submitted: false
};

// Sample quiz questions
const sampleQuestions = [
    {
        id: 1,
        question: "Solve for x in the equation: 2x + 5 = 15",
        type: "multiple-choice",
        options: [
            { value: "A", text: "x = 5" },
            { value: "B", text: "x = 10" },
            { value: "C", text: "x = -5" },
            { value: "D", text: "x = 7" }
        ],
        correct: "A"
    },
    {
        id: 2,
        question: "What is the derivative of f(x) = x²?",
        type: "multiple-choice",
        options: [
            { value: "A", text: "2x" },
            { value: "B", text: "x" },
            { value: "C", text: "2x²" },
            { value: "D", text: "x²/2" }
        ],
        correct: "A"
    },
    {
        id: 3,
        question: "Which of the following is a prime number?",
        type: "multiple-choice",
        options: [
            { value: "A", text: "15" },
            { value: "B", text: "17" },
            { value: "C", text: "21" },
            { value: "D", text: "25" }
        ],
        correct: "B"
    }
    // Add more questions as needed
];

// Initialize quiz taking functionality
function initQuizTaking() {
    // Generate full quiz with sample questions
    generateFullQuiz();
    
    // Load first question
    loadQuestion(0);
    
    // Start quiz
    quizData.started = true;
    
    // Initialize answer tracking
    initAnswerTracking();
    
    // Update question counter
    updateQuestionCounter();
    
    // Update progress bar
    updateProgressBar();
}

function generateFullQuiz() {
    // Generate 10 questions using the sample questions
    const fullQuiz = [];
    for (let i = 0; i < 10; i++) {
        const baseQuestion = sampleQuestions[i % sampleQuestions.length];
        fullQuiz.push({
            ...baseQuestion,
            id: i + 1,
            question: `Question ${i + 1}: ${baseQuestion.question}`
        });
    }
    quizData.questions = fullQuiz;
}

// Load and display a question
function loadQuestion(questionIndex) {
    const question = quizData.questions[questionIndex];
    if (!question) return;
    
    quizData.currentQuestion = questionIndex;
    
    // Update question display
    document.querySelector('.question-number').textContent = `Question ${questionIndex + 1}`;
    document.querySelector('.question-text h2').textContent = question.question;
    
    // Load options
    const optionsContainer = document.querySelector('.multiple-choice-options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        
        const isChecked = quizData.answers[question.id] === option.value ? 'checked' : '';
        
        optionDiv.innerHTML = `
            <input type="radio" id="option${index + 1}" name="answer" value="${option.value}" ${isChecked}>
            <label for="option${index + 1}">${option.text}</label>
        `;
        
        optionsContainer.appendChild(optionDiv);
    });
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update flag status
    updateFlagStatus();
    
    // Update progress
    updateProgressBar();
    updateQuestionCounter();
}

// Initialize answer tracking
function initAnswerTracking() {
    document.addEventListener('change', function(e) {
        if (e.target.name === 'answer') {
            const questionId = quizData.questions[quizData.currentQuestion].id;
            quizData.answers[questionId] = e.target.value;
            updateQuizStatus();
            updateNavigationButtons();
        }
    });
    
    // Flag question functionality
    const flagCheckbox = document.getElementById('flagQuestion');
    if (flagCheckbox) {
        flagCheckbox.addEventListener('change', function() {
            const questionId = quizData.questions[quizData.currentQuestion].id;
            if (this.checked) {
                quizData.flagged.add(questionId);
            } else {
                quizData.flagged.delete(questionId);
            }
            updateQuizStatus();
            updateNavigationButtons();
        });
    }
}

// Initialize quiz navigation
function initQuizNavigation() {
    const prevBtn = document.getElementById('prevQuestionBtn');
    const nextBtn = document.getElementById('nextQuestionBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (quizData.currentQuestion > 0) {
                loadQuestion(quizData.currentQuestion - 1);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (quizData.currentQuestion < quizData.totalQuestions - 1) {
                loadQuestion(quizData.currentQuestion + 1);
            }
        });
    }
    
    // Navigation buttons for direct question access
    initDirectNavigation();
}

function initDirectNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            loadQuestion(index);
        });
    });
}

// Update navigation button states
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevQuestionBtn');
    const nextBtn = document.getElementById('nextQuestionBtn');
    
    if (prevBtn) {
        prevBtn.disabled = quizData.currentQuestion === 0;
    }
    
    if (nextBtn) {
        if (quizData.currentQuestion === quizData.totalQuestions - 1) {
            nextBtn.innerHTML = 'Finish <i class="fas fa-flag-checkered"></i>';
        } else {
            nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
        }
    }
    
    // Update direct navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach((btn, index) => {
        btn.classList.remove('current', 'answered', 'flagged');
        
        const questionId = index + 1;
        
        if (index === quizData.currentQuestion) {
            btn.classList.add('current');
        } else if (quizData.answers[questionId]) {
            btn.classList.add('answered');
        }
        
        if (quizData.flagged.has(questionId)) {
            btn.classList.add('flagged');
        }
    });
}

// Update flag status
function updateFlagStatus() {
    const flagCheckbox = document.getElementById('flagQuestion');
    const questionId = quizData.questions[quizData.currentQuestion].id;
    
    if (flagCheckbox) {
        flagCheckbox.checked = quizData.flagged.has(questionId);
    }
}

// Update progress bar and counters
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progress = ((quizData.currentQuestion + 1) / quizData.totalQuestions) * 100;
    
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

function updateQuestionCounter() {
    const currentQuestionEl = document.getElementById('currentQuestion');
    const totalQuestionsEl = document.getElementById('totalQuestions');
    
    if (currentQuestionEl) {
        currentQuestionEl.textContent = quizData.currentQuestion + 1;
    }
    if (totalQuestionsEl) {
        totalQuestionsEl.textContent = quizData.totalQuestions;
    }
}

// Update quiz status
function updateQuizStatus() {
    const answeredCount = Object.keys(quizData.answers).length;
    const unansweredCount = quizData.totalQuestions - answeredCount;
    const flaggedCount = quizData.flagged.size;
    
    // Update status display
    const answeredEl = document.getElementById('answeredCount');
    const unansweredEl = document.getElementById('unansweredCount');
    const flaggedEl = document.getElementById('flaggedCount');
    
    if (answeredEl) answeredEl.textContent = answeredCount;
    if (unansweredEl) unansweredEl.textContent = unansweredCount;
    if (flaggedEl) flaggedEl.textContent = flaggedCount;
    
    // Update modal display
    const modalAnsweredEl = document.getElementById('modalAnsweredCount');
    const modalUnansweredEl = document.getElementById('modalUnansweredCount');
    const modalFlaggedEl = document.getElementById('modalFlaggedCount');
    
    if (modalAnsweredEl) modalAnsweredEl.textContent = answeredCount;
    if (modalUnansweredEl) modalUnansweredEl.textContent = unansweredCount;
    if (modalFlaggedEl) modalFlaggedEl.textContent = flaggedCount;
}

// Initialize timer
function initTimer() {
    updateTimerDisplay();
    
    const timer = setInterval(function() {
        if (quizData.timeRemaining > 0 && !quizData.submitted) {
            quizData.timeRemaining--;
            updateTimerDisplay();
        } else {
            clearInterval(timer);
            if (!quizData.submitted) {
                autoSubmitQuiz();
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(quizData.timeRemaining / 60);
    const seconds = quizData.timeRemaining % 60;
    
    const timerMinutes = document.getElementById('timerMinutes');
    const timerSeconds = document.getElementById('timerSeconds');
    
    if (timerMinutes) {
        timerMinutes.textContent = minutes.toString().padStart(2, '0');
    }
    if (timerSeconds) {
        timerSeconds.textContent = seconds.toString().padStart(2, '0');
    }
    
    // Change color when time is running low
    const timerDisplay = document.querySelector('.timer-display');
    if (timerDisplay) {
        if (quizData.timeRemaining < 300) { // Less than 5 minutes
            timerDisplay.style.color = '#dc3545';
        } else if (quizData.timeRemaining < 600) { // Less than 10 minutes
            timerDisplay.style.color = '#ffc107';
        }
    }
}

// Initialize submit modal
function initSubmitModal() {
    const submitBtn = document.getElementById('submitQuizBtn');
    const modal = document.getElementById('submitConfirmModal');
    const confirmBtn = document.getElementById('confirmSubmitBtn');
    const cancelBtn = document.getElementById('cancelSubmitBtn');
    const closeBtn = document.querySelector('.close-modal');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            updateQuizStatus();
            showModal(modal);
        });
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            submitQuiz();
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            hideModal(modal);
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            hideModal(modal);
        });
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideModal(modal);
            }
        });
    }
}

function showModal(modal) {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Submit quiz
function submitQuiz() {
    quizData.submitted = true;
    
    // Calculate score (demo)
    let score = 0;
    let totalQuestions = 0;
    
    quizData.questions.forEach(question => {
        totalQuestions++;
        if (quizData.answers[question.id] === question.correct) {
            score++;
        }
    });
    
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Show loading state
    const confirmBtn = document.getElementById('confirmSubmitBtn');
    if (confirmBtn) {
        confirmBtn.textContent = 'Submitting...';
        confirmBtn.disabled = true;
    }
    
    // Simulate submission
    setTimeout(function() {
        alert(`Quiz submitted successfully!\n\nYour Score: ${score}/${totalQuestions} (${percentage}%)`);
        
        // Redirect to results page (or back to dashboard)
        window.location.href = '../../index.html';
    }, 2000);
}

function autoSubmitQuiz() {
    alert('Time\'s up! Your quiz will be automatically submitted.');
    submitQuiz();
}

// Initialize quiz-specific anti-cheat measures
function initQuizAntiCheat() {
    let suspiciousActivityCount = 0;
    const maxSuspiciousActivity = 5;
    
    // Disable text selection
    document.body.style.userSelect = 'none';
    
    // Detect copy attempts
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        suspiciousActivityCount++;
        showAntiCheatWarning('Copy attempt detected');
        
        if (suspiciousActivityCount >= maxSuspiciousActivity) {
            autoSubmitQuiz();
        }
    });
    
    // Detect paste attempts
    document.addEventListener('paste', function(e) {
        e.preventDefault();
        suspiciousActivityCount++;
        showAntiCheatWarning('Paste attempt detected');
        
        if (suspiciousActivityCount >= maxSuspiciousActivity) {
            autoSubmitQuiz();
        }
    });
    
    // Track tab visibility
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            suspiciousActivityCount++;
            showAntiCheatWarning('Tab switch detected');
            
            if (suspiciousActivityCount >= maxSuspiciousActivity) {
                autoSubmitQuiz();
            }
        }
    });
}

function showAntiCheatWarning(message) {
    const overlay = document.getElementById('antiCheatOverlay');
    if (overlay) {
        overlay.querySelector('p').textContent = `Warning: ${message}. This incident will be reported.`;
        overlay.classList.add('active');
        
        setTimeout(function() {
            overlay.classList.remove('active');
        }, 3000);
    }
}

// Prevent right-click and keyboard shortcuts
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+A, Ctrl+C, Ctrl+V
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'a' || e.key === 'c' || e.key === 'v'))) {
        e.preventDefault();
        showAntiCheatWarning('Keyboard shortcut blocked');
    }
});