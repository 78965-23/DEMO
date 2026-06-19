// ===== Toggle Mobile Menu =====
function toggleMenu() {
    const nav = document.getElementById('navLinks');
    if (nav) nav.classList.toggle('active');
}

// ===== Generate Reference Number =====
function generateRef() {
    const ts = Date.now().toString().slice(-8);
    const rand = Math.random().toString(36).substring(2,7).toUpperCase();
    return 'REF-' + ts + '-' + rand;
}

// ===== Generate Certificate Number =====
function generateCertNum() {
    const ts = Date.now().toString().slice(-8);
    const rand = Math.random().toString(36).substring(2,7).toUpperCase();
    return 'CERT-' + ts + '-' + rand;
}

// ===== Close menu when clicking outside =====
document.addEventListener('click', function(e) {
    const nav = document.getElementById('navLinks');
    const hamburger = document.querySelector('.hamburger');
    if (nav && nav.classList.contains('active') &&
        !nav.contains(e.target) && !hamburger.contains(e.target)) {
        nav.classList.remove('active');
    }
});
