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

    // Card glow effect following mouse (frontend-design: purposeful motion)
    const cards = document.querySelectorAll('.card, .advantage-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
            card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
        });
    });

    // Stat number counter animation (frontend-design: high-impact moments)
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.stat-card').forEach(card => statObserver.observe(card));


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

    // Live Clock
    function updateClock() {
        const now = new Date();
        const timeOpts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'America/Argentina/Buenos_Aires' };
        const dateOpts = { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Argentina/Buenos_Aires' };

        const clockEls = [document.getElementById('live-clock'), document.getElementById('live-clock-2')];
        const dateEls = [document.getElementById('live-date'), document.getElementById('live-date-2')];
        const timeStr = now.toLocaleTimeString('es-AR', timeOpts);
        const formatted = now.toLocaleDateString('es-AR', dateOpts);
        const dateStr = formatted.charAt(0).toUpperCase() + formatted.slice(1);

        clockEls.forEach(el => { if (el) el.textContent = timeStr; });
        dateEls.forEach(el => { if (el) el.textContent = dateStr; });
    }

    updateClock();
    setInterval(updateClock, 1000);

    // Weather from Open-Meteo (free, no API key)
    const weatherCodes = {
        0: { desc: 'Despejado', icon: '\u2600' },
        1: { desc: 'Mayormente despejado', icon: '\uD83C\uDF24' },
        2: { desc: 'Parcialmente nublado', icon: '\u26C5' },
        3: { desc: 'Nublado', icon: '\u2601' },
        45: { desc: 'Niebla', icon: '\uD83C\uDF2B' },
        48: { desc: 'Niebla helada', icon: '\uD83C\uDF2B' },
        51: { desc: 'Llovizna leve', icon: '\uD83C\uDF26' },
        53: { desc: 'Llovizna', icon: '\uD83C\uDF26' },
        55: { desc: 'Llovizna intensa', icon: '\uD83C\uDF27' },
        61: { desc: 'Lluvia leve', icon: '\uD83C\uDF27' },
        63: { desc: 'Lluvia', icon: '\uD83C\uDF27' },
        65: { desc: 'Lluvia intensa', icon: '\uD83C\uDF27' },
        71: { desc: 'Nieve leve', icon: '\u2744' },
        73: { desc: 'Nieve', icon: '\u2744' },
        75: { desc: 'Nieve intensa', icon: '\u2744' },
        80: { desc: 'Chaparrones', icon: '\uD83C\uDF26' },
        81: { desc: 'Chaparrones', icon: '\uD83C\uDF27' },
        82: { desc: 'Chaparrones intensos', icon: '\uD83C\uDF27' },
        95: { desc: 'Tormenta', icon: '\u26C8' },
        96: { desc: 'Tormenta con granizo', icon: '\u26C8' },
        99: { desc: 'Tormenta con granizo', icon: '\u26C8' }
    };

    // Get visitor location by IP, then fetch weather
    const locationEls = document.querySelectorAll('.info-strip-location');

    function fetchWeather(lat, lon) {
        return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`)
            .then(res => res.json())
            .then(data => {
                const w = data.current_weather;
                const code = weatherCodes[w.weathercode] || { desc: 'N/D', icon: '\u2601' };

                const tempEls = [document.getElementById('weather-temp'), document.getElementById('weather-temp-2')];
                const descEls = [document.getElementById('weather-desc'), document.getElementById('weather-desc-2')];
                const iconEls = [document.getElementById('weather-icon'), document.getElementById('weather-icon-2')];

                tempEls.forEach(el => { if (el) el.textContent = Math.round(w.temperature) + '\u00B0C'; });
                descEls.forEach(el => { if (el) el.textContent = code.desc; });
                iconEls.forEach(el => { if (el) el.textContent = code.icon; });
            });
    }

    function showLocationAndWeather(lat, lon, city, region) {
        locationEls.forEach(el => { if (el) el.textContent = city + ', ' + region; });
        return fetchWeather(lat, lon);
    }

    function setFallbackDisplay() {
        locationEls.forEach(el => { if (el) el.textContent = 'Buenos Aires'; });
        const descEls = [document.getElementById('weather-desc'), document.getElementById('weather-desc-2')];
        descEls.forEach(el => { if (el) el.textContent = 'Clima no disponible'; });
    }

    // Try IP geolocation with multiple providers as fallback
    function geoByIP() {
        return fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) })
            .then(res => {
                if (!res.ok) throw new Error('ipapi failed');
                return res.json();
            })
            .then(geo => {
                if (!geo.latitude) throw new Error('No coords from ipapi');
                return geo;
            })
            .catch(() => {
                // Fallback: ipwho.is (free, HTTPS, no key needed)
                return fetch('https://ipwho.is/', { signal: AbortSignal.timeout(4000) })
                    .then(res => {
                        if (!res.ok) throw new Error('ip-api failed');
                        return res.json();
                    })
                    .then(geo => {
                        if (!geo.success) throw new Error('ipwho.is failed');
                        return {
                            latitude: geo.latitude,
                            longitude: geo.longitude,
                            city: geo.city,
                            region: geo.region
                        };
                    });
            });
    }

    // Try browser geolocation as last resort
    function geoBrowser() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) return reject(new Error('No geolocation'));
            navigator.geolocation.getCurrentPosition(
                pos => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, city: null, region: null }),
                () => reject(new Error('Geolocation denied')),
                { timeout: 5000 }
            );
        });
    }

    geoByIP()
        .then(geo => {
            const lat = geo.latitude || -34.6401;
            const lon = geo.longitude || -58.5630;
            const city = geo.city || 'Buenos Aires';
            const region = geo.region || 'Buenos Aires';
            return showLocationAndWeather(lat, lon, city, region);
        })
        .catch(() => {
            // All IP APIs failed, try browser geolocation
            return geoBrowser()
                .then(geo => {
                    locationEls.forEach(el => { if (el) el.textContent = 'Tu ubicación'; });
                    return fetchWeather(geo.latitude, geo.longitude);
                })
                .catch(() => {
                    // Everything failed, use default (Buenos Aires)
                    return showLocationAndWeather(-34.6401, -58.5630, 'Buenos Aires', 'Buenos Aires');
                });
        })
        .catch(() => setFallbackDisplay());
});
