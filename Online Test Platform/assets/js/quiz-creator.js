// Quiz Creator JavaScript for SecureTest
document.addEventListener('DOMContentLoaded', function() {
    console.log('Quiz creator module loaded');
    
    // Check if user has editor access
    checkEditorAccess();
    
    initQuizCreator();
    initQuestionManagement();
    initQuizPreview();
    initQuizSaving();
});

function checkEditorAccess() {
    const userRole = localStorage.getItem('userRole');
    
    if (userRole !== 'editor' && userRole !== 'admin') {
        alert('Access denied. Editor privileges required.');
        window.location.href = '../auth/login.html';
        return;
    }
}

// Quiz data structure
let currentQuiz = {
    title: '',
    description: '',
    duration: 30,
    difficulty: 'beginner',
    questions: [],
    settings: {
        shuffleQuestions: false,
        shuffleAnswers: false,
        showCorrectAnswers: true,
        allowRetake: false,
        antiCheatEnabled: true
    }
};

let currentQuestionIndex = -1;

function initQuizCreator() {
    // Set editor user info
    const userEmail = localStorage.getItem('userEmail');
    const editorEmailElements = document.querySelectorAll('.editor-email');
    editorEmailElements.forEach(element => {
        if (element && userEmail) {
            element.textContent = userEmail;
        }
    });
    
    // Quiz basic info form
    const quizInfoForm = document.getElementById('quizInfoForm');
    if (quizInfoForm) {
        quizInfoForm.addEventListener('input', updateQuizInfo);
        quizInfoForm.addEventListener('change', updateQuizInfo);
    }
    
    // Navigation between sections
    initSectionNavigation();
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout? Unsaved changes will be lost.')) {
                localStorage.removeItem('userRole');
                localStorage.removeItem('userEmail');
                window.location.href = '../auth/login.html';
            }
        });
    }
}

function initSectionNavigation() {
    const navButtons = document.querySelectorAll('.section-nav button');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.dataset.section;
            showSection(targetSection);
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.quiz-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName + 'Section');
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Update navigation buttons
    const navButtons = document.querySelectorAll('.section-nav button');
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    const activeButton = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Update section-specific content
    if (sectionName === 'questions') {
        updateQuestionsList();
    } else if (sectionName === 'preview') {
        generateQuizPreview();
    }
}

function updateQuizInfo() {
    const formData = new FormData(document.getElementById('quizInfoForm'));
    
    currentQuiz.title = formData.get('title') || '';
    currentQuiz.description = formData.get('description') || '';
    currentQuiz.duration = parseInt(formData.get('duration')) || 30;
    currentQuiz.difficulty = formData.get('difficulty') || 'beginner';
    
    // Update quiz settings
    currentQuiz.settings.shuffleQuestions = formData.get('shuffleQuestions') === 'on';
    currentQuiz.settings.shuffleAnswers = formData.get('shuffleAnswers') === 'on';
    currentQuiz.settings.showCorrectAnswers = formData.get('showCorrectAnswers') === 'on';
    currentQuiz.settings.allowRetake = formData.get('allowRetake') === 'on';
    currentQuiz.settings.antiCheatEnabled = formData.get('antiCheatEnabled') === 'on';
    
    // Update progress indicator
    updateProgressIndicator();
}

function updateProgressIndicator() {
    const progressText = document.getElementById('quizProgress');
    if (progressText) {
        const basicInfoComplete = currentQuiz.title && currentQuiz.description;
        const questionsComplete = currentQuiz.questions.length > 0;
        
        let progress = 0;
        if (basicInfoComplete) progress += 33;
        if (questionsComplete) progress += 34;
        
        progressText.textContent = `${progress}% complete`;
    }
}

function initQuestionManagement() {
    // Add question button
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    if (addQuestionBtn) {
        addQuestionBtn.addEventListener('click', addNewQuestion);
    }
    
    // Question form
    const questionForm = document.getElementById('questionForm');
    if (questionForm) {
        questionForm.addEventListener('submit', saveQuestion);
    }
    
    // Question type selector
    const questionTypeSelect = document.getElementById('questionType');
    if (questionTypeSelect) {
        questionTypeSelect.addEventListener('change', updateQuestionForm);
    }
    
    // Initialize question form
    updateQuestionForm();
}

function addNewQuestion() {
    currentQuestionIndex = -1; // New question
    resetQuestionForm();
    showQuestionForm();
}

