// ============================================================
//  CERTIFICATE PORTAL – SHARED UTILITIES
// ============================================================

/**
 * Toggle mobile navigation menu (hamburger)
 */
function toggleMenu() {
    const nav = document.getElementById('navLinks');
    if (nav) {
        nav.classList.toggle('active');
    }
}

/**
 * Generate a unique Reference Number
 * Format: REF-XXXXXXXX-XXXXX
 */
function generateRef() {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return 'REF-' + timestamp + '-' + random;
}

/**
 * Generate a unique Certificate Number
 * Format: CERT-XXXXXXXX-XXXXX
 */
function generateCertNum() {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return 'CERT-' + timestamp + '-' + random;
}

// ============================================================
//  CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
// ============================================================
document.addEventListener('click', function(e) {
    const nav = document.getElementById('navLinks');
    const hamburger = document.querySelector('.hamburger');
    if (nav && nav.classList.contains('active')) {
        // If click is outside the menu and outside the hamburger button, close it
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
            nav.classList.remove('active');
        }
    }
});

// ============================================================
//  OPTIONAL: GLOBAL FETCH HELPERS (if you prefer)
//  Uncomment if needed, but all pages use fetch directly now.
// ============================================================
/*
async function getApplications() {
    const res = await fetch('/api/applications');
    return res.json();
}
async function saveApplication(data) {
    const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
}
*/
