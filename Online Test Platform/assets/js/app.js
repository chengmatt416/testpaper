// SecureTest Application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initAntiCheat();
    initContactForm();
    initSmoothScrolling();
    
    console.log('SecureTest application initialized');
});

// Navigation functionality
function initNavigation() {
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');
    
    if (burger && navLinks) {
        burger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            burger.classList.toggle('active');
        });
        
        // Close navigation when clicking on a link
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                navLinks.classList.remove('active');
                burger.classList.remove('active');
            });
        });
    }
}

// Anti-cheat functionality
function initAntiCheat() {
    const antiCheatOverlay = document.getElementById('antiCheatOverlay');
    let warningCount = 0;
    
    // Detect when user leaves the page/tab
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && isTestEnvironment()) {
            showAntiCheatWarning();
        }
    });
    
    // Detect right-click attempts
    document.addEventListener('contextmenu', function(e) {
        if (isTestEnvironment()) {
            e.preventDefault();
            showAntiCheatWarning();
        }
    });
    
    // Detect common key combinations
    document.addEventListener('keydown', function(e) {
        if (isTestEnvironment()) {
            // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
                (e.ctrlKey && e.key === 'u')) {
                e.preventDefault();
                showAntiCheatWarning();
            }
        }
    });
    
    function isTestEnvironment() {
        // Check if user is in a test-taking environment
        return window.location.pathname.includes('take-quiz') || 
               document.body.classList.contains('test-mode');
    }
    
    function showAntiCheatWarning() {
        if (antiCheatOverlay) {
            warningCount++;
            antiCheatOverlay.style.display = 'flex';
            
            // Auto-hide after 3 seconds
            setTimeout(function() {
                antiCheatOverlay.style.display = 'none';
            }, 3000);
            
            // Log the incident (in a real app, this would be sent to server)
            console.warn(`Anti-cheat warning #${warningCount} triggered at ${new Date().toISOString()}`);
        }
    }
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
        });
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '10001',
        maxWidth: '400px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Date update functionality
function updateCurrentDate() {
    const dateElement = document.querySelector('.current-date');
    if (dateElement) {
        const currentDate = new Date().toISOString().split('T')[0];
        dateElement.textContent = `Current Date: ${currentDate}`;
    }
}

// Update date on load
updateCurrentDate();

// Quiz-specific functionality (for quiz pages)
if (window.location.pathname.includes('quiz') || window.location.pathname.includes('test')) {
    document.body.classList.add('test-mode');
    
    // Additional security measures for test environment
    window.addEventListener('beforeunload', function(e) {
        const confirmationMessage = 'Are you sure you want to leave? Your progress may be lost.';
        e.returnValue = confirmationMessage;
        return confirmationMessage;
    });
    
    // Disable text selection in test mode
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
    });
    
    // Monitor for multiple tabs/windows
    let tabChangeCount = 0;
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            tabChangeCount++;
            console.warn(`Tab change detected: ${tabChangeCount}`);
        }
    });
}

// Export functions for use in other scripts
window.SecureTest = {
    showNotification,
    isValidEmail,
    updateCurrentDate
};