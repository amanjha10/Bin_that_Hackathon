// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth Scrolling for Navigation Links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset - 70;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Link Highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// Service Card Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards and bin cards
document.querySelectorAll('.service-card, .bin-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const phone = contactForm.querySelector('input[type="tel"]').value;
    const message = contactForm.querySelector('textarea').value;
    
    // Simple validation
    if (!name || !email || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    const submitButton = contactForm.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        contactForm.reset();
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
    }, 2000);
});

// Service Card Learn More Buttons
document.querySelectorAll('.card-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const serviceCard = e.target.closest('.service-card');
        const serviceName = serviceCard.querySelector('h3').textContent;
        showNotification(`Learn more about ${serviceName} - Coming soon!`, 'info');
    });
});

// CTA Button Action
document.querySelector('.cta-button').addEventListener('click', () => {
    const contactSection = document.querySelector('#contact');
    const offsetTop = contactSection.getBoundingClientRect().top + window.pageYOffset - 70;
    
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    const styles = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: '300px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    };
    
    // Set background color based on type
    switch (type) {
        case 'success':
            styles.backgroundColor = '#27ae60';
            break;
        case 'error':
            styles.backgroundColor = '#e74c3c';
            break;
        case 'info':
            styles.backgroundColor = '#3498db';
            break;
        default:
            styles.backgroundColor = '#95a5a6';
    }
    
    // Apply styles
    Object.assign(notification.style, styles);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;
    
    closeButton.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Counter Animation for Stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString() + (element.textContent.includes('%') ? '%' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString() + (element.textContent.includes('%') ? '%' : '+');
        }
    }, 16);
}

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat h3');
                counters.forEach(counter => {
                    const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
                    counter.textContent = '0';
                    animateCounter(counter, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroPlaceholder = document.querySelector('.hero-placeholder');
    
    if (hero && heroPlaceholder) {
        const rate = scrolled * -0.5;
        heroPlaceholder.style.transform = `translateY(${rate}px)`;
    }
});

// Search Functionality (for future implementation)
function initializeSearch() {
    // This can be expanded later for site-wide search
    console.log('Search functionality ready for implementation');
}

// Accessibility Improvements
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Enter key on hamburger menu
    if (e.key === 'Enter' && e.target === hamburger) {
        hamburger.click();
    }
});

// Focus management for mobile menu
hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hamburger.click();
    }
});

// Waste Calculator (Interactive Feature)
function createWasteCalculator() {
    const calculatorHTML = `
        <div class="waste-calculator" style="
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            margin: 30px 0;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        ">
            <h3 style="color: #2c3e50; margin-bottom: 20px; text-align: center;">
                Weekly Waste Calculator
            </h3>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #666;">
                    Household Members:
                </label>
                <input type="number" id="members" min="1" max="20" value="4" style="
                    width: 100%;
                    padding: 10px;
                    border: 2px solid #ecf0f1;
                    border-radius: 5px;
                ">
            </div>
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; color: #666;">
                    Waste Reduction Goal (%):
                </label>
                <input type="range" id="reduction" min="0" max="50" value="20" style="width: 100%;">
                <span id="reductionValue" style="color: #27ae60; font-weight: bold;">20%</span>
            </div>
            <button onclick="calculateWaste()" style="
                background: linear-gradient(135deg, #27ae60, #2ecc71);
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                width: 100%;
                font-size: 16px;
            ">
                Calculate Impact
            </button>
            <div id="calculatorResult" style="margin-top: 20px; text-align: center;"></div>
        </div>
    `;
    
    // Add calculator to awareness section
    const awarenessSection = document.querySelector('.awareness .container');
    if (awarenessSection) {
        awarenessSection.insertAdjacentHTML('beforeend', calculatorHTML);
        
        // Update reduction value display
        const reductionSlider = document.getElementById('reduction');
        const reductionValue = document.getElementById('reductionValue');
        
        reductionSlider.addEventListener('input', (e) => {
            reductionValue.textContent = e.target.value + '%';
        });
    }
}

// Calculate waste impact
function calculateWaste() {
    const members = parseInt(document.getElementById('members').value) || 4;
    const reduction = parseInt(document.getElementById('reduction').value) || 20;
    
    const avgWastePerPerson = 4.5; // kg per week
    const totalWaste = members * avgWastePerPerson;
    const reducedWaste = totalWaste * (reduction / 100);
    const newTotal = totalWaste - reducedWaste;
    const yearlyReduction = reducedWaste * 52;
    
    const resultHTML = `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 15px;">
            <h4 style="color: #2c3e50; margin-bottom: 15px;">Your Impact:</h4>
            <p style="margin: 8px 0; color: #666;">
                <strong>Current weekly waste:</strong> ${totalWaste.toFixed(1)} kg
            </p>
            <p style="margin: 8px 0; color: #666;">
                <strong>Reduced weekly waste:</strong> ${newTotal.toFixed(1)} kg
            </p>
            <p style="margin: 8px 0; color: #27ae60; font-weight: bold;">
                <strong>Yearly reduction:</strong> ${yearlyReduction.toFixed(1)} kg
            </p>
            <p style="margin: 8px 0; color: #27ae60; font-size: 14px;">
                That's equivalent to ${Math.floor(yearlyReduction / 25)} bags of waste saved!
            </p>
        </div>
    `;
    
    document.getElementById('calculatorResult').innerHTML = resultHTML;
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
    createWasteCalculator();
    
    // Add loading animation completion
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('EcoWaste Management website loaded successfully!');
});