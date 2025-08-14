// Quiz Taking JavaScript for SecureTest Platform

document.addEventListener('DOMContentLoaded', function() {
    // Check if user has tester privileges or if this is a preview
    const userRole = localStorage.getItem('userRole');
    const isPreview = new URLSearchParams(window.location.search).get('preview') === 'true';
    
    if (!isPreview && userRole !== 'tester' && userRole !== 'admin') {
        alert('Access denied. Student privileges required.');
        window.location.href = '../auth/login.html';
        return;
    }

    // Initialize quiz taking interface
    initializeQuizTaking();
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = {};
let quizStartTime = null;
let quizTimer = null;
let timeRemaining = 0;
let suspiciousActivityCount = 0;

function initializeQuizTaking() {
    // Check if this is a preview
    const isPreview = new URLSearchParams(window.location.search).get('preview') === 'true';
    
    if (isPreview) {
        // Load preview quiz
        const previewQuiz = localStorage.getItem('previewQuiz');
        if (previewQuiz) {
            currentQuiz = JSON.parse(previewQuiz);
            showQuizInfo();
        } else {
            alert('No preview quiz found.');
            window.close();
        }
    } else {
        // Update user info in header
        const userEmail = localStorage.getItem('userEmail');
        const userEmailElement = document.getElementById('userEmail');
        if (userEmailElement && userEmail) {
            userEmailElement.textContent = userEmail;
        }

        // Load available quizzes
        loadAvailableQuizzes();
    }

    // Initialize anti-cheat measures
    initializeAntiCheat();
}

function loadAvailableQuizzes() {
    // Load published quizzes
    const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
    const publishedQuizzes = savedQuizzes.filter(quiz => quiz.published);
    
    const quizListContainer = document.getElementById('availableQuizzes');
    if (quizListContainer) {
        quizListContainer.innerHTML = '';
        
        if (publishedQuizzes.length === 0) {
            quizListContainer.innerHTML = '<p>No quizzes available at the moment.</p>';
            return;
        }
        
        publishedQuizzes.forEach(quiz => {
            const quizCard = document.createElement('div');
            quizCard.className = 'quiz-card';
            quizCard.innerHTML = `
                <h3>${quiz.title}</h3>
                <p>${quiz.description || 'No description available'}</p>
                <div class="quiz-details">
                    <span><i class="fas fa-question-circle"></i> ${quiz.questions.length} questions</span>
                    <span><i class="fas fa-clock"></i> ${quiz.timeLimit ? quiz.timeLimit + ' minutes' : 'No time limit'}</span>
                    <span><i class="fas fa-user"></i> Created by ${quiz.createdBy}</span>
                </div>
                <button class="btn primary" onclick="selectQuiz('${quiz.id}')">Start Quiz</button>
            `;
            quizListContainer.appendChild(quizCard);
        });
    }
}

function selectQuiz(quizId) {
    const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
    const quiz = savedQuizzes.find(q => q.id === quizId);
    
    if (quiz) {
        currentQuiz = quiz;
        showQuizInfo();
    }
}

function showQuizInfo() {
    const quizListContainer = document.getElementById('availableQuizzes');
    const quizContainer = document.getElementById('quizContainer');
    
    if (quizListContainer) quizListContainer.style.display = 'none';
    if (quizContainer) quizContainer.style.display = 'block';
    
    // Update quiz header
    document.getElementById('quizTitle').textContent = currentQuiz.title;
    document.getElementById('quizDescription').textContent = currentQuiz.description || 'No description available';
    document.getElementById('questionCount').textContent = currentQuiz.questions.length;
    document.getElementById('timeLimit').textContent = currentQuiz.timeLimit ? currentQuiz.timeLimit + ' minutes' : 'No time limit';
    
    // Show start button
    const startButton = document.getElementById('startQuizBtn');
    if (startButton) {
        startButton.style.display = 'block';
        startButton.onclick = startQuiz;
    }
}

function startQuiz() {
    // Hide quiz info and start button
    document.getElementById('quizInfo').style.display = 'none';
    document.getElementById('startQuizBtn').style.display = 'none';
    
    // Show quiz content
    document.getElementById('quizContent').style.display = 'block';
    
    // Initialize quiz state
    currentQuestionIndex = 0;
    userAnswers = {};
    quizStartTime = new Date();
    suspiciousActivityCount = 0;
    
    // Start timer if there's a time limit
    if (currentQuiz.timeLimit > 0) {
        timeRemaining = currentQuiz.timeLimit * 60; // Convert to seconds
        startTimer();
    }
    
    // Show first question
    showQuestion(0);
    
    // Enable full anti-cheat mode
    enableAntiCheatMode();
}

function startTimer() {
    const timerDisplay = document.getElementById('timer');
    
    quizTimer = setInterval(() => {
        timeRemaining--;
        
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color when time is running out
        if (timeRemaining <= 300) { // Last 5 minutes
            timerDisplay.style.color = '#dc3545';
        } else if (timeRemaining <= 600) { // Last 10 minutes
            timerDisplay.style.color = '#ffc107';
        }
        
        if (timeRemaining <= 0) {
            clearInterval(quizTimer);
            submitQuiz(true); // Auto-submit when time is up
        }
    }, 1000);
}

function showQuestion(index) {
    const question = currentQuiz.questions[index];
    if (!question) return;
    
    currentQuestionIndex = index;
    
    // Update progress
    const progress = ((index + 1) / currentQuiz.questions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('currentQuestion').textContent = index + 1;
    document.getElementById('totalQuestions').textContent = currentQuiz.questions.length;
    
    // Update question content
    document.getElementById('questionText').innerHTML = question.text;
    document.getElementById('questionPoints').textContent = question.points;
    
    // Generate answer options
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';
    
    if (question.type === 'multiple-choice') {
        question.options.forEach((option, optionIndex) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'answer-option';
            
            const isSelected = userAnswers[question.id] === optionIndex;
            
            optionDiv.innerHTML = `
                <label class="${isSelected ? 'selected' : ''}">
                    <input type="radio" name="answer" value="${optionIndex}" ${isSelected ? 'checked' : ''}>
                    <span class="option-text">${option}</span>
                </label>
            `;
            
            optionDiv.addEventListener('click', () => selectAnswer(optionIndex));
            answersContainer.appendChild(optionDiv);
        });
    } else if (question.type === 'true-false') {
        ['True', 'False'].forEach((option, optionIndex) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'answer-option';
            
            const isSelected = userAnswers[question.id] === (optionIndex === 0 ? 'true' : 'false');
            
            optionDiv.innerHTML = `
                <label class="${isSelected ? 'selected' : ''}">
                    <input type="radio" name="answer" value="${optionIndex === 0 ? 'true' : 'false'}" ${isSelected ? 'checked' : ''}>
                    <span class="option-text">${option}</span>
                </label>
            `;
            
            optionDiv.addEventListener('click', () => selectAnswer(optionIndex === 0 ? 'true' : 'false'));
            answersContainer.appendChild(optionDiv);
        });
    } else if (question.type === 'short-answer' || question.type === 'essay') {
        const textarea = document.createElement('textarea');
        textarea.className = 'text-answer';
        textarea.placeholder = question.type === 'essay' ? 'Enter your essay answer here...' : 'Enter your short answer here...';
        textarea.rows = question.type === 'essay' ? 8 : 3;
        textarea.value = userAnswers[question.id] || '';
        
        textarea.addEventListener('input', (e) => {
            userAnswers[question.id] = e.target.value;
        });
        
        answersContainer.appendChild(textarea);
    }
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    prevBtn.style.display = index > 0 ? 'inline-block' : 'none';
    
    if (index < currentQuiz.questions.length - 1) {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    }
}

function selectAnswer(answerValue) {
    const question = currentQuiz.questions[currentQuestionIndex];
    userAnswers[question.id] = answerValue;
    
    // Update visual selection
    const options = document.querySelectorAll('.answer-option label');
    options.forEach(option => option.classList.remove('selected'));
    
    const selectedOption = document.querySelector(`input[value="${answerValue}"]`);
    if (selectedOption) {
        selectedOption.closest('label').classList.add('selected');
        selectedOption.checked = true;
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        showQuestion(currentQuestionIndex - 1);
    }
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        showQuestion(currentQuestionIndex + 1);
    }
}

