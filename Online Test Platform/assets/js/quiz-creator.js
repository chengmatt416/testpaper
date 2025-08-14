// Quiz Creator JavaScript for SecureTest Platform

document.addEventListener('DOMContentLoaded', function() {
    // Check if user has editor privileges
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'editor' && userRole !== 'admin') {
        alert('Access denied. Editor privileges required.');
        window.location.href = '../auth/login.html';
        return;
    }

    // Initialize quiz creator
    initializeQuizCreator();
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

let currentQuiz = {
    title: '',
    description: '',
    timeLimit: 0,
    questions: []
};

let questionCounter = 0;

function initializeQuizCreator() {
    // Update user info in header
    const userEmail = localStorage.getItem('userEmail');
    const userEmailElement = document.getElementById('userEmail');
    if (userEmailElement && userEmail) {
        userEmailElement.textContent = userEmail;
    }

    // Initialize quiz form
    const quizForm = document.getElementById('quizForm');
    if (quizForm) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveQuiz();
        });
    }

    // Add question button
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    if (addQuestionBtn) {
        addQuestionBtn.addEventListener('click', addQuestion);
    }

    // Quiz settings form
    const settingsForm = document.getElementById('quizSettingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateQuizSettings();
        });
    }

    // Load existing quizzes
    loadExistingQuizzes();
}

function updateQuizSettings() {
    const title = document.getElementById('quizTitle').value;
    const description = document.getElementById('quizDescription').value;
    const timeLimit = document.getElementById('timeLimit').value;

    if (!title) {
        alert('Please enter a quiz title.');
        return;
    }

    currentQuiz.title = title;
    currentQuiz.description = description;
    currentQuiz.timeLimit = parseInt(timeLimit) || 0;

    alert('Quiz settings updated!');
    updateQuizPreview();
}

function addQuestion() {
    questionCounter++;
    
    const questionContainer = document.createElement('div');
    questionContainer.className = 'question-editor';
    questionContainer.id = `question-${questionCounter}`;
    
    questionContainer.innerHTML = `
        <div class="question-header">
            <h4>Question ${questionCounter}</h4>
            <button type="button" class="btn-small btn-danger" onclick="removeQuestion(${questionCounter})">Remove</button>
        </div>
        
        <div class="form-group">
            <label for="questionText-${questionCounter}">Question Text</label>
            <textarea id="questionText-${questionCounter}" rows="3" placeholder="Enter your question here..." required></textarea>
        </div>
        
        <div class="form-group">
            <label for="questionType-${questionCounter}">Question Type</label>
            <select id="questionType-${questionCounter}" onchange="updateQuestionType(${questionCounter})">
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
                <option value="short-answer">Short Answer</option>
                <option value="essay">Essay</option>
            </select>
        </div>
        
        <div id="questionOptions-${questionCounter}" class="question-options">
            <div class="form-group">
                <label>Options</label>
                <div class="option-list">
                    <div class="option-item">
                        <input type="radio" name="correct-${questionCounter}" value="0" required>
                        <input type="text" placeholder="Option A" class="option-text" required>
                        <button type="button" class="btn-small btn-danger" onclick="removeOption(this)">Remove</button>
                    </div>
                    <div class="option-item">
                        <input type="radio" name="correct-${questionCounter}" value="1" required>
                        <input type="text" placeholder="Option B" class="option-text" required>
                        <button type="button" class="btn-small btn-danger" onclick="removeOption(this)">Remove</button>
                    </div>
                </div>
                <button type="button" class="btn-small btn-secondary" onclick="addOption(${questionCounter})">Add Option</button>
            </div>
        </div>
        
        <div class="form-group">
            <label for="questionPoints-${questionCounter}">Points</label>
            <input type="number" id="questionPoints-${questionCounter}" min="1" max="100" value="1" required>
        </div>
        
        <div class="form-group">
            <label for="questionExplanation-${questionCounter}">Explanation (Optional)</label>
            <textarea id="questionExplanation-${questionCounter}" rows="2" placeholder="Explain the correct answer..."></textarea>
        </div>
    `;
    
    const questionsContainer = document.getElementById('questionsContainer');
    questionsContainer.appendChild(questionContainer);
    
    // Scroll to the new question
    questionContainer.scrollIntoView({ behavior: 'smooth' });
}

