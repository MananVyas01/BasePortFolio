// Typing Animation
const typingText = document.querySelector('.typing-text');
const phrases = [
    '🚀 Full Stack Developer',
    '🤖 AI/ML Engineer', 
    '🛡️ Bug Bounty Hunter',
    '☁️ Cloud Architect',
    '💡 Innovation Enthusiast'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }
    
    setTimeout(typeEffect, typeSpeed);
}

// Start typing animation
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(typeEffect, 1000);
    
    // Initialize theme
    initializeTheme();
    
    // Initialize GitHub stats animation
    initializeGitHubStats();
    
    // Initialize blog filtering
    initializeBlogFiltering();
});

// Theme Switcher
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', currentTheme);
    
    // Update toggle icon
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add theme transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
}

// GitHub Stats Animation
function initializeGitHubStats() {
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const achievementCounts = entry.target.querySelectorAll('.achievement-count');
                achievementCounts.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCounter(counter, target, 2000);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const githubStatsSection = document.querySelector('.github-stats');
    if (githubStatsSection) {
        statsObserver.observe(githubStatsSection);
    }
}

// Blog Filtering
function initializeBlogFiltering() {
    const filterButtons = document.querySelectorAll('.blog-filter-btn');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            blogPosts.forEach(post => {
                if (filterValue === 'all') {
                    post.classList.remove('hidden');
                    setTimeout(() => {
                        post.style.display = 'block';
                    }, 300);
                } else {
                    const postCategory = post.getAttribute('data-category');
                    if (postCategory === filterValue) {
                        post.classList.remove('hidden');
                        setTimeout(() => {
                            post.style.display = 'block';
                        }, 300);
                    } else {
                        post.classList.add('hidden');
                        setTimeout(() => {
                            post.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
    
    // Newsletter signup
    const newsletterForm = document.querySelector('.newsletter-signup');
    if (newsletterForm) {
        const emailInput = newsletterForm.querySelector('input');
        const subscribeBtn = newsletterForm.querySelector('button');
        
        subscribeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                // Simulate subscription
                const originalText = subscribeBtn.innerHTML;
                subscribeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
                subscribeBtn.disabled = true;
                
                setTimeout(() => {
                    showNotification('Thank you for subscribing! You\'ll receive our latest articles.', 'success');
                    emailInput.value = '';
                    subscribeBtn.innerHTML = originalText;
                    subscribeBtn.disabled = false;
                }, 1500);
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const body = document.body;

hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scrolling when menu is open
    if (navMenu.classList.contains('active')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = 'auto';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = 'auto';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = 'auto';
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = 'auto';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(26, 26, 46, 0.98)';
    } else {
        navbar.style.background = 'rgba(26, 26, 46, 0.95)';
    }
});

// Skill level animation on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const skillObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillItems = entry.target.querySelectorAll('.skill-item');
            skillItems.forEach((item, index) => {
                setTimeout(() => {
                    const level = item.getAttribute('data-level');
                    const skillLevel = item.querySelector('.skill-level');
                    if (skillLevel) {
                        skillLevel.style.setProperty('--level', level + '%');
                        item.classList.add('animate');
                    }
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Observe skills section
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    skillObserver.observe(skillsSection);
}

// Projects filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (filterValue === 'all') {
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.display = 'block';
                }, 300);
            } else {
                const cardCategory = card.getAttribute('data-category');
                if (cardCategory === filterValue) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.display = 'block';
                    }, 300);
                } else {
                    card.classList.add('hidden');
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            }
        });
    });
});

// Enhanced Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Store form data for success page
        window.contactFormData = {
            name,
            email,
            subject,
            message,
            mailtoLink: `mailto:mananvyas.work@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`
        };
        
        // Show success form
        showFormSuccess();
    });
}

// Contact method tabs functionality
const contactTabs = document.querySelectorAll('.contact-tab');
const contactMethods = document.querySelectorAll('.contact-method');

contactTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        const method = this.dataset.method;
        
        // Update active tab
        contactTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Update active method
        contactMethods.forEach(m => m.classList.remove('active'));
        document.getElementById(`${method}Method`).classList.add('active');
    });
});

// Form success handling
function showFormSuccess() {
    const formSuccess = document.getElementById('formSuccess');
    const form = document.getElementById('contactForm');
    
    if (formSuccess && form) {
        form.style.display = 'none';
        formSuccess.classList.remove('hidden');
    }
}

// Open email client button
const openMailClientBtn = document.getElementById('openMailClient');
if (openMailClientBtn) {
    openMailClientBtn.addEventListener('click', function() {
        if (window.contactFormData) {
            window.open(window.contactFormData.mailtoLink);
            showNotification('Opening your email client...', 'success');
        }
    });
}

// Copy email content button
const copyEmailContentBtn = document.getElementById('copyEmailContent');
if (copyEmailContentBtn) {
    copyEmailContentBtn.addEventListener('click', function() {
        if (window.contactFormData) {
            const emailContent = `To: mananvyas.work@gmail.com
Subject: ${window.contactFormData.subject}

Name: ${window.contactFormData.name}
Email: ${window.contactFormData.email}

Message:
${window.contactFormData.message}`;
            
            copyToClipboard(emailContent, 'Email content copied to clipboard!');
        }
    });
}

// Copy email address buttons
const copyEmailBtns = document.querySelectorAll('#copyEmail, #copyDirectEmail');
copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        copyToClipboard('mananvyas.work@gmail.com', 'Email address copied to clipboard!');
    });
});

// Webmail buttons
const openGmailBtn = document.getElementById('openGmail');
if (openGmailBtn) {
    openGmailBtn.addEventListener('click', function() {
        const gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=mananvyas.work@gmail.com';
        window.open(gmailUrl, '_blank');
        showNotification('Opening Gmail...', 'success');
    });
}

const openOutlookBtn = document.getElementById('openOutlook');
if (openOutlookBtn) {
    openOutlookBtn.addEventListener('click', function() {
        const outlookUrl = 'https://outlook.live.com/owa/?path=/mail/action/compose&to=mananvyas.work@gmail.com';
        window.open(outlookUrl, '_blank');
        showNotification('Opening Outlook...', 'success');
    });
}

// Copy to clipboard utility function
function copyToClipboard(text, successMessage = 'Copied to clipboard!') {
    if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API
        navigator.clipboard.writeText(text).then(() => {
            showNotification(successMessage, 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text, successMessage);
        });
    } else {
        // Fallback for older browsers or non-secure contexts
        fallbackCopyToClipboard(text, successMessage);
    }
}

