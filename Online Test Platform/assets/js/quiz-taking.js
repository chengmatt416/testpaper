// Quiz Taking JavaScript for SecureTest
document.addEventListener('DOMContentLoaded', function() {
    console.log('Quiz taking module loaded');
    
    // Enable test mode security
    document.body.classList.add('test-mode');
    
    initQuizInterface();
    initAntiCheatMeasures();
    initTimeTracker();
    initQuestionNavigation();
    
    // Warn before leaving the page
    window.addEventListener('beforeunload', function(e) {
        if (quizStarted && !quizCompleted) {
            const confirmationMessage = 'Are you sure you want to leave? Your quiz progress will be lost.';
            e.returnValue = confirmationMessage;
            return confirmationMessage;
        }
    });
});

// Quiz state variables
let quizStarted = false;
let quizCompleted = false;
let currentQuestionIndex = 0;
let quizData = null;
let userAnswers = {};
let timeRemaining = 0;
let timerInterval = null;
let tabSwitchCount = 0;
let suspiciousActivityCount = 0;

function initQuizInterface() {
    const startQuizBtn = document.getElementById('startQuizBtn');
    const submitQuizBtn = document.getElementById('submitQuizBtn');
    
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', startQuiz);
    }
    
    if (submitQuizBtn) {
        submitQuizBtn.addEventListener('click', submitQuiz);
    }
    
    // Load available quizzes
    loadAvailableQuizzes();
}

function loadAvailableQuizzes() {
    const quizList = document.getElementById('quizList');
    if (!quizList) return;
    
    // Mock quiz data (in a real app, this would come from an API)
    const mockQuizzes = [
        {
            id: 1,
            title: 'JavaScript Fundamentals',
            description: 'Test your knowledge of basic JavaScript concepts',
            duration: 30,
            questions: 15,
            difficulty: 'Beginner'
        },
        {
            id: 2,
            title: 'Web Security Basics',
            description: 'Understanding web application security principles',
            duration: 45,
            questions: 20,
            difficulty: 'Intermediate'
        },
        {
            id: 3,
            title: 'Database Design',
            description: 'SQL and database design concepts',
            duration: 60,
            questions: 25,
            difficulty: 'Advanced'
        }
    ];
    
    quizList.innerHTML = mockQuizzes.map(quiz => `
        <div class="quiz-card" data-quiz-id="${quiz.id}">
            <h3>${quiz.title}</h3>
            <p>${quiz.description}</p>
            <div class="quiz-details">
                <span><i class="fas fa-clock"></i> ${quiz.duration} minutes</span>
                <span><i class="fas fa-question-circle"></i> ${quiz.questions} questions</span>
                <span class="difficulty ${quiz.difficulty.toLowerCase()}"><i class="fas fa-signal"></i> ${quiz.difficulty}</span>
            </div>
            <button class="btn primary select-quiz-btn" data-quiz-id="${quiz.id}">
                Select Quiz
            </button>
        </div>
    `).join('');
    
    // Add event listeners to quiz selection buttons
    const selectButtons = quizList.querySelectorAll('.select-quiz-btn');
    selectButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const quizId = parseInt(this.dataset.quizId);
            selectQuiz(quizId);
        });
    });
}

function selectQuiz(quizId) {
    // Mock quiz selection (in a real app, this would fetch quiz data from API)
    const selectedQuiz = {
        id: quizId,
        title: 'JavaScript Fundamentals',
        duration: 30,
        questions: [
            {
                id: 1,
                type: 'multiple-choice',
                question: 'What is the correct way to declare a variable in JavaScript?',
                options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'declare x = 5;'],
                correctAnswer: 0
            },
            {
                id: 2,
                type: 'multiple-choice',
                question: 'Which method is used to add an element to the end of an array?',
                options: ['append()', 'push()', 'add()', 'insert()'],
                correctAnswer: 1
            },
            {
                id: 3,
                type: 'short-answer',
                question: 'What does DOM stand for?',
                correctAnswer: 'Document Object Model'
            }
        ]
    };
    
    quizData = selectedQuiz;
    showQuizPreview();
}

function showQuizPreview() {
    const quizSelection = document.getElementById('quizSelection');
    const quizPreview = document.getElementById('quizPreview');
    
    if (quizSelection) quizSelection.style.display = 'none';
    if (quizPreview) {
        quizPreview.style.display = 'block';
        document.getElementById('previewTitle').textContent = quizData.title;
        document.getElementById('previewDuration').textContent = `${quizData.duration} minutes`;
        document.getElementById('previewQuestions').textContent = `${quizData.questions.length} questions`;
    }
}

