// SecureTest - Authentication JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize login form
    initLoginForm();
    
    // Initialize password toggle
    initPasswordToggle();
    
    // Initialize registration form if present
    initRegistrationForm();
});

// Login Form Handler
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember')?.checked;
            
            // Validate form
            if (!email || !password) {
                showError('Please fill in all fields.');
                return;
            }
            
            // Validate email format
            if (!isValidEmail(email)) {
                showError('Please enter a valid email address.');
                return;
            }
            
            // Show loading state
            const submitBtn = loginForm.querySelector('.btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;
            
            // Simulate authentication
            setTimeout(function() {
                // Demo credentials for testing
                if (email === 'admin@securetest.com' && password === 'admin123') {
                    // Successful login
                    hideError();
                    localStorage.setItem('userRole', 'admin');
                    localStorage.setItem('userEmail', email);
                    if (remember) {
                        localStorage.setItem('rememberMe', 'true');
                    }
                    
                    // Redirect to admin panel
                    window.location.href = '../admin/index.html';
                    
                } else if (email === 'editor@securetest.com' && password === 'editor123') {
                    // Successful login
                    hideError();
                    localStorage.setItem('userRole', 'editor');
                    localStorage.setItem('userEmail', email);
                    if (remember) {
                        localStorage.setItem('rememberMe', 'true');
                    }
                    
                    // Redirect to editor panel
                    window.location.href = '../editor/create-quiz.html';
                    
                } else if (email === 'student@securetest.com' && password === 'student123') {
                    // Successful login
                    hideError();
                    localStorage.setItem('userRole', 'student');
                    localStorage.setItem('userEmail', email);
                    if (remember) {
                        localStorage.setItem('rememberMe', 'true');
                    }
                    
                    // Redirect to student dashboard
                    window.location.href = '../tester/take-quiz.html';
                    
                } else {
                    // Failed login
                    showError('Invalid email or password. Please try again.');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }, 1500);
        });
    }
    
    function showError(message) {
        if (errorMessage) {
            errorMessage.querySelector('p').textContent = message;
            errorMessage.style.display = 'block';
        }
    }
    
    function hideError() {
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }
}

// Registration Form Handler
function initRegistrationForm() {
    const registrationForm = document.getElementById('registrationForm');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name')?.value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword')?.value;
            const regCode = document.getElementById('regCode')?.value;
            
            // Validate form
            if (!name || !email || !password || !confirmPassword || !regCode) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            // Validate email format
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Validate password strength
            if (password.length < 8) {
                showNotification('Password must be at least 8 characters long.', 'error');
                return;
            }
            
            // Validate password confirmation
            if (password !== confirmPassword) {
                showNotification('Passwords do not match.', 'error');
                return;
            }
            
            // Validate registration code (demo codes)
            const validCodes = ['ADMIN2025', 'EDITOR2025', 'STUDENT2025'];
            if (!validCodes.includes(regCode.toUpperCase())) {
                showNotification('Invalid registration code.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = registrationForm.querySelector('.btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Creating Account...';
            submitBtn.disabled = true;
            
            // Simulate registration
            setTimeout(function() {
                showNotification('Account created successfully! Please login.', 'success');
                
                // Redirect to login page after success
                setTimeout(function() {
                    window.location.href = 'login.html';
                }, 2000);
            }, 2000);
        });
    }
}

// Password Toggle Functionality
function initPasswordToggle() {
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon
            if (type === 'text') {
                passwordToggle.classList.remove('fa-eye-slash');
                passwordToggle.classList.add('fa-eye');
            } else {
                passwordToggle.classList.remove('fa-eye');
                passwordToggle.classList.add('fa-eye-slash');
            }
        });
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Auto-fill remembered credentials
function initRememberedCredentials() {
    const emailInput = document.getElementById('email');
    const rememberCheckbox = document.getElementById('remember');
    
    if (localStorage.getItem('rememberMe') === 'true') {
        const savedEmail = localStorage.getItem('userEmail');
        if (savedEmail && emailInput) {
            emailInput.value = savedEmail;
        }
        if (rememberCheckbox) {
            rememberCheckbox.checked = true;
        }
    }
}

// Check if user is already logged in
function checkExistingSession() {
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');
    
    if (userRole && userEmail) {
        // User is already logged in, redirect to appropriate dashboard
        switch (userRole) {
            case 'admin':
                window.location.href = '../admin/index.html';
                break;
            case 'editor':
                window.location.href = '../editor/create-quiz.html';
                break;
            case 'student':
                window.location.href = '../tester/take-quiz.html';
                break;
        }
    }
}

// Logout functionality
function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rememberMe');
    window.location.href = '../../index.html';
}

// Show notification function (same as in app.js)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#667eea'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize remembered credentials and check existing session when page loads
document.addEventListener('DOMContentLoaded', function() {
    initRememberedCredentials();
    // checkExistingSession(); // Uncomment to auto-redirect logged in users
});