// SecureTest - Main Application JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize anti-cheat measures
    initAntiCheat();
    
    // Smooth scrolling for anchor links
    initSmoothScrolling();
});

// Mobile Navigation
function initMobileNav() {
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');
    
    if (burger && navLinks) {
        burger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            burger.classList.toggle('active');
        });
    }
}

// Contact Form Handler
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Validate form
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('.btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(function() {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Anti-Cheat System
function initAntiCheat() {
    const antiCheatOverlay = document.getElementById('antiCheatOverlay');
    let warningCount = 0;
    const maxWarnings = 3;
    
    // Detect when user leaves the page/tab
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && antiCheatOverlay) {
            warningCount++;
            showAntiCheatWarning();
            
            if (warningCount >= maxWarnings) {
                // In a real implementation, this would submit the test
                console.log('Maximum warnings reached. Test would be auto-submitted.');
            }
        }
    });
    
    // Detect right-click (context menu)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        if (antiCheatOverlay) {
            showAntiCheatWarning();
        }
    });
    
    // Detect F12 and other developer shortcuts
    document.addEventListener('keydown', function(e) {
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'u')) {
            e.preventDefault();
            if (antiCheatOverlay) {
                showAntiCheatWarning();
            }
        }
    });
}

function showAntiCheatWarning() {
    const antiCheatOverlay = document.getElementById('antiCheatOverlay');
    const warningCountdown = document.getElementById('warningCountdown');
    
    if (antiCheatOverlay) {
        antiCheatOverlay.classList.add('active');
        
        let countdown = 5;
        if (warningCountdown) {
            warningCountdown.textContent = countdown;
            
            const timer = setInterval(function() {
                countdown--;
                warningCountdown.textContent = countdown;
                
                if (countdown <= 0) {
                    clearInterval(timer);
                    antiCheatOverlay.classList.remove('active');
                }
            }, 1000);
        }
        
        // Hide overlay after 5 seconds
        setTimeout(function() {
            antiCheatOverlay.classList.remove('active');
        }, 5000);
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Utility function for showing notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
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
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
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

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Prevent text selection in quiz mode (if needed)
function disableTextSelection() {
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
}

function enableTextSelection() {
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    document.body.style.mozUserSelect = '';
    document.body.style.msUserSelect = '';
}