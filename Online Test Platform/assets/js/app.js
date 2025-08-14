// SecureTest - Main Application JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');
    
    if (burger && navLinks) {
        burger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Animate burger lines
            burger.classList.toggle('active');
        });
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Simulate form submission
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    burger.classList.remove('active');
                }
            }
        });
    });

    // Update current date in footer
    const currentDateElement = document.querySelector('.current-date');
    if (currentDateElement) {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        currentDateElement.textContent = `Current Date: ${formattedDate}`;
    }

    // Basic anti-cheat detection for demonstration
    let suspiciousActivity = 0;
    const antiCheatOverlay = document.getElementById('antiCheatOverlay');

    // Detect when user leaves the tab/window
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            suspiciousActivity++;
            console.log('Suspicious activity detected: Tab/Window focus lost');
            
            if (suspiciousActivity > 2 && antiCheatOverlay) {
                showAntiCheatWarning();
            }
        }
    });

    // Detect right-click attempts (disabled during tests)
    document.addEventListener('contextmenu', function(e) {
        if (window.location.pathname.includes('take-quiz')) {
            e.preventDefault();
            suspiciousActivity++;
            
            if (suspiciousActivity > 1 && antiCheatOverlay) {
                showAntiCheatWarning();
            }
        }
    });

    // Detect keyboard shortcuts that might be used for cheating
    document.addEventListener('keydown', function(e) {
        if (window.location.pathname.includes('take-quiz')) {
            // Disable F12 (Developer Tools)
            if (e.key === 'F12') {
                e.preventDefault();
                suspiciousActivity++;
            }
            
            // Disable Ctrl+Shift+I (Developer Tools)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                suspiciousActivity++;
            }
            
            // Disable Ctrl+U (View Source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                suspiciousActivity++;
            }
            
            // Disable Ctrl+S (Save)
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                suspiciousActivity++;
            }
            
            if (suspiciousActivity > 0 && antiCheatOverlay) {
                showAntiCheatWarning();
            }
        }
    });

    function showAntiCheatWarning() {
        if (antiCheatOverlay) {
            antiCheatOverlay.classList.add('active');
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                antiCheatOverlay.classList.remove('active');
            }, 3000);
        }
    }

    // Feature card hover effects
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards for scroll animations
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Console warning for security
    console.log('%cSecureTest Platform', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%cWarning: This is a secure testing platform. Any attempts to manipulate or cheat will be logged and reported.', 'color: red; font-size: 14px;');
});

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#667eea'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);