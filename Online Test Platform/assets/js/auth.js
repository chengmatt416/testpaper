// Authentication JavaScript for SecureTest
document.addEventListener('DOMContentLoaded', function() {
    console.log('Authentication module loaded');
    
    initAuthForms();
    initValidation();
});

function initAuthForms() {
    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Registration form handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
    
    // Show/hide password functionality
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', togglePasswordVisibility);
    });
}

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Basic validation
    if (!email || !password) {
        showAuthError('Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAuthError('Please enter a valid email address');
        return;
    }
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Logging in...';
    submitButton.disabled = true;
    
    // Simulate authentication (in a real app, this would be an API call)
    setTimeout(() => {
        // Mock authentication logic
        if (email === 'admin@secureshare.com' && password === 'admin123') {
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('userEmail', email);
            window.location.href = '../admin/index.html';
        } else if (email === 'manager@secureshare.com' && password === 'manager123') {
            localStorage.setItem('userRole', 'manager');
            localStorage.setItem('userEmail', email);
            window.location.href = '../files/dashboard.html';
        } else if (email === 'user@secureshare.com' && password === 'user123') {
            localStorage.setItem('userRole', 'user');
            localStorage.setItem('userEmail', email);
            window.location.href = '../files/dashboard.html';
        } else {
            showAuthError('Invalid email or password');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }, 1500);
}

function handleRegistration(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const regCode = formData.get('regCode');
    
    // Validation
    if (!email || !password || !confirmPassword || !regCode) {
        showAuthError('Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAuthError('Please enter a valid email address');
        return;
    }
    
    if (password.length < 6) {
        showAuthError('Password must be at least 6 characters long');
        return;
    }
    
    if (password !== confirmPassword) {
        showAuthError('Passwords do not match');
        return;
    }
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Creating account...';
    submitButton.disabled = true;
    
    // Simulate registration (in a real app, this would be an API call)
    setTimeout(() => {
        // Mock registration codes
        const validCodes = ['ADMIN2024', 'MANAGER2024', 'USER2024'];
        
        if (validCodes.includes(regCode.toUpperCase())) {
            showAuthSuccess('Account created successfully! Please log in.');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showAuthError('Invalid registration code');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }, 1500);
}

function togglePasswordVisibility(e) {
    const button = e.target.closest('.toggle-password');
    const input = button.parentElement.querySelector('input');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function initValidation() {
    // Real-time email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                this.classList.add('error');
                showFieldError(this, 'Please enter a valid email address');
            } else {
                this.classList.remove('error');
                hideFieldError(this);
            }
        });
    });
    
    // Password strength indicator
    const passwordInputs = document.querySelectorAll('input[name="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            updatePasswordStrength(this);
        });
    });
}

function updatePasswordStrength(input) {
    const password = input.value;
    const strengthIndicator = input.parentElement.querySelector('.password-strength');
    
    if (!strengthIndicator) return;
    
    let strength = 0;
    let strengthText = '';
    let strengthClass = '';
    
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    switch (strength) {
        case 0:
        case 1:
            strengthText = 'Very Weak';
            strengthClass = 'very-weak';
            break;
        case 2:
            strengthText = 'Weak';
            strengthClass = 'weak';
            break;
        case 3:
            strengthText = 'Medium';
            strengthClass = 'medium';
            break;
        case 4:
            strengthText = 'Strong';
            strengthClass = 'strong';
            break;
        case 5:
            strengthText = 'Very Strong';
            strengthClass = 'very-strong';
            break;
    }
    
    strengthIndicator.textContent = strengthText;
    strengthIndicator.className = `password-strength ${strengthClass}`;
}

function showAuthError(message) {
    const errorElement = document.getElementById('errorMessage') || document.getElementById('authMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.className = 'auth-message error';
        errorElement.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    } else {
        // Fallback to notification system from main app
        if (window.SecureTest && window.SecureTest.showNotification) {
            window.SecureTest.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }
}

function showAuthSuccess(message) {
    const messageElement = document.getElementById('successMessage') || document.getElementById('authMessage');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = 'auth-message success';
        messageElement.style.display = 'block';
    } else {
        // Fallback to notification system from main app
        if (window.SecureTest && window.SecureTest.showNotification) {
            window.SecureTest.showNotification(message, 'success');
        } else {
            alert(message);
        }
    }
}

function showFieldError(field, message) {
    let errorElement = field.parentElement.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideFieldError(field) {
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Check if user is already logged in
function checkAuthStatus() {
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');
    
    if (userRole && userEmail) {
        // User is logged in, redirect to appropriate dashboard
        switch (userRole) {
            case 'admin':
                window.location.href = '../admin/index.html';
                break;
            case 'manager':
            case 'user':
                window.location.href = '../files/dashboard.html';
                break;
        }
    }
}

// Logout functionality
function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
}

// Check auth status on page load (except for registration page)
if (!window.location.pathname.includes('register.html')) {
    checkAuthStatus();
}

// Export functions for global use
window.AuthModule = {
    logout,
    checkAuthStatus,
    isValidEmail
};