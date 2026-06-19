// Service Data
const services = [
    {
        id: 1,
        name: "Web Development",
        icon: "fa-code",
        description: "Build modern, responsive websites with the latest technologies.",
        category: "development"
    },
    {
        id: 2,
        name: "Mobile App Development",
        icon: "fa-mobile-alt",
        description: "Create native and cross-platform mobile applications.",
        category: "development"
    },
    {
        id: 3,
        name: "UI/UX Design",
        icon: "fa-paint-brush",
        description: "Design beautiful, user-friendly interfaces and experiences.",
        category: "design"
    },
    {
        id: 4,
        name: "Digital Marketing",
        icon: "fa-bullhorn",
        description: "Boost your online presence with strategic digital marketing.",
        category: "marketing"
    },
    {
        id: 5,
        name: "Content Writing",
        icon: "fa-pen-fancy",
        description: "High-quality content for blogs, websites, and social media.",
        category: "content"
    },
    {
        id: 6,
        name: "Graphic Design",
        icon: "fa-image",
        description: "Eye-catching graphics, logos, and visual branding.",
        category: "design"
    },
    {
        id: 7,
        name: "Video Editing",
        icon: "fa-video",
        description: "Professional video editing and post-production services.",
        category: "media"
    },
    {
        id: 8,
        name: "IT Consulting",
        icon: "fa-chart-line",
        description: "Expert IT consultation for business growth and efficiency.",
        category: "consulting"
    }
];

// Load Services on Homepage
function loadServices() {
    const grid = document.getElementById('serviceGrid');
    if (!grid) return;

    grid.innerHTML = services.map(service => `
        <div class="service-card" data-id="${service.id}">
            <i class="fas ${service.icon}"></i>
            <h3>${service.name}</h3>
            <a href="service-detail.html?service=${encodeURIComponent(service.name)}" class="apply-btn">
                Apply <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `).join('');
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

// Form Submission (for service-detail page)
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

        showStatus(`
            ✅ <strong>Application Submitted Successfully!</strong><br>
            Thank you, ${name}! We've received your application for ${service}.<br>
            We'll contact you at ${email} within 24 hours.
        `, 'success');

        form.reset();

        console.log({
            name,
            email,
            phone,
            service,
            message,
            timestamp: new Date().toISOString()
        });
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
    window.statusTimeout = setTimeout(() => {
        status.style.display = 'none';
    }, 8000);
}

// Smooth Scrolling for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.includes('.html')) return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize all functions
document.addEventListener('DOMContentLoaded', function() {
    loadServices();
    setupMobileMenu();
    setupForm();
    setupSmoothScroll();
});

// Animation on scroll (only on homepage)
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

document.querySelectorAll('.service-card, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});
// Add this to your existing script.js file

// Modified form submission - stores in localStorage for admin
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
        const experience = document.getElementById('experience').value;
        const budget = document.getElementById('budget').value;
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

        // Create application data
        const applicationData = {
            fullName: name,
            email: email,
            phone: phone,
            service: service,
            experience: experience || 'Not specified',
            budget: budget || 'Not specified',
            message: message,
            documents: 'No files uploaded' // In production, handle file upload
        };

        // Save to localStorage (for admin portal)
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
            <small style="color: var(--gray);">Your application has been sent to the admin for review.</small>
        `, 'success');

        form.reset();

        console.log('Application submitted:', applicationData);
        console.log('View in Admin Portal: admin-portal.html');
    });
}