function editQuestion(index) {
    currentQuestionIndex = index;
    const question = currentQuiz.questions[index];
    
    // Populate form with question data
    document.getElementById('questionText').value = question.text;
    document.getElementById('questionType').value = question.type;
    document.getElementById('questionPoints').value = question.points || 1;
    
    updateQuestionForm();
    
    if (question.type === 'multiple-choice') {
        const optionsContainer = document.getElementById('optionsContainer');
        const optionInputs = optionsContainer.querySelectorAll('.option-input');
        
        question.options.forEach((option, i) => {
            if (optionInputs[i]) {
                optionInputs[i].value = option;
            }
        });
        
        // Set correct answer
        const correctAnswerSelect = document.getElementById('correctAnswer');
        correctAnswerSelect.value = question.correctAnswer;
    } else if (question.type === 'short-answer' || question.type === 'essay') {
        document.getElementById('correctAnswerText').value = question.correctAnswer || '';
    }
    
    showQuestionForm();
}

function resetQuestionForm() {
    document.getElementById('questionForm').reset();
    updateQuestionForm();
}

function updateQuestionForm() {
    const questionTypeElement = document.getElementById('questionType');
    if (!questionTypeElement) return; // Guard clause if element doesn't exist
    
    const questionType = questionTypeElement.value;
    const multipleChoiceOptions = document.getElementById('multipleChoiceOptions');
    const shortAnswerOption = document.getElementById('shortAnswerOption');
    
    // Hide all type-specific sections
    if (multipleChoiceOptions) multipleChoiceOptions.style.display = 'none';
    if (shortAnswerOption) shortAnswerOption.style.display = 'none';
    
    // Show relevant section based on question type
    if (questionType === 'multiple-choice' && multipleChoiceOptions) {
        multipleChoiceOptions.style.display = 'block';
        updateCorrectAnswerOptions();
    } else if ((questionType === 'short-answer' || questionType === 'essay') && shortAnswerOption) {
        shortAnswerOption.style.display = 'block';
    }
}

