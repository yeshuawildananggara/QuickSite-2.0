/**
 * QuickSite Main JavaScript
 * Optimized for Premium UX, Mobile Navigation, and Scroll Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Mobile Menu Logic ---
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            // Animate the hamburger icon to an 'X' if you add 'open' styles in CSS
            menuToggle.classList.toggle('open');
        });

        // Close menu when a link is clicked (for mobile UX)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navMenu.classList.remove('show'));
        });
    }

    // --- 2. Validation & UI Helpers ---
    const validate = {
        email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        name: (name) => name.trim().length >= 2,
        business: (biz) => biz.trim().length >= 2
    };

    const showInputError = (inputId, message) => {
        const input = document.getElementById(inputId);
        input.classList.add('invalid');
        // If you add <small class="error-text"> in HTML, this will show it
        const errorDisplay = input.parentElement.querySelector('.error-text');
        if (errorDisplay) {
            errorDisplay.textContent = message;
            errorDisplay.style.display = 'block';
        }
    };

    const clearInputErrors = () => {
        document.querySelectorAll('input, select').forEach(el => {
            el.classList.remove('invalid');
            const errorDisplay = el.parentElement.querySelector('.error-text');
            if (errorDisplay) errorDisplay.style.display = 'none';
        });
    };

    // --- 3. Multi-Step Form Logic ---
    window.nextStep = (stepNumber) => {
        clearInputErrors();
        
        const step1 = document.getElementById('step1');
        const step2 = document.getElementById('step2');
        const indicators = [
            document.getElementById('indicator1'),
            document.getElementById('indicator2')
        ];

        if (stepNumber === 2) {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            let hasError = false;

            if (!validate.name(name)) {
                showInputError('name', 'Please enter your full name');
                hasError = true;
            }
            if (!validate.email(email)) {
                showInputError('email', 'Please enter a valid email');
                hasError = true;
            }

            if (hasError) return; // Stop if validation fails

            step1.style.display = 'none';
            step2.style.display = 'block';
            indicators[1].classList.add('active');
        } else {
            step2.style.display = 'none';
            step1.style.display = 'block';
            indicators[1].classList.remove('active');
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- 4. Form Submission ---
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const bizName = document.getElementById('businessName').value;
            if (!validate.business(bizName)) {
                showInputError('businessName', 'Business name is required');
                return;
            }

            // Simulate "Amazing" Loading State
            const submitBtn = orderForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Securing your slot...';

            setTimeout(() => {
                orderForm.style.display = 'none';
                document.querySelector('.step-indicator').style.display = 'none';
                document.getElementById('successMessage').style.display = 'block';
                document.getElementById('indicator3').classList.add('active');
                
                // Fire some virtual confetti or scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1500);
        });
    }

    // --- 5. Intersection Observer (Scroll Reveal) ---
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // --- 6. Smooth Scroll for Anchors ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offset = 80; // Navbar height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