function startQuiz() {
    if (!quizData) {
        alert('Please select a quiz first');
        return;
    }
    
    quizStarted = true;
    timeRemaining = quizData.duration * 60; // Convert to seconds
    currentQuestionIndex = 0;
    userAnswers = {};
    
    // Hide preview and show quiz interface
    const quizPreview = document.getElementById('quizPreview');
    const quizInterface = document.getElementById('quizInterface');
    
    if (quizPreview) quizPreview.style.display = 'none';
    if (quizInterface) quizInterface.style.display = 'block';
    
    startTimer();
    showQuestion(currentQuestionIndex);
    updateProgressBar();
    
    // Log quiz start
    console.log(`Quiz started: ${quizData.title} at ${new Date().toISOString()}`);
}

function initTimeTracker() {
    // Initialize time tracking functionality
    // This function sets up the timer but doesn't start it
    // Timer is started when quiz begins in startQuiz() function
    updateTimerDisplay();
}

function startTimer() {
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            // Time's up - auto-submit quiz
            alert('Time is up! The quiz will be submitted automatically.');
            submitQuiz();
        } else if (timeRemaining <= 300) { // 5 minutes remaining
            // Show warning for last 5 minutes
            const timerElement = document.getElementById('timeRemaining');
            if (timerElement) {
                timerElement.style.color = '#e74c3c';
                timerElement.style.fontWeight = 'bold';
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('timeRemaining');
    if (timerElement) {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function showQuestion(index) {
    const question = quizData.questions[index];
    const questionContainer = document.getElementById('questionContainer');
    
    if (!questionContainer || !question) return;
    
    let questionHTML = `
        <div class="question-header">
            <h3>Question ${index + 1} of ${quizData.questions.length}</h3>
        </div>
        <div class="question-content">
            <p class="question-text">${question.question}</p>
        </div>
    `;
    
    if (question.type === 'multiple-choice') {
        questionHTML += '<div class="answer-options">';
        question.options.forEach((option, optionIndex) => {
            const checked = userAnswers[question.id] === optionIndex ? 'checked' : '';
            questionHTML += `
                <label class="option-label">
                    <input type="radio" name="question_${question.id}" value="${optionIndex}" ${checked}>
                    <span class="option-text">${option}</span>
                </label>
            `;
        });
        questionHTML += '</div>';
    } else if (question.type === 'short-answer') {
        const currentAnswer = userAnswers[question.id] || '';
        questionHTML += `
            <div class="answer-input">
                <textarea name="question_${question.id}" placeholder="Enter your answer here..." rows="4">${currentAnswer}</textarea>
            </div>
        `;
    }
    
    questionContainer.innerHTML = questionHTML;
    
    // Add event listeners for answer tracking
    const inputs = questionContainer.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.type === 'radio') {
                userAnswers[question.id] = parseInt(this.value);
            } else {
                userAnswers[question.id] = this.value;
            }
            updateProgressBar();
        });
    });
}

function updateProgressBar() {
    const answeredQuestions = Object.keys(userAnswers).length;
    const totalQuestions = quizData.questions.length;
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;
    
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    if (progressBar) {
        progressBar.style.width = `${progressPercentage}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${answeredQuestions} of ${totalQuestions} answered`;
    }
}

function initQuestionNavigation() {
    const prevBtn = document.getElementById('prevQuestionBtn');
    const nextBtn = document.getElementById('nextQuestionBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                showQuestion(currentQuestionIndex);
                updateNavigationButtons();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentQuestionIndex < quizData.questions.length - 1) {
                currentQuestionIndex++;
                showQuestion(currentQuestionIndex);
                updateNavigationButtons();
            }
        });
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevQuestionBtn');
    const nextBtn = document.getElementById('nextQuestionBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentQuestionIndex === 0;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentQuestionIndex === quizData.questions.length - 1;
    }
}

