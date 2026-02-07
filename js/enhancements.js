// Enhanced Portfolio JavaScript with Auto-Sliding and Animations

// Auto-Slide Project Cards
function initProjectSliders() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, cardIndex) => {
        const slides = card.querySelectorAll('.project-image-slide');
        
        if (slides.length <= 1) return;
        
        let currentSlide = 0;
        
        // Auto-advance slides
        const slideInterval = setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 3000); // Change slide every 3 seconds
        
        // Pause on hover
        card.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        card.addEventListener('mouseleave', () => {
            // Resume sliding when mouse leaves
            const newInterval = setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, 3000);
            
            // Store interval ID to clear later if needed
            card.dataset.slideInterval = newInterval;
        });
    });
}

// Auto-Scroll Projects Grid
function initAutoScrollProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;
    
    const cards = projectsGrid.querySelectorAll('.project-card');
    if (cards.length <= 1) return;
    
    let currentIndex = 0;
    let isUserScrolling = false;
    let scrollTimeout;
    
    // Auto-scroll function
    function autoScroll() {
        if (isUserScrolling) return;
        
        currentIndex = (currentIndex + 1) % cards.length;
        
        const card = cards[currentIndex];
        if (card) {
            card.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }
    
    // Start auto-scrolling every 5 seconds
    let autoScrollInterval = setInterval(autoScroll, 5000);
    
    // Detect user scrolling
    projectsGrid.addEventListener('scroll', () => {
        isUserScrolling = true;
        clearInterval(autoScrollInterval);
        clearTimeout(scrollTimeout);
        
        // Resume auto-scroll after 10 seconds of no user interaction
        scrollTimeout = setTimeout(() => {
            isUserScrolling = false;
            autoScrollInterval = setInterval(autoScroll, 5000);
        }, 10000);
    });
    
    // Pause on hover
    projectsGrid.addEventListener('mouseenter', () => {
        clearInterval(autoScrollInterval);
    });
    
    projectsGrid.addEventListener('mouseleave', () => {
        if (!isUserScrolling) {
            autoScrollInterval = setInterval(autoScroll, 5000);
        }
    });
}

// Enhanced Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards
    document.querySelectorAll('.section, .skill-card, .contact-card').forEach(el => {
        observer.observe(el);
    });
}

// Smooth Reveal Animations for Skills
function initSkillsAnimation() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('skill-reveal');
    });
}

// Parallax Effect for Hero Section
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = hero.querySelectorAll('.parallax');
        
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Typing Animation for Hero Title
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const text = typingElement.textContent;
    typingElement.textContent = '';
    typingElement.style.opacity = '1';
    
    let index = 0;
    
    function type() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        }
    }
    
    setTimeout(type, 500);
}

// Enhanced Contact Card Hover Effects
function initContactCardEffects() {
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function(e) {
            this.style.transform = '';
        });
    });
}

// Initialize all enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for projects to be loaded
    setTimeout(() => {
        initProjectSliders();
        initAutoScrollProjects();
    }, 500);
    
    initScrollAnimations();
    initSkillsAnimation();
    initParallax();
    initContactCardEffects();
    
    // Optional: Typing animation for hero
    // initTypingAnimation();
});

// CSS to add to your stylesheet
const enhancedStyles = `
    /* Scroll Animation Base */
    .section {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .section.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Skill Card Reveal Animation */
    .skill-card {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        animation: skillReveal 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    
    @keyframes skillReveal {
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    /* Enhanced Project Card Transitions */
    .project-card {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
    }
    
    .project-card:hover {
        transform: translateY(-16px) scale(1.03);
        box-shadow: 0 30px 60px rgba(99, 102, 241, 0.3);
    }
    
    /* Smooth Image Transitions */
    .project-image-slide {
        transition: opacity 1s ease-in-out;
    }
    
    /* Contact Card Pulse Animation */
    .contact-card {
        animation: subtlePulse 3s ease-in-out infinite;
    }
    
    @keyframes subtlePulse {
        0%, 100% {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        50% {
            box-shadow: 0 8px 30px rgba(99, 102, 241, 0.15);
        }
    }
    
    /* Gradient Background Animation */
    @keyframes gradientShift {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }
    
    .animated-gradient {
        background-size: 200% 200%;
        animation: gradientShift 15s ease infinite;
    }
    
    /* Fade In Up Animation */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in-up {
        animation: fadeInUp 0.8s ease-out;
    }
    
    /* Smooth Scroll Indicator Animation */
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }
    
    .scroll-indicator {
        animation: bounce 2s infinite;
    }
`;

// Add styles to page (optional - can be added directly to CSS)
function addEnhancedStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = enhancedStyles;
    document.head.appendChild(styleSheet);
}

// Uncomment to add styles dynamically
// addEnhancedStyles();
