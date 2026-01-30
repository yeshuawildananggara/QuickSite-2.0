/**
 * QuickSite Main JavaScript
 * Optimized for Smooth Scrolling and Premium Multi-step Forms
 */

// --- 1. Validation Helpers ---
const validate = {
    email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    // Ensures name is at least 2 characters
    name: (name) => name.trim().length >= 2,
    // Checks if a business name is entered
    business: (biz) => biz.trim().length >= 1
};

// --- 2. Smooth Scrolling Logic ---
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Only handle local anchors
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80, // Offset for sticky navbar
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
};

// --- 3. Order Form Step Logic ---
// This matches your new "Step 1" and "Step 2" layout
window.nextStep = (stepNumber) => {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const indicator1 = document.getElementById('indicator1');
    const indicator2 = document.getElementById('indicator2');

    // Validation for Step 1 before moving to Step 2
    if (stepNumber === 2) {
        const nameVal = document.getElementById('name').value;
        const emailVal = document.getElementById('email').value;

        if (!validate.name(nameVal)) {
            alert("Please enter your full name.");
            return;
        }
        if (!validate.email(emailVal)) {
            alert("Please enter a valid email address.");
            return;
        }
    }

    // Toggle Visibility
    if (stepNumber === 1) {
        step1.style.display = 'block';
        step2.style.display = 'none';
        indicator2.classList.remove('active');
        indicator1.classList.add('active');
    } else {
        step1.style.display = 'none';
        step2.style.display = 'block';
        indicator1.classList.add('active');
        indicator2.classList.add('active');
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// --- 4. Main Execution ---
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();

    const orderForm = document.getElementById('orderForm');
    
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Final Validation
            const bizName = document.getElementById('businessName').value;
            const plan = document.getElementById('plan').value;

            if (!validate.business(bizName)) {
                alert("Please enter your business name.");
                return;
            }
            if (!plan) {
                alert("Please select a package.");
                return;
            }

            // Hide Form and Show Success Message
            this.style.display = 'none';
            document.querySelector('.step-indicator').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            
            // Mark last step as active
            document.getElementById('indicator3').classList.add('active');
        });
    }

    // --- 5. Intersection Observer (Fade-in animations) ---
    const revealOptions = { threshold: 0.1 };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Apply basic fade-in to sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(20px)";
        section.style.transition = "all 0.6s ease-out";
        revealObserver.observe(section);
    });
});
