/**
 * QuickSite Main JavaScript
 * Handles: Multi-step forms, Validation, Data Persistence, and UI Animations
 */

// --- 1. Form Validation Helpers ---
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
        const error = document.getElementById(`${inputId}Error`);
        if (input && error) {
            input.style.borderColor = 'var(--error)';
            error.textContent = message;
            error.style.display = 'block';
        }
    },
    clearError: (inputId) => {
        const input = document.getElementById(inputId);
        const error = document.getElementById(`${inputId}Error`);
        if (input && error) {
            input.style.borderColor = 'var(--border)';
            error.textContent = '';
            error.style.display = 'none';
        }
    }
};

// --- 2. Main Logic ---
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    const checkoutForm = document.getElementById('checkoutForm');

    // --- ORDER PAGE LOGIC ---
    if (orderForm) {
        const step1 = document.getElementById('step1');
        const step2 = document.getElementById('step2');
        const nextBtn = document.getElementById('nextBtn');
        const backBtn = document.getElementById('backBtn');
        const progressSteps = document.querySelectorAll('.progress-step');

        // Step 1 -> Step 2
        nextBtn.addEventListener('click', () => {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            let isValid = true;

            if (name.length < 2) { ui.showError('name', 'Please enter your name'); isValid = false; }
            else { ui.clearError('name'); }

            if (!validate.email(email)) { ui.showError('email', 'Enter a valid email'); isValid = false; }
            else { ui.clearError('email'); }

            if (isValid) {
                step1.classList.remove('active');
                step2.classList.add('active');
                progressSteps[1].classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        // Back to Step 1
        backBtn.addEventListener('click', () => {
            step2.classList.remove('active');
            step1.classList.add('active');
            progressSteps[1].classList.remove('active');
        });

        // Sync Business Name to Sidebar Preview
        const bizInput = document.getElementById('businessName');
        const bizPreview = document.getElementById('summaryBusiness');
        bizInput.addEventListener('input', (e) => {
            bizPreview.textContent = e.target.value || 'Your Agency';
        });

        // Form Submit (Save data and go to checkout)
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const bizName = bizInput.value.trim();
            const plan = document.getElementById('plan').value;

            if (bizName.length < 2) { ui.showError('businessName', 'Business name required'); return; }

            const orderData = {
                businessName: bizName,
                plan: plan,
                price: plan === 'pro' ? 149 : plan === 'standard' ? 99 : 49
            };

            sessionStorage.setItem('tempOrder', JSON.stringify(orderData));
            window.location.href = 'checkout.html';
        });
    }

    // --- CHECKOUT PAGE LOGIC ---
    if (checkoutForm) {
        const orderData = JSON.parse(sessionStorage.getItem('tempOrder') || '{"businessName":"N/A","plan":"standard","price":99}');

        // Populate Summary
        document.getElementById('summaryPlan').textContent = orderData.plan.toUpperCase();
        document.getElementById('summaryBusiness').textContent = orderData.businessName;
        document.getElementById('summarySubtotal').textContent = `$${orderData.price}.00`;
        document.getElementById('summaryTotal').textContent = `$${orderData.price}.00`;

        // Card Formatting
        const cardInput = document.getElementById('cardNumber');
        cardInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
            e.target.value = formatted.substring(0, 19);
        });

        const expiryInput = document.getElementById('cardExpiry');
        expiryInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
            e.target.value = val.substring(0, 5);
        });

        // Final Submit
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation check
            const cardNum = cardInput.value;
            if (!validate.cardNumber(cardNum)) {
                ui.showError('cardNumber', 'Invalid card number');
                return;
            }

            // Success Animation
            checkoutForm.style.opacity = '0';
            setTimeout(() => {
                checkoutForm.style.display = 'none';
                document.querySelector('.section-intro').style.display = 'none';
                document.querySelector('.order-sidebar').style.display = 'none';
                
                const successMsg = document.getElementById('checkoutSuccess');
                successMsg.style.display = 'block';
                successMsg.classList.add('active'); // Triggers fadeInUp
            }, 400);

            sessionStorage.clear();
        });
    }

    // --- 3. Index Page Animations (Intersection Observer) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .p-card, .hero-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});