function removeQuestion(questionId) {
    if (confirm('Are you sure you want to remove this question?')) {
        const questionElement = document.getElementById(`question-${questionId}`);
        questionElement.remove();
        updateQuestionNumbers();
    }
}

function updateQuestionNumbers() {
    const questions = document.querySelectorAll('.question-editor');
    questions.forEach((question, index) => {
        const header = question.querySelector('h4');
        header.textContent = `Question ${index + 1}`;
    });
}

function updateQuestionType(questionId) {
    const typeSelect = document.getElementById(`questionType-${questionId}`);
    const optionsContainer = document.getElementById(`questionOptions-${questionId}`);
    const selectedType = typeSelect.value;
    
    switch(selectedType) {
        case 'multiple-choice':
            optionsContainer.innerHTML = `
                <div class="form-group">
                    <label>Options</label>
                    <div class="option-list">
                        <div class="option-item">
                            <input type="radio" name="correct-${questionId}" value="0" required>
                            <input type="text" placeholder="Option A" class="option-text" required>
                            <button type="button" class="btn-small btn-danger" onclick="removeOption(this)">Remove</button>
                        </div>
                        <div class="option-item">
                            <input type="radio" name="correct-${questionId}" value="1" required>
                            <input type="text" placeholder="Option B" class="option-text" required>
                            <button type="button" class="btn-small btn-danger" onclick="removeOption(this)">Remove</button>
                        </div>
                    </div>
                    <button type="button" class="btn-small btn-secondary" onclick="addOption(${questionId})">Add Option</button>
                </div>
            `;
            break;
            
        case 'true-false':
            optionsContainer.innerHTML = `
                <div class="form-group">
                    <label>Correct Answer</label>
                    <div class="option-list">
                        <div class="option-item">
                            <input type="radio" name="correct-${questionId}" value="true" required>
                            <span>True</span>
                        </div>
                        <div class="option-item">
                            <input type="radio" name="correct-${questionId}" value="false" required>
                            <span>False</span>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'short-answer':
        case 'essay':
            optionsContainer.innerHTML = `
                <div class="form-group">
                    <label>Sample Answer/Keywords</label>
                    <textarea placeholder="Enter sample answer or keywords for grading..." rows="3"></textarea>
                </div>
            `;
            break;
    }
}

function addOption(questionId) {
    const optionList = document.querySelector(`#questionOptions-${questionId} .option-list`);
    const optionCount = optionList.children.length;
    
    const optionItem = document.createElement('div');
    optionItem.className = 'option-item';
    optionItem.innerHTML = `
        <input type="radio" name="correct-${questionId}" value="${optionCount}" required>
        <input type="text" placeholder="Option ${String.fromCharCode(65 + optionCount)}" class="option-text" required>
        <button type="button" class="btn-small btn-danger" onclick="removeOption(this)">Remove</button>
    `;
    
    optionList.appendChild(optionItem);
}

function removeOption(button) {
    const optionItem = button.parentElement;
    const optionList = optionItem.parentElement;
    
    if (optionList.children.length > 2) {
        optionItem.remove();
        
        // Update option values
        Array.from(optionList.children).forEach((option, index) => {
            const radio = option.querySelector('input[type="radio"]');
            const text = option.querySelector('input[type="text"]');
            radio.value = index;
            text.placeholder = `Option ${String.fromCharCode(65 + index)}`;
        });
    } else {
        alert('A question must have at least 2 options.');
    }
}

function previewQuiz() {
    collectQuizData();
    
    if (currentQuiz.questions.length === 0) {
        alert('Please add at least one question to preview the quiz.');
        return;
    }
    
    // Store quiz data for preview
    localStorage.setItem('previewQuiz', JSON.stringify(currentQuiz));
    
    // Open preview in new tab
    window.open('../tester/take-quiz.html?preview=true', '_blank');
}

function saveQuiz() {
    collectQuizData();
    
    if (!currentQuiz.title) {
        alert('Please enter a quiz title.');
        return;
    }
    
    if (currentQuiz.questions.length === 0) {
        alert('Please add at least one question.');
        return;
    }
    
    // Validate all questions
    for (let i = 0; i < currentQuiz.questions.length; i++) {
        const question = currentQuiz.questions[i];
        if (!question.text) {
            alert(`Question ${i + 1} is missing text.`);
            return;
        }
        
        if (question.type === 'multiple-choice' && question.options.length < 2) {
            alert(`Question ${i + 1} must have at least 2 options.`);
            return;
        }
    }
    
    // Mock saving - in real app, this would be an API call
    const quizId = 'quiz_' + Date.now();
    const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
    
    const quizToSave = {
        ...currentQuiz,
        id: quizId,
        createdBy: localStorage.getItem('userEmail'),
        createdAt: new Date().toISOString(),
        published: false
    };
    
    savedQuizzes.push(quizToSave);
    localStorage.setItem('savedQuizzes', JSON.stringify(savedQuizzes));
    
    alert('Quiz saved successfully!');
    loadExistingQuizzes();
    clearQuizForm();
}

function collectQuizData() {
    // Update quiz settings
    currentQuiz.title = document.getElementById('quizTitle').value;
    currentQuiz.description = document.getElementById('quizDescription').value;
    currentQuiz.timeLimit = parseInt(document.getElementById('timeLimit').value) || 0;
    
    // Collect all questions
    currentQuiz.questions = [];
    const questionElements = document.querySelectorAll('.question-editor');
    
    questionElements.forEach((questionEl, index) => {
        const questionId = questionEl.id.split('-')[1];
        const questionText = document.getElementById(`questionText-${questionId}`).value;
        const questionType = document.getElementById(`questionType-${questionId}`).value;
        const questionPoints = parseInt(document.getElementById(`questionPoints-${questionId}`).value) || 1;
        const questionExplanation = document.getElementById(`questionExplanation-${questionId}`).value;
        
        const question = {
            id: questionId,
            text: questionText,
            type: questionType,
            points: questionPoints,
            explanation: questionExplanation,
            options: [],
            correctAnswer: null
        };
        
        // Collect options based on question type
        if (questionType === 'multiple-choice') {
            const optionItems = questionEl.querySelectorAll('.option-item');
            optionItems.forEach((optionItem, optionIndex) => {
                const optionText = optionItem.querySelector('.option-text');
                const isCorrect = optionItem.querySelector('input[type="radio"]').checked;
                
                if (optionText && optionText.value) {
                    question.options.push(optionText.value);
                    if (isCorrect) {
                        question.correctAnswer = optionIndex;
                    }
                }
            });
        } else if (questionType === 'true-false') {
            question.options = ['True', 'False'];
            const correctRadio = questionEl.querySelector('input[name="correct-' + questionId + '"]:checked');
            question.correctAnswer = correctRadio ? correctRadio.value : null;
        }
        
        currentQuiz.questions.push(question);
    });
}

function loadExistingQuizzes() {
    const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
    const quizListContainer = document.getElementById('quizList');
    
    if (quizListContainer) {
        quizListContainer.innerHTML = '';
        
        savedQuizzes.forEach(quiz => {
            const quizItem = document.createElement('div');
            quizItem.className = 'quiz-item';
            quizItem.innerHTML = `
                <div class="quiz-info">
                    <h4>${quiz.title}</h4>
                    <p>${quiz.description || 'No description'}</p>
                    <small>Created: ${new Date(quiz.createdAt).toLocaleDateString()}</small>
                    <small>Questions: ${quiz.questions.length}</small>
                </div>
                <div class="quiz-actions">
                    <button class="btn-small btn-primary" onclick="editQuiz('${quiz.id}')">Edit</button>
                    <button class="btn-small btn-secondary" onclick="duplicateQuiz('${quiz.id}')">Duplicate</button>
                    <button class="btn-small ${quiz.published ? 'btn-warning' : 'btn-success'}" onclick="togglePublish('${quiz.id}')">
                        ${quiz.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button class="btn-small btn-danger" onclick="deleteQuiz('${quiz.id}')">Delete</button>
                </div>
            `;
            quizListContainer.appendChild(quizItem);
        });
        
        if (savedQuizzes.length === 0) {
            quizListContainer.innerHTML = '<p>No quizzes created yet.</p>';
        }
    }
}

function editQuiz(quizId) {
    const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
    const quiz = savedQuizzes.find(q => q.id === quizId);
    
    if (quiz) {
        // Load quiz data into form
        document.getElementById('quizTitle').value = quiz.title;
        document.getElementById('quizDescription').value = quiz.description;
        document.getElementById('timeLimit').value = quiz.timeLimit;
        
        // Clear existing questions
        const questionsContainer = document.getElementById('questionsContainer');
        questionsContainer.innerHTML = '';
        questionCounter = 0;
        
        // Load questions
        quiz.questions.forEach(question => {
            addQuestion();
            const currentQuestionId = questionCounter;
            
            document.getElementById(`questionText-${currentQuestionId}`).value = question.text;
            document.getElementById(`questionType-${currentQuestionId}`).value = question.type;
            document.getElementById(`questionPoints-${currentQuestionId}`).value = question.points;
            document.getElementById(`questionExplanation-${currentQuestionId}`).value = question.explanation;
            
            // Update question type and load options
            updateQuestionType(currentQuestionId);
            
            if (question.type === 'multiple-choice') {
                const optionList = document.querySelector(`#questionOptions-${currentQuestionId} .option-list`);
                optionList.innerHTML = '';
                
                question.options.forEach((option, index) => {
                    const optionItem = document.createElement('div');
                    optionItem.className = 'option-item';
                    optionItem.innerHTML = `
                        <input type="radio" name="correct-${currentQuestionId}" value="${index}" ${index === question.correctAnswer ? 'checked' : ''} required>
                        <input type="text" placeholder="Option ${String.fromCharCode(65 + index)}" class="option-text" value="${option}" required>
                        <button type="button" class="btn-small btn-danger" onclick="removeOption(this)">Remove</button>
                    `;
                    optionList.appendChild(optionItem);
                });
            }
        });
        
        currentQuiz = { ...quiz };
        alert('Quiz loaded for editing.');
    }
}

function duplicateQuiz(quizId) {
    const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
    const quiz = savedQuizzes.find(q => q.id === quizId);
    
    if (quiz) {
        const duplicatedQuiz = {
            ...quiz,
            id: 'quiz_' + Date.now(),
            title: quiz.title + ' (Copy)',
            createdAt: new Date().toISOString(),
            published: false
        };
        
        savedQuizzes.push(duplicatedQuiz);
        localStorage.setItem('savedQuizzes', JSON.stringify(savedQuizzes));
        loadExistingQuizzes();
        alert('Quiz duplicated successfully!');
    }
}

function togglePublish(quizId) {
    const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
    const quiz = savedQuizzes.find(q => q.id === quizId);
    
    if (quiz) {
        quiz.published = !quiz.published;
        localStorage.setItem('savedQuizzes', JSON.stringify(savedQuizzes));
        loadExistingQuizzes();
        alert(`Quiz ${quiz.published ? 'published' : 'unpublished'} successfully!`);
    }
}

function deleteQuiz(quizId) {
    if (confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
        const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
        const filteredQuizzes = savedQuizzes.filter(q => q.id !== quizId);
        localStorage.setItem('savedQuizzes', JSON.stringify(filteredQuizzes));
        loadExistingQuizzes();
        alert('Quiz deleted successfully!');
    }
}

function clearQuizForm() {
    document.getElementById('quizTitle').value = '';
    document.getElementById('quizDescription').value = '';
    document.getElementById('timeLimit').value = '';
    document.getElementById('questionsContainer').innerHTML = '';
    questionCounter = 0;
    currentQuiz = { title: '', description: '', timeLimit: 0, questions: [] };
}

function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    alert('Logged out successfully!');
    window.location.href = '../../index.html';
}

// Add styles for quiz creator
const quizCreatorStyles = `
    .question-editor {
        background: white;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .question-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #ddd;
    }
    
    .option-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        background: #f8f9fa;
        border-radius: 5px;
    }
    
    .option-text {
        flex: 1;
        padding: 0.25rem 0.5rem;
        border: 1px solid #ddd;
        border-radius: 3px;
    }
    
    .quiz-item {
        background: white;
        padding: 1.5rem;
        margin-bottom: 1rem;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .quiz-info h4 {
        margin-bottom: 0.5rem;
        color: #333;
    }
    
    .quiz-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = quizCreatorStyles;
document.head.appendChild(styleSheet);