function submitQuiz(autoSubmit = false) {
    // Check if all questions are answered (optional validation)
    const unansweredQuestions = [];
    currentQuiz.questions.forEach((question, index) => {
        if (!(question.id in userAnswers) || userAnswers[question.id] === '') {
            unansweredQuestions.push(index + 1);
        }
    });
    
    if (!autoSubmit && unansweredQuestions.length > 0) {
        const message = `You have ${unansweredQuestions.length} unanswered question(s): ${unansweredQuestions.join(', ')}.\n\nAre you sure you want to submit?`;
        if (!confirm(message)) {
            return;
        }
    }
    
    // Stop timer
    if (quizTimer) {
        clearInterval(quizTimer);
    }
    
    // Calculate results
    const results = calculateResults();
    
    // Show results
    showResults(results, autoSubmit);
    
    // Disable anti-cheat mode
    disableAntiCheatMode();
}

function calculateResults() {
    let totalPoints = 0;
    let earnedPoints = 0;
    let correctAnswers = 0;
    const detailedResults = [];
    
    currentQuiz.questions.forEach(question => {
        totalPoints += question.points;
        
        const userAnswer = userAnswers[question.id];
        let isCorrect = false;
        
        if (question.type === 'multiple-choice') {
            isCorrect = userAnswer === question.correctAnswer;
        } else if (question.type === 'true-false') {
            isCorrect = userAnswer === question.correctAnswer;
        }
        
        if (isCorrect) {
            earnedPoints += question.points;
            correctAnswers++;
        }
        
        detailedResults.push({
            question: question.text,
            userAnswer: userAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect: isCorrect,
            points: isCorrect ? question.points : 0,
            maxPoints: question.points,
            explanation: question.explanation
        });
    });
    
    const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const endTime = new Date();
    const timeTaken = Math.round((endTime - quizStartTime) / 1000 / 60); // in minutes
    
    return {
        totalQuestions: currentQuiz.questions.length,
        correctAnswers: correctAnswers,
        totalPoints: totalPoints,
        earnedPoints: earnedPoints,
        percentage: percentage,
        timeTaken: timeTaken,
        suspiciousActivity: suspiciousActivityCount,
        detailedResults: detailedResults
    };
}

