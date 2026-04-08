document.addEventListener('DOMContentLoaded', () => {

    // UI Elements
    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('active');

        // Change icon based on state
        if (!isExpanded) {
            mobileMenuBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;
        } else {
            mobileMenuBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 18L20 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M4 12L20 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M4 6L20 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>`;
        }
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 18L20 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M4 12L20 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M4 6L20 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>`;
        });
    });

    // Intersection Observer for scroll animations (fade-in effect)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in');
    animatedElements.forEach(el => observer.observe(el));

    // Handle immediate visibility for hero elements
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-section .fade-in');
        heroElements.forEach(el => el.classList.add('visible'));
    }, 100);

    // Interactive Quote Calculator
    const calcForm = document.getElementById('calculator-form');
    if (calcForm) {
        const steps = Array.from(document.querySelectorAll('.calc-step'));
        const progressSteps = Array.from(document.querySelectorAll('.progress-step'));
        const nextBtns = document.querySelectorAll('.next-step');
        const prevBtns = document.querySelectorAll('.prev-step');
        let currentStep = 0;

        function updateSteps() {
            // Update UI
            steps.forEach((step, index) => {
                step.classList.toggle('active', index === currentStep);
            });
            progressSteps.forEach((pStep, index) => {
                pStep.classList.toggle('active', index <= currentStep);
            });
        }

        function validateStep() {
            const currentStepEl = steps[currentStep];
            const inputs = currentStepEl.querySelectorAll('input[required], textarea[required], select[required]');
            let valid = true;
            
            // Radio buttons need special handling
            const radios = currentStepEl.querySelectorAll('input[type="radio"]');
            if (radios.length > 0) {
                const checked = currentStepEl.querySelector('input[type="radio"]:checked');
                if (!checked) valid = false;
            }

            inputs.forEach(input => {
                if (input.type !== 'radio' && !input.value.trim()) {
                    valid = false;
                    input.style.borderColor = 'var(--danger)';
                } else if (input.type !== 'radio') {
                    input.style.borderColor = '';
                }
            });

            if (!valid) {
                alert('Por favor, selecciona/completa todos los campos para continuar.');
            }
            return valid;
        }

        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (validateStep() && currentStep < steps.length - 1) {
                    currentStep++;
                    updateSteps();
                }
            });
        });

        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentStep > 0) {
                    currentStep--;
                    updateSteps();
                }
            });
        });

        calcForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if(!validateStep()) return;

            // Gather data
            const serviceRadios = document.querySelector('input[name="calc_service"]:checked');
            const service = serviceRadios ? serviceRadios.value : "No especificado";
            const origin = document.getElementById('calc_origin').value.trim();
            const dest = document.getElementById('calc_dest').value.trim();
            const details = document.getElementById('calc_details').value.trim();
            const name = document.getElementById('calc_name').value.trim();
            const phone = document.getElementById('calc_phone').value.trim();

            // Construct WhatsApp Message
            let message = `*NUEVA SOLICITUD DE COTIZACIÓN* 🚛\n\n`;
            message += `*Servicio:* ${service}\n`;
            message += `*Origen:* ${origin}\n`;
            message += `*Destino:* ${dest}\n`;
            message += `*Detalles de Carga:* ${details}\n\n`;
            message += `*Nombre:* ${name}\n`;
            message += `*Teléfono:* ${phone}\n`;
            
            const wpPhone = "5491132479231";
            const wpUrl = `https://wa.me/${wpPhone}?text=${encodeURIComponent(message)}`;
            
            // Redirect
            window.open(wpUrl, '_blank');
        });
    }
});