function initAntiCheatMeasures() {
    // Enhanced anti-cheat for quiz environment
    let focusLostCount = 0;
    
    // Monitor tab/window focus
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && quizStarted && !quizCompleted) {
            tabSwitchCount++;
            focusLostCount++;
            logSuspiciousActivity('Tab/window switch detected');
            
            if (focusLostCount >= 3) {
                alert('Warning: Multiple tab switches detected. This quiz may be terminated.');
            }
        }
    });
    
    // Disable right-click
    document.addEventListener('contextmenu', function(e) {
        if (quizStarted && !quizCompleted) {
            e.preventDefault();
            logSuspiciousActivity('Right-click attempt');
        }
    });
    
    // Disable text selection
    document.addEventListener('selectstart', function(e) {
        if (quizStarted && !quizCompleted) {
            e.preventDefault();
        }
    });
    
    // Monitor for developer tools
    let devToolsOpen = false;
    setInterval(() => {
        if (quizStarted && !quizCompleted) {
            const widthThreshold = window.outerWidth - window.innerWidth > 160;
            const heightThreshold = window.outerHeight - window.innerHeight > 160;
            
            if (widthThreshold || heightThreshold) {
                if (!devToolsOpen) {
                    devToolsOpen = true;
                    logSuspiciousActivity('Developer tools detected');
                    alert('Warning: Developer tools detected. This may result in quiz termination.');
                }
            } else {
                devToolsOpen = false;
            }
        }
    }, 1000);
}

function logSuspiciousActivity(activity) {
    suspiciousActivityCount++;
    const timestamp = new Date().toISOString();
    console.warn(`Suspicious activity #${suspiciousActivityCount}: ${activity} at ${timestamp}`);
    
    // In a real application, this would be sent to the server
    const activityLog = {
        userId: localStorage.getItem('userEmail'),
        quizId: quizData.id,
        activity: activity,
        timestamp: timestamp,
        questionIndex: currentQuestionIndex
    };
    
    // Store locally for now
    const existingLogs = JSON.parse(localStorage.getItem('quizActivityLogs') || '[]');
    existingLogs.push(activityLog);
    localStorage.setItem('quizActivityLogs', JSON.stringify(existingLogs));
}

function submitQuiz() {
    if (!quizStarted || quizCompleted) return;
    
    // Confirm submission
    const unansweredQuestions = quizData.questions.length - Object.keys(userAnswers).length;
    if (unansweredQuestions > 0) {
        const confirmSubmit = confirm(`You have ${unansweredQuestions} unanswered questions. Are you sure you want to submit?`);
        if (!confirmSubmit) return;
    }
    
    quizCompleted = true;
    clearInterval(timerInterval);
    
    // Calculate score
    const score = calculateScore();
    
    // Show results
    showQuizResults(score);
    
    // Log quiz completion
    console.log(`Quiz completed: ${quizData.title} at ${new Date().toISOString()}`);
    console.log(`Final score: ${score.percentage}%`);
    console.log(`Suspicious activities: ${suspiciousActivityCount}`);
}

function calculateScore() {
    let correctAnswers = 0;
    const totalQuestions = quizData.questions.length;
    
    quizData.questions.forEach(question => {
        const userAnswer = userAnswers[question.id];
        
        if (question.type === 'multiple-choice') {
            if (userAnswer === question.correctAnswer) {
                correctAnswers++;
            }
        } else if (question.type === 'short-answer') {
            // Simple text comparison (in a real app, this would be more sophisticated)
            if (userAnswer && userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
                correctAnswers++;
            }
        }
    });
    
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    return {
        correct: correctAnswers,
        total: totalQuestions,
        percentage: percentage
    };
}

function showQuizResults(score) {
    const quizInterface = document.getElementById('quizInterface');
    const quizResults = document.getElementById('quizResults');
    
    if (quizInterface) quizInterface.style.display = 'none';
    if (quizResults) {
        quizResults.style.display = 'block';
        
        document.getElementById('finalScore').textContent = `${score.percentage}%`;
        document.getElementById('scoreDetails').textContent = `${score.correct} out of ${score.total} questions correct`;
        
        // Show performance message
        let performanceMessage = '';
        if (score.percentage >= 90) {
            performanceMessage = 'Excellent work!';
        } else if (score.percentage >= 80) {
            performanceMessage = 'Well done!';
        } else if (score.percentage >= 70) {
            performanceMessage = 'Good job!';
        } else if (score.percentage >= 60) {
            performanceMessage = 'You passed, but there\'s room for improvement.';
        } else {
            performanceMessage = 'You didn\'t pass this time. Keep studying!';
        }
        
        document.getElementById('performanceMessage').textContent = performanceMessage;
        
        // Show security report if there were suspicious activities
        if (suspiciousActivityCount > 0) {
            const securityReport = document.getElementById('securityReport');
            if (securityReport) {
                securityReport.style.display = 'block';
                securityReport.querySelector('.activity-count').textContent = suspiciousActivityCount;
            }
        }
    }
}

// Export functions for debugging (remove in production)
window.QuizModule = {
    startQuiz,
    submitQuiz,
    logSuspiciousActivity,
    userAnswers: () => userAnswers,
    quizData: () => quizData
};