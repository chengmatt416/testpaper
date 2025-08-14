// Authentication JavaScript for SecureTest Platform

document.addEventListener('DOMContentLoaded', function() {
    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (!email || !password) {
                showMessage('Please fill in all fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate login process
            showMessage('Logging in...', 'info');
            
            // Mock authentication - In real app, this would be an API call
            setTimeout(() => {
                if (email === 'admin@test.com' && password === 'admin123') {
                    localStorage.setItem('userRole', 'admin');
                    localStorage.setItem('userEmail', email);
                    showMessage('Login successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = '../admin/index.html';
                    }, 1500);
                } else if (email === 'editor@test.com' && password === 'editor123') {
                    localStorage.setItem('userRole', 'editor');
                    localStorage.setItem('userEmail', email);
                    showMessage('Login successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = '../editor/create-quiz.html';
                    }, 1500);
                } else if (email === 'student@test.com' && password === 'student123') {
                    localStorage.setItem('userRole', 'tester');
                    localStorage.setItem('userEmail', email);
                    showMessage('Login successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = '../tester/take-quiz.html';
                    }, 1500);
                } else {
                    showMessage('Invalid email or password.', 'error');
                }
            }, 1500);
        });
    }

    // Registration form handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const regCode = document.getElementById('regCode').value;
            
            // Basic validation
            if (!name || !email || !password || !confirmPassword || !regCode) {
                showMessage('Please fill in all fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Password validation
            if (password.length < 8) {
                showMessage('Password must be at least 8 characters long.', 'error');
                return;
            }
            
            // Confirm password
            if (password !== confirmPassword) {
                showMessage('Passwords do not match.', 'error');
                return;
            }
            
            // Registration code validation (mock)
            const validCodes = ['TEST2024', 'STUDENT2024', 'EDITOR2024'];
            if (!validCodes.includes(regCode.toUpperCase())) {
                showMessage('Invalid registration code.', 'error');
                return;
            }
            
            // Simulate registration process
            showMessage('Creating account...', 'info');
            
            setTimeout(() => {
                // Mock successful registration
                showMessage('Account created successfully! Please login.', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }, 2000);
        });
    }

    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Check if user is already logged in
    checkAuthStatus();
});

function showMessage(message, type) {
    const messageElement = document.getElementById('authMessage');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        messageElement.style.display = 'block';
        
        // Auto-hide success and info messages
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 3000);
        }
    } else {
        // Fallback to alert if message element doesn't exist
        alert(message);
    }
}

function checkAuthStatus() {
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');
    
    if (userRole && userEmail) {
        // User is already logged in, redirect to appropriate dashboard
        const currentPath = window.location.pathname;
        
        // Don't redirect if already on a dashboard page
        if (!currentPath.includes('/admin/') && 
            !currentPath.includes('/editor/') && 
            !currentPath.includes('/tester/')) {
            
            switch (userRole) {
                case 'admin':
                    window.location.href = '../admin/index.html';
                    break;
                case 'editor':
                    window.location.href = '../editor/create-quiz.html';
                    break;
                case 'tester':
                    window.location.href = '../tester/take-quiz.html';
                    break;
            }
        }
    }
}

function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('currentQuiz');
    showMessage('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.href = '../../index.html';
    }, 1500);
}

// Demo credentials info
function showDemoCredentials() {
    const demoInfo = `
Demo Credentials:

Admin:
Email: admin@test.com
Password: admin123

Editor:
Email: editor@test.com
Password: editor123

Student:
Email: student@test.com
Password: student123

Registration Codes:
TEST2024, STUDENT2024, EDITOR2024
    `;
    
    alert(demoInfo);
}

// Add demo credentials button if in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', function() {
        const authForm = document.querySelector('.auth-form');
        if (authForm) {
            const demoButton = document.createElement('button');
            demoButton.type = 'button';
            demoButton.textContent = 'Show Demo Credentials';
            demoButton.className = 'btn secondary';
            demoButton.style.marginTop = '1rem';
            demoButton.onclick = showDemoCredentials;
            authForm.appendChild(demoButton);
        }
    });
}