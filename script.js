/**
 * QuickSite Main JavaScript
 * Optimized for Smooth Scrolling, Advanced Animations, and Multi-step Forms
 */

// --- 1. Validation & UI Helpers ---
const validate = {
    email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    phone: (phone) => !phone || (phone.replace(/\D/g, '').length >= 10),
    cardNumber: (number) => {
        const cleaned = number.replace(/\s/g, '');
        return /^\d{13,19}$/.test(cleaned);
    },
    expiry: (expiry) => {
        const re = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!re.test(expiry)) return false;
        const [month, year] = expiry.split('/');
        const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
        return expiryDate > new Date();
    },
    cvc: (cvc) => /^\d{3,4}$/.test(cvc)
};

const ui = {
    showError: (inputId, message) => {
        const input = document.getElementById(inputId);
        if (input) {
            input.style.borderColor = 'var(--error)';
            input.classList.add('shake'); // Adds a subtle error shake
            setTimeout(() => input.classList.remove('shake'), 400);
        }
    },
    clearError: (inputId) => {
        const input = document.getElementById(inputId);
        if (input) input.style.borderColor = 'var(--border)';
    }
};

// --- 2. Smooth Scrolling Logic ---
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Adjust for sticky navbar height
                    behavior: 'smooth'
                });
            }
        });
    });
};

// --- 3. Main Logic Execution ---
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();

    const orderForm = document.getElementById('orderForm');
    const checkoutForm = document.getElementById('checkoutForm');

    // --- ORDER PAGE LOGIC ---
    if (orderForm) {
        const step1 = document.getElementById('step1');
        const step2 = document.getElementById('step2');
        const nextBtn = document.getElementById('nextBtn');
        const backBtn = document.getElementById('backBtn');
        const progressSteps = document.querySelectorAll('.progress-step');

        nextBtn.addEventListener('click', () => {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            
            if (name.length < 2) { ui.showError('name'); return; }
            if (!validate.email(email)) { ui.showError('email'); return; }

            step1.style.opacity = '0';
            setTimeout(() => {
                step1.classList.remove('active');
                step2.classList.add('active');
                progressSteps[1].classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 300);
        });

        backBtn.addEventListener('click', () => {
            step2.classList.remove('active');
            step1.classList.add('active');
            progressSteps[1].classList.remove('active');
        });

        // Sync Sidebar Preview
        const bizInput = document.getElementById('businessName');
        const bizPreview = document.getElementById('summaryBusiness');
        bizInput?.addEventListener('input', (e) => {
            bizPreview.textContent = e.target.value || 'Your Agency';
        });

        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const plan = document.getElementById('plan').value;
            const orderData = {
                businessName: bizInput.value.trim(),
                plan: plan,
                price: plan === 'pro' ? 149 : plan === 'standard' ? 99 : 49
            };
            sessionStorage.setItem('tempOrder', JSON.stringify(orderData));
            window.location.href = 'checkout.html';
        });
    }

    // --- CHECKOUT PAGE LOGIC ---
    if (checkoutForm) {
        // Card Number Formatting
        const cardInput = document.getElementById('cardNumber');
        cardInput?.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
            e.target.value = formatted.substring(0, 19);
        });

        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate Payment Processing
            const btn = checkoutForm.querySelector('button');
            btn.innerHTML = 'Processing...';
            btn.disabled = true;

            setTimeout(() => {
                checkoutForm.innerHTML = `
                    <div style="text-align: center; padding: 40px; animation: fadeInUp 0.6s ease forwards;">
                        <span style="font-size: 4rem;">🎉</span>
                        <h2 style="margin: 20px 0;">Order Confirmed!</h2>
                        <p style="color: var(--text-muted);">Check your email for the next steps. We're starting your project now!</p>
                        <a href="index.html" class="btn btn-primary" style="margin-top: 20px;">Return Home</a>
                    </div>
                `;
            }, 2000);
        });
    }

    // --- 4. Intersection Observer for Scroll Animations ---
    const revealOnScroll = () => {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);

        // Apply to cards and sections
        document.querySelectorAll('.order-form-card, .hero-content, .hero-image, details').forEach(el => {
            el.classList.add('reveal-init');
            observer.observe(el);
        });
    };

    revealOnScroll();
});