function showResults(results, autoSubmit) {
    // Hide quiz content
    document.getElementById('quizContent').style.display = 'none';
    
    // Show results
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.style.display = 'block';
    
    // Update results summary
    document.getElementById('finalScore').textContent = `${results.earnedPoints}/${results.totalPoints}`;
    document.getElementById('finalPercentage').textContent = `${results.percentage}%`;
    document.getElementById('finalCorrect').textContent = `${results.correctAnswers}/${results.totalQuestions}`;
    document.getElementById('finalTime').textContent = `${results.timeTaken} minutes`;
    
    // Set grade color
    const gradeElement = document.getElementById('finalPercentage');
    if (results.percentage >= 90) {
        gradeElement.style.color = '#28a745';
    } else if (results.percentage >= 80) {
        gradeElement.style.color = '#17a2b8';
    } else if (results.percentage >= 70) {
        gradeElement.style.color = '#ffc107';
    } else {
        gradeElement.style.color = '#dc3545';
    }
    
    // Show auto-submit warning if applicable
    const autoSubmitWarning = document.getElementById('autoSubmitWarning');
    if (autoSubmit) {
        autoSubmitWarning.style.display = 'block';
    }
    
    // Show suspicious activity warning if applicable
    const suspiciousWarning = document.getElementById('suspiciousWarning');
    if (results.suspiciousActivity > 0) {
        suspiciousWarning.style.display = 'block';
        document.getElementById('suspiciousCount').textContent = results.suspiciousActivity;
    }
    
    // Store results
    const resultData = {
        quizId: currentQuiz.id,
        quizTitle: currentQuiz.title,
        studentEmail: localStorage.getItem('userEmail'),
        results: results,
        completedAt: new Date().toISOString()
    };
    
    const quizResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    quizResults.push(resultData);
    localStorage.setItem('quizResults', JSON.stringify(quizResults));
}