function updateCorrectAnswerOptions() {
    const correctAnswerSelect = document.getElementById('correctAnswer');
    const optionInputs = document.querySelectorAll('.option-input');
    
    if (!correctAnswerSelect) return;
    
    // Clear existing options
    correctAnswerSelect.innerHTML = '<option value="">Select correct answer</option>';
    
    // Add options based on current option inputs
    optionInputs.forEach((input, index) => {
        if (input.value.trim()) {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Option ${index + 1}: ${input.value.substring(0, 30)}...`;
            correctAnswerSelect.appendChild(option);
        }
    });
}

function showQuestionForm() {
    const questionsList = document.getElementById('questionsList');
    const questionFormContainer = document.getElementById('questionFormContainer');
    
    if (questionsList) questionsList.style.display = 'none';
    if (questionFormContainer) questionFormContainer.style.display = 'block';
}

function hideQuestionForm() {
    const questionsList = document.getElementById('questionsList');
    const questionFormContainer = document.getElementById('questionFormContainer');
    
    if (questionsList) questionsList.style.display = 'block';
    if (questionFormContainer) questionFormContainer.style.display = 'none';
}

function saveQuestion(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const questionType = formData.get('questionType');
    
    const question = {
        text: formData.get('questionText'),
        type: questionType,
        points: parseInt(formData.get('questionPoints')) || 1
    };
    
    // Add type-specific data
    if (questionType === 'multiple-choice') {
        question.options = [];
        const optionInputs = document.querySelectorAll('.option-input');
        
        optionInputs.forEach(input => {
            if (input.value.trim()) {
                question.options.push(input.value.trim());
            }
        });
        
        question.correctAnswer = parseInt(formData.get('correctAnswer'));
        
        // Validation
        if (question.options.length < 2) {
            alert('Please provide at least 2 options for multiple choice questions');
            return;
        }
        
        if (isNaN(question.correctAnswer) || question.correctAnswer >= question.options.length) {
            alert('Please select a valid correct answer');
            return;
        }
    } else if (questionType === 'short-answer' || questionType === 'essay') {
        question.correctAnswer = formData.get('correctAnswerText');
    }
    
    // Basic validation
    if (!question.text.trim()) {
        alert('Please enter a question');
        return;
    }
    
    // Save or update question
    if (currentQuestionIndex >= 0) {
        // Update existing question
        currentQuiz.questions[currentQuestionIndex] = question;
    } else {
        // Add new question
        currentQuiz.questions.push(question);
    }
    
    updateQuestionsList();
    hideQuestionForm();
    updateProgressIndicator();
    
    // Success message
    const action = currentQuestionIndex >= 0 ? 'updated' : 'added';
    if (window.SecureTest && window.SecureTest.showNotification) {
        window.SecureTest.showNotification(`Question ${action} successfully!`, 'success');
    }
}

function updateQuestionsList() {
    const questionsContainer = document.getElementById('questionsContainer');
    if (!questionsContainer) return;
    
    if (currentQuiz.questions.length === 0) {
        questionsContainer.innerHTML = `
            <div class="no-questions">
                <p>No questions added yet. Click "Add Question" to get started.</p>
            </div>
        `;
        return;
    }
    
    questionsContainer.innerHTML = currentQuiz.questions.map((question, index) => `
        <div class="question-item" data-question-index="${index}">
            <div class="question-header">
                <h4>Question ${index + 1}</h4>
                <div class="question-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editQuestion(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteQuestion(${index})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            <div class="question-content">
                <p><strong>Type:</strong> ${question.type.replace('-', ' ').toUpperCase()}</p>
                <p><strong>Points:</strong> ${question.points}</p>
                <p><strong>Question:</strong> ${question.text}</p>
                ${question.type === 'multiple-choice' ? `
                    <div class="options-preview">
                        <strong>Options:</strong>
                        <ul>
                            ${question.options.map((option, optIndex) => `
                                <li class="${optIndex === question.correctAnswer ? 'correct-answer' : ''}">
                                    ${option} ${optIndex === question.correctAnswer ? '(Correct)' : ''}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function deleteQuestion(index) {
    if (confirm('Are you sure you want to delete this question?')) {
        currentQuiz.questions.splice(index, 1);
        updateQuestionsList();
        updateProgressIndicator();
        
        if (window.SecureTest && window.SecureTest.showNotification) {
            window.SecureTest.showNotification('Question deleted successfully!', 'success');
        }
    }
}

function initQuizPreview() {
    const previewBtn = document.getElementById('previewQuizBtn');
    if (previewBtn) {
        previewBtn.addEventListener('click', generateQuizPreview);
    }
}

function generateQuizPreview() {
    const previewContainer = document.getElementById('quizPreviewContainer');
    if (!previewContainer) return;
    
    if (!currentQuiz.title || currentQuiz.questions.length === 0) {
        previewContainer.innerHTML = `
            <div class="preview-warning">
                <p>Please complete the quiz basic information and add at least one question to preview.</p>
            </div>
        `;
        return;
    }
    
    const totalPoints = currentQuiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
    
    previewContainer.innerHTML = `
        <div class="quiz-preview">
            <div class="preview-header">
                <h2>${currentQuiz.title}</h2>
                <p>${currentQuiz.description}</p>
                <div class="quiz-meta">
                    <span><i class="fas fa-clock"></i> ${currentQuiz.duration} minutes</span>
                    <span><i class="fas fa-question-circle"></i> ${currentQuiz.questions.length} questions</span>
                    <span><i class="fas fa-star"></i> ${totalPoints} points</span>
                    <span class="difficulty ${currentQuiz.difficulty}">
                        <i class="fas fa-signal"></i> ${currentQuiz.difficulty.toUpperCase()}
                    </span>
                </div>
            </div>
            
            <div class="preview-questions">
                ${currentQuiz.questions.map((question, index) => `
                    <div class="preview-question">
                        <h4>Question ${index + 1} (${question.points} point${question.points !== 1 ? 's' : ''})</h4>
                        <p class="question-text">${question.text}</p>
                        
                        ${question.type === 'multiple-choice' ? `
                            <div class="preview-options">
                                ${question.options.map((option, optIndex) => `
                                    <div class="preview-option ${optIndex === question.correctAnswer ? 'correct' : ''}">
                                        <span class="option-label">${String.fromCharCode(65 + optIndex)}.</span>
                                        <span class="option-text">${option}</span>
                                        ${optIndex === question.correctAnswer ? '<i class="fas fa-check correct-icon"></i>' : ''}
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            <div class="preview-answer-area">
                                <em>Answer area for ${question.type.replace('-', ' ')} question</em>
                            </div>
                        `}
                    </div>
                `).join('')}
            </div>
            
            <div class="preview-settings">
                <h4>Quiz Settings</h4>
                <ul>
                    <li>Shuffle Questions: ${currentQuiz.settings.shuffleQuestions ? 'Yes' : 'No'}</li>
                    <li>Shuffle Answers: ${currentQuiz.settings.shuffleAnswers ? 'Yes' : 'No'}</li>
                    <li>Show Correct Answers: ${currentQuiz.settings.showCorrectAnswers ? 'Yes' : 'No'}</li>
                    <li>Allow Retake: ${currentQuiz.settings.allowRetake ? 'Yes' : 'No'}</li>
                    <li>Anti-Cheat Enabled: ${currentQuiz.settings.antiCheatEnabled ? 'Yes' : 'No'}</li>
                </ul>
            </div>
        </div>
    `;
}

function initQuizSaving() {
    const saveQuizBtn = document.getElementById('saveQuizBtn');
    if (saveQuizBtn) {
        saveQuizBtn.addEventListener('click', saveQuiz);
    }
    
    const publishQuizBtn = document.getElementById('publishQuizBtn');
    if (publishQuizBtn) {
        publishQuizBtn.addEventListener('click', publishQuiz);
    }
}

function saveQuiz() {
    if (!validateQuiz()) return;
    
    // Simulate saving to server
    const quizData = {
        ...currentQuiz,
        id: Date.now(), // Generate unique ID
        status: 'draft',
        createdBy: localStorage.getItem('userEmail'),
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
    };
    
    // Save to localStorage for demo purposes
    const savedQuizzes = JSON.parse(localStorage.getItem('editorQuizzes') || '[]');
    const existingIndex = savedQuizzes.findIndex(q => q.title === quizData.title);
    
    if (existingIndex >= 0) {
        savedQuizzes[existingIndex] = quizData;
    } else {
        savedQuizzes.push(quizData);
    }
    
    localStorage.setItem('editorQuizzes', JSON.stringify(savedQuizzes));
    
    if (window.SecureTest && window.SecureTest.showNotification) {
        window.SecureTest.showNotification('Quiz saved successfully!', 'success');
    } else {
        alert('Quiz saved successfully!');
    }
}

function publishQuiz() {
    if (!validateQuiz()) return;
    
    if (confirm('Are you sure you want to publish this quiz? Once published, students will be able to take it.')) {
        // Simulate publishing
        const quizData = {
            ...currentQuiz,
            id: Date.now(),
            status: 'published',
            createdBy: localStorage.getItem('userEmail'),
            createdAt: new Date().toISOString(),
            publishedAt: new Date().toISOString()
        };
        
        // Save to localStorage for demo purposes
        const publishedQuizzes = JSON.parse(localStorage.getItem('publishedQuizzes') || '[]');
        publishedQuizzes.push(quizData);
        localStorage.setItem('publishedQuizzes', JSON.stringify(publishedQuizzes));
        
        if (window.SecureTest && window.SecureTest.showNotification) {
            window.SecureTest.showNotification('Quiz published successfully!', 'success');
        } else {
            alert('Quiz published successfully!');
        }
        
        // Reset form for new quiz
        if (confirm('Quiz published! Would you like to create a new quiz?')) {
            resetQuizCreator();
        }
    }
}

function validateQuiz() {
    if (!currentQuiz.title.trim()) {
        alert('Please enter a quiz title');
        showSection('basic');
        return false;
    }
    
    if (!currentQuiz.description.trim()) {
        alert('Please enter a quiz description');
        showSection('basic');
        return false;
    }
    
    if (currentQuiz.questions.length === 0) {
        alert('Please add at least one question');
        showSection('questions');
        return false;
    }
    
    // Validate each question
    for (let i = 0; i < currentQuiz.questions.length; i++) {
        const question = currentQuiz.questions[i];
        
        if (!question.text.trim()) {
            alert(`Question ${i + 1} is missing question text`);
            showSection('questions');
            return false;
        }
        
        if (question.type === 'multiple-choice') {
            if (!question.options || question.options.length < 2) {
                alert(`Question ${i + 1} needs at least 2 options`);
                showSection('questions');
                return false;
            }
            
            if (typeof question.correctAnswer !== 'number' || question.correctAnswer >= question.options.length) {
                alert(`Question ${i + 1} is missing a valid correct answer`);
                showSection('questions');
                return false;
            }
        }
    }
    
    return true;
}

function resetQuizCreator() {
    currentQuiz = {
        title: '',
        description: '',
        duration: 30,
        difficulty: 'beginner',
        questions: [],
        settings: {
            shuffleQuestions: false,
            shuffleAnswers: false,
            showCorrectAnswers: true,
            allowRetake: false,
            antiCheatEnabled: true
        }
    };
    
    currentQuestionIndex = -1;
    
    // Reset forms
    document.getElementById('quizInfoForm').reset();
    resetQuestionForm();
    hideQuestionForm();
    
    // Update displays
    updateQuestionsList();
    updateProgressIndicator();
    
    // Go to basic info section
    showSection('basic');
}

// Make functions available globally
window.QuizCreator = {
    editQuestion,
    deleteQuestion,
    saveQuiz,
    publishQuiz,
    resetQuizCreator
};