// Fallback copy function
function fallbackCopyToClipboard(text, successMessage) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification(successMessage, 'success');
    } catch (err) {
        showNotification('Unable to copy. Please select and copy manually.', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Enhanced Notification system for mobile
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Detect if mobile
    const isMobile = window.innerWidth <= 768;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        ${isMobile ? 'top: 10px; left: 10px; right: 10px;' : 'top: 20px; right: 20px; max-width: 350px;'}
        background: linear-gradient(135deg, #00d9ff, #ff006e);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 9999;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transform: ${isMobile ? 'translateY(-100px)' : 'translateX(400px)'};
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = isMobile ? 'translateY(0)' : 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = isMobile ? 'translateY(-100px)' : 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = isMobile ? 'translateY(-100px)' : 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Scroll to top button
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.pointerEvents = 'auto';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.pointerEvents = 'none';
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Intersection Observer for animations
const animationObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe elements for animation
document.querySelectorAll('.stat-card, .project-card, .skill-category, .about-text').forEach(el => {
    animationObserver.observe(el);
});

// Parallax effect for hero background
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-background');
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Add hover effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Dynamic stats counter animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                if (!isNaN(target)) {
                    animateCounter(stat, target);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutStats = document.querySelector('.about-stats');
if (aboutStats) {
    statsObserver.observe(aboutStats);
}

// Add loading animation
window.addEventListener('load', function() {
    const loadingScreen = document.createElement('div');
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;
    
    loadingScreen.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 50px; height: 50px; border: 3px solid rgba(0, 217, 255, 0.3); border-top: 3px solid #00d9ff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <h3 style="color: #00d9ff; margin: 0;">Loading Portfolio...</h3>
        </div>
    `;
    
    // Add keyframes for loading animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(loadingScreen);
    
    // Hide loading screen after a short delay
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(loadingScreen)) {
                document.body.removeChild(loadingScreen);
            }
        }, 500);
    }, 1500);
});

// Enhanced floating icons animation
document.querySelectorAll('.floating-icon').forEach((icon, index) => {
    icon.style.animationDelay = `${index * 0.5}s`;
    
    // Add interactive hover effects
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.2)';
        this.style.animationPlayState = 'paused';
    });
    
    icon.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.animationPlayState = 'running';
    });
});

// Console welcome message
console.log(`
🚀 Welcome to Manan Vyas' Portfolio!
👨‍💻 Full Stack Developer & AI Enthusiast
🛡️ Bug Bounty Hunter
☁️ Cloud Architect

📧 Contact: mananvyas.work@gmail.com
🌐 GitHub: https://github.com/MananVyas01
💼 LinkedIn: https://www.linkedin.com/in/mananvyas0110

"Code with purpose, innovate with passion! 💫"
`);

// Add custom cursor effect
document.addEventListener('mousemove', function(e) {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
        const newCursor = document.createElement('div');
        newCursor.className = 'custom-cursor';
        newCursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(0, 217, 255, 0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(newCursor);
    }
    
    const cursorElement = document.querySelector('.custom-cursor');
    if (cursorElement) {
        cursorElement.style.left = e.clientX - 10 + 'px';
        cursorElement.style.top = e.clientY - 10 + 'px';
    }
});

// Easter egg - Konami code
let konamiCode = '';
const konami = '38384040373937396665';

document.addEventListener('keydown', function(e) {
    konamiCode += e.keyCode;
    if (konamiCode.length > konami.length) {
        konamiCode = konamiCode.substr(konamiCode.length - konami.length);
    }
    if (konamiCode === konami) {
        showNotification('🎉 Konami Code activated! You found the easter egg!', 'success');
        // Add special effect
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// Add rainbow animation for easter egg
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// Mobile-specific enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Add mobile class to body
        document.body.classList.add('mobile-device');
        
        // Optimize animations for mobile
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (reduceMotion.matches) {
            document.body.classList.add('reduce-motion');
        }
        
        // Add lazy loading to images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
        
        // Add touch event handling for better mobile interaction
        document.querySelectorAll('.project-card, .skill-item, .stat-card').forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            });
        });
        
        // Optimize scroll performance
        let ticking = false;
        function updateScrollElements() {
            // Update scroll-dependent elements
            const scrolled = window.pageYOffset;
            const navbar = document.querySelector('.navbar');
            
            if (scrolled > 100) {
                navbar.style.background = 'rgba(26, 26, 46, 0.98)';
            } else {
                navbar.style.background = 'rgba(26, 26, 46, 0.95)';
            }
            
            ticking = false;
        }
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateScrollElements);
                ticking = true;
            }
        });
        
        // Add orientation change handler
        window.addEventListener('orientationchange', function() {
            setTimeout(() => {
                // Recalculate heights and positions after orientation change
                const heroHeight = window.innerHeight;
                document.documentElement.style.setProperty('--vh', `${heroHeight * 0.01}px`);
                
                // Close mobile menu if open
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }, 100);
        });
        
        // Add viewport height fix for mobile browsers
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);
    }
    
    // Enhanced form submission for mobile
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Simulate form processing
            setTimeout(() => {
                // Create mailto link
                const mailtoLink = `mailto:mananvyas.work@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
                
                // Open email client
                window.open(mailtoLink);
                
                // Show success message
                showNotification('Thank you for your message! Your email client should open now.', 'success');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });
    }
});

// Enhanced Blog Management System
class BlogManager {
    constructor() {
        this.blogData = null;
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        await this.loadBlogData();
        this.setupFilters();
        this.setupAutoRefresh();
        this.addLastUpdatedInfo();
    }

    async loadBlogData() {
        try {
            const response = await fetch('./blog-data.json?t=' + Date.now());
            if (response.ok) {
                this.blogData = await response.json();
                console.log('✅ Blog data loaded successfully');
                this.updateLastUpdatedInfo();
            } else {
                console.log('📝 Using static blog content');
            }
        } catch (error) {
            console.log('📝 Using static blog content - dynamic data not available');
        }
    }

    addLastUpdatedInfo() {
        const blogIntro = document.querySelector('.blog-intro');
        if (blogIntro && !document.querySelector('.blog-last-updated')) {
            const lastUpdatedEl = document.createElement('div');
            lastUpdatedEl.className = 'blog-last-updated';
            lastUpdatedEl.style.cssText = `
                color: var(--text-muted); 
                font-size: 0.9rem; 
                margin-top: 1rem; 
                text-align: center;
                padding: 0.5rem;
                background: var(--bg-card);
                border-radius: 8px;
                border: 1px solid var(--border-color);
            `;
            lastUpdatedEl.innerHTML = `<i class="fas fa-sync-alt"></i> <span id="lastUpdatedText">Checking for updates...</span>`;
            blogIntro.appendChild(lastUpdatedEl);
        }
    }

    updateLastUpdatedInfo() {
        const lastUpdatedEl = document.getElementById('lastUpdatedText');
        if (!lastUpdatedEl || !this.blogData) return;

        const lastUpdated = new Date(this.blogData.lastUpdated);
        const timeAgo = this.getTimeAgo(lastUpdated);
        
        lastUpdatedEl.innerHTML = `Last updated: ${timeAgo} • ${this.blogData.totalPosts} posts from ${this.blogData.sources.length} sources`;
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 2) return '1 hour ago';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        if (diffInHours < 48) return 'Yesterday';
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        
        return `${Math.floor(diffInDays / 30)} months ago`;
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.blog-filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterPosts(filter);
                
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update URL without page reload
                if (history.pushState) {
                    const newUrl = filter === 'all' ? '#blog' : `#blog?filter=${filter}`;
                    history.pushState(null, null, newUrl);
                }
            });
        });

        // Handle URL-based filtering
        this.handleUrlFilter();
    }

    handleUrlFilter() {
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        const filter = urlParams.get('filter');
        if (filter) {
            this.filterPosts(filter);
            // Update active button
            const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
            if (activeBtn) {
                document.querySelectorAll('.blog-filter-btn').forEach(b => b.classList.remove('active'));
                activeBtn.classList.add('active');
            }
        }
    }

    filterPosts(category) {
        this.currentFilter = category;
        const posts = document.querySelectorAll('.blog-post');
        let visibleCount = 0;
        
        posts.forEach(post => {
            const postCategory = post.dataset.category;
            const shouldShow = category === 'all' || postCategory === category;
            
            if (shouldShow) {
                post.classList.remove('hidden');
                post.style.animation = 'slideInUp 0.5s ease forwards';
                visibleCount++;
            } else {
                post.classList.add('hidden');
            }
        });

        // Update filter stats
        this.updateFilterStats(category, visibleCount);
    }

    updateFilterStats(category, count) {
        const statsEl = document.querySelector('.blog-filter-stats');
        if (statsEl) {
            statsEl.textContent = category === 'all' ? 
                `Showing all ${count} posts` : 
                `Showing ${count} ${category} posts`;
        }
    }

    setupAutoRefresh() {
        // Check for updates every 30 minutes
        setInterval(() => {
            this.checkForUpdates();
        }, 30 * 60 * 1000);

        // Add manual refresh button
        this.addRefreshButton();
    }

    addRefreshButton() {
        const blogFilter = document.querySelector('.blog-filter');
        if (blogFilter && !document.querySelector('.blog-refresh-btn')) {
            const refreshBtn = document.createElement('button');
            refreshBtn.className = 'blog-refresh-btn blog-filter-btn';
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
            refreshBtn.title = 'Check for new blog posts';
            refreshBtn.addEventListener('click', () => this.manualRefresh());
            blogFilter.appendChild(refreshBtn);
        }
    }

    async checkForUpdates() {
        try {
            const response = await fetch('./blog-data.json?t=' + Date.now());
            if (response.ok) {
                const newData = await response.json();
                
                if (this.blogData && new Date(newData.lastUpdated) > new Date(this.blogData.lastUpdated)) {
                    this.showUpdateNotification();
                    this.blogData = newData;
                    this.updateLastUpdatedInfo();
                }
            }
        } catch (error) {
            console.log('Could not check for blog updates');
        }
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'blog-update-notification';
        notification.innerHTML = `
            <div style="
                background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); 
                color: white; 
                padding: 1rem; 
                border-radius: 12px; 
                margin: 1rem 0; 
                text-align: center;
                box-shadow: 0 4px 15px rgba(0, 217, 255, 0.3);
                animation: slideInUp 0.5s ease;
            ">
                <i class="fas fa-sparkles"></i> New blog posts available! 
                <button onclick="location.reload()" style="
                    background: white; 
                    color: var(--accent-primary); 
                    border: none; 
                    padding: 0.5rem 1rem; 
                    border-radius: 6px; 
                    margin-left: 1rem; 
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    Refresh Page
                </button>
            </div>
        `;
        
        const blogSection = document.querySelector('.blog');
        if (blogSection) {
            blogSection.insertBefore(notification, blogSection.firstChild);
            setTimeout(() => {
                notification.style.animation = 'fadeOut 0.5s ease';
                setTimeout(() => notification.remove(), 500);
            }, 10000);
        }
    }

    async manualRefresh() {
        const refreshBtn = document.querySelector('.blog-refresh-btn');
        const refreshIcon = refreshBtn?.querySelector('i');
        
        if (refreshIcon) {
            refreshIcon.classList.add('fa-spin');
            refreshBtn.disabled = true;
        }

        try {
            await this.loadBlogData();
            showNotification('✅ Blog content refreshed!', 'success');
        } catch (error) {
            showNotification('❌ Failed to refresh blog content', 'error');
        } finally {
            if (refreshIcon) {
                setTimeout(() => {
                    refreshIcon.classList.remove('fa-spin');
                    refreshBtn.disabled = false;
                }, 1000);
            }
        }
    }

    // Add blog post interaction tracking
    trackBlogInteraction(postTitle, action) {
        // You can integrate with analytics here
        console.log(`Blog interaction: ${action} on "${postTitle}"`);
    }
}

// Initialize Blog Manager
document.addEventListener('DOMContentLoaded', () => {
    const blogManager = new BlogManager();
    
    // Add click tracking to blog posts
    document.addEventListener('click', (e) => {
        const blogPost = e.target.closest('.blog-post');
        if (blogPost) {
            const title = blogPost.querySelector('h3')?.textContent || 'Unknown Post';
            const readMoreLink = e.target.closest('.read-more');
            
            if (readMoreLink) {
                blogManager.trackBlogInteraction(title, 'read-more-click');
            }
        }
    });
});

// Add CSS for blog animations
const blogStyles = document.createElement('style');
blogStyles.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }
    
    .blog-refresh-btn {
        position: relative;
        overflow: hidden;
    }
    
    .blog-refresh-btn:hover {
        background: var(--accent-primary) !important;
        color: var(--bg-primary) !important;
    }
    
    .blog-refresh-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .blog-last-updated {
        animation: slideInUp 0.5s ease;
    }
    
    .blog-post {
        transition: all 0.3s ease;
    }
    
    .blog-post.hidden {
        opacity: 0;
        transform: scale(0.95);
        pointer-events: none;
    }
`;
document.head.appendChild(blogStyles);