function initializeAntiCheat() {
    // Detect when user leaves the tab/window
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && currentQuiz && quizStartTime) {
            suspiciousActivityCount++;
            console.log('Suspicious activity: Tab/Window focus lost');
            showSuspiciousActivityWarning('Leaving the quiz tab/window');
        }
    });

    // Detect right-click attempts
    document.addEventListener('contextmenu', function(e) {
        if (currentQuiz && quizStartTime) {
            e.preventDefault();
            suspiciousActivityCount++;
            showSuspiciousActivityWarning('Right-click detected');
        }
    });

    // Detect keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (currentQuiz && quizStartTime) {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.key === 'u') ||
                (e.ctrlKey && e.key === 's')) {
                
                e.preventDefault();
                suspiciousActivityCount++;
                showSuspiciousActivityWarning('Unauthorized keyboard shortcut');
            }
        }
    });
}

function enableAntiCheatMode() {
    // Try to enter fullscreen (optional, may not work in all browsers)
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {
            console.log('Fullscreen not supported or denied');
        });
    }
    
    // Disable text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    
    // Show anti-cheat notice
    const antiCheatNotice = document.getElementById('antiCheatNotice');
    if (antiCheatNotice) {
        antiCheatNotice.style.display = 'block';
    }
}

function disableAntiCheatMode() {
    // Exit fullscreen
    if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {
            console.log('Exit fullscreen failed');
        });
    }
    
    // Re-enable text selection
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    
    // Hide anti-cheat notice
    const antiCheatNotice = document.getElementById('antiCheatNotice');
    if (antiCheatNotice) {
        antiCheatNotice.style.display = 'none';
    }
}

function showSuspiciousActivityWarning(activity) {
    const overlay = document.getElementById('antiCheatOverlay');
    if (overlay) {
        overlay.classList.add('active');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 3000);
    }
    
    console.log(`Suspicious activity logged: ${activity}`);
}

function retakeQuiz() {
    location.reload();
}

function goHome() {
    window.location.href = '../../index.html';
}

function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    alert('Logged out successfully!');
    window.location.href = '../../index.html';
}

// Add styles for quiz taking interface
const quizTakingStyles = `
    .quiz-card {
        background: white;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        transition: transform 0.2s ease;
    }
    
    .quiz-card:hover {
        transform: translateY(-2px);
    }
    
    .quiz-details {
        display: flex;
        gap: 1rem;
        margin: 1rem 0;
        font-size: 0.9rem;
        color: #666;
    }
    
    .quiz-details span {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .answer-option {
        margin-bottom: 0.5rem;
    }
    
    .answer-option label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 2px solid transparent;
    }
    
    .answer-option label:hover {
        background: #e9ecef;
    }
    
    .answer-option label.selected {
        background: #e3f2fd;
        border-color: #667eea;
        color: #667eea;
    }
    
    .text-answer {
        width: 100%;
        padding: 1rem;
        border: 2px solid #ddd;
        border-radius: 5px;
        font-family: inherit;
        font-size: 1rem;
        resize: vertical;
    }
    
    .text-answer:focus {
        outline: none;
        border-color: #667eea;
    }
    
    .results-summary {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .results-summary h2 {
        color: #333;
        margin-bottom: 1rem;
    }
    
    .score-display {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 2rem 0;
    }
    
    .score-item {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        text-align: center;
    }
    
    .score-item h3 {
        color: #667eea;
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }
    
    .warning-banner {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 5px;
        padding: 1rem;
        margin-bottom: 1rem;
        display: none;
    }
    
    .warning-banner.danger {
        background: #f8d7da;
        border-color: #f5c6cb;
        color: #721c24;
    }
    
    .anti-cheat-notice {
        background: #d4edda;
        border: 1px solid #c3e6cb;
        border-radius: 5px;
        padding: 1rem;
        margin-bottom: 1rem;
        color: #155724;
        display: none;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = quizTakingStyles;
document.head.appendChild(styleSheet);

// Navigation button event listeners
document.getElementById('prevBtn')?.addEventListener('click', previousQuestion);
document.getElementById('nextBtn')?.addEventListener('click', nextQuestion);
document.getElementById('submitBtn')?.addEventListener('click', () => submitQuiz());