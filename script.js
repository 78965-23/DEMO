// Service Data
const services = [
    { id:1, name:"Web Development", icon:"fa-code", description:"Build modern, responsive websites with the latest technologies." },
    { id:2, name:"Mobile App Development", icon:"fa-mobile-alt", description:"Create native and cross-platform mobile applications." },
    { id:3, name:"UI/UX Design", icon:"fa-paint-brush", description:"Design beautiful, user-friendly interfaces and experiences." },
    { id:4, name:"Digital Marketing", icon:"fa-bullhorn", description:"Boost your online presence with strategic digital marketing." },
    { id:5, name:"Content Writing", icon:"fa-pen-fancy", description:"High-quality content for blogs, websites, and social media." },
    { id:6, name:"Graphic Design", icon:"fa-image", description:"Eye-catching graphics, logos, and visual branding." },
    { id:7, name:"Video Editing", icon:"fa-video", description:"Professional video editing and post-production services." },
    { id:8, name:"IT Consulting", icon:"fa-chart-line", description:"Expert IT consultation for business growth and efficiency." }
];

// Load services on homepage
function loadServices() {
    const grid = document.getElementById('serviceGrid');
    if (!grid) return;
    grid.innerHTML = services.map(s => `
        <div class="service-card" data-id="${s.id}">
            <i class="fas ${s.icon}"></i>
            <h3>${s.name}</h3>
            <a href="service-detail.html?service=${encodeURIComponent(s.name)}" class="apply-btn">
                Apply <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `).join('');
}

// Mobile menu toggle
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }
}

// Form submission (stores in localStorage for admin)
function setupForm() {
    const form = document.getElementById('applicationForm');
    const status = document.getElementById('formStatus');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const service = document.getElementById('serviceSelect').value;
        const experience = document.getElementById('experience').value || 'Not specified';
        const budget = document.getElementById('budget').value || 'Not specified';
        const message = document.getElementById('message').value.trim();
        const terms = document.getElementById('terms');

        if (!name || !email || !phone || !service || !message) {
            showStatus('Please fill in all required fields.', 'error');
            return;
        }
        if (!validateEmail(email)) {
            showStatus('Please enter a valid email address.', 'error');
            return;
        }
        if (!terms || !terms.checked) {
            showStatus('Please agree to the Terms & Conditions.', 'error');
            return;
        }

        // Build application object
        const applicationData = {
            fullName: name,
            email: email,
            phone: phone,
            service: service,
            experience: experience,
            budget: budget,
            message: message,
            documents: 'No files uploaded'
        };

        // Save to localStorage
        const applications = JSON.parse(localStorage.getItem('serviceApplications') || '[]');
        const newApp = {
            id: Date.now(),
            ...applicationData,
            status: 'pending',
            submittedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        applications.unshift(newApp);
        localStorage.setItem('serviceApplications', JSON.stringify(applications));

        showStatus(`
            ✅ <strong>Application Submitted Successfully!</strong><br>
            Thank you, ${name}! We've received your application for ${service}.<br>
            We'll contact you at ${email} within 24 hours.<br>
            <small style="color:var(--gray);">Your application has been sent to the admin for review.</small>
        `, 'success');

        form.reset();
        console.log('Application submitted:', applicationData);
    });
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showStatus(message, type) {
    const status = document.getElementById('formStatus');
    if (!status) return;
    status.className = 'form-status ' + type;
    status.innerHTML = message;
    status.style.display = 'block';
    clearTimeout(window.statusTimeout);
    window.statusTimeout = setTimeout(() => { status.style.display = 'none'; }, 8000);
}

// Smooth scroll for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.includes('.html')) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Init
document.addEventListener('DOMContentLoaded', function() {
    loadServices();
    setupMobileMenu();
    setupForm();
    setupSmoothScroll();
});

// Scroll animations
const observerOptions = { threshold:0.1, rootMargin:'0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);
document.querySelectorAll('.service-card, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});
// Shared utilities – minimal
function generateRef() {
    return 'REF-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substring(2,7).toUpperCase();
}

function generateCertNum() {
    return 'CERT-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substring(2,7).toUpperCase();
}

function getApplications() {
    try { return JSON.parse(localStorage.getItem('certApplications') || '[]'); } catch(e) { return []; }
}

function saveApplications(apps) {
    localStorage.setItem('certApplications', JSON.stringify(apps));
}
// Shared utilities – add to the end of script.js
function generateRef() {
    return 'REF-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substring(2,7).toUpperCase();
}

function generateCertNum() {
    return 'CERT-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substring(2,7).toUpperCase();
}

function getApplications() {
    try { return JSON.parse(localStorage.getItem('certApplications') || '[]'); } catch(e) { return []; }
}

function saveApplications(apps) {
    localStorage.setItem('certApplications', JSON.stringify(apps));
}
