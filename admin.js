// Admin Portal JavaScript
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Application statuses
const STATUS = {
    PENDING: 'pending',
    REVIEWED: 'reviewed',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

// Get applications from localStorage
function getApplications() {
    const apps = localStorage.getItem('serviceApplications');
    return apps ? JSON.parse(apps) : [];
}

// Save applications to localStorage
function saveApplications(applications) {
    localStorage.setItem('serviceApplications', JSON.stringify(applications));
}

// Get next ID
function getNextId() {
    const apps = getApplications();
    if (apps.length === 0) return 1;
    return Math.max(...apps.map(app => app.id)) + 1;
}

// Submit application from form
function submitApplication(formData) {
    const applications = getApplications();
    const newApp = {
        id: getNextId(),
        ...formData,
        status: STATUS.PENDING,
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    applications.unshift(newApp);
    saveApplications(applications);
    return newApp;
}

// Update application status
function updateApplicationStatus(id, status) {
    const applications = getApplications();
    const index = applications.findIndex(app => app.id === id);
    if (index !== -1) {
        applications[index].status = status;
        applications[index].updatedAt = new Date().toISOString();
        saveApplications(applications);
        return true;
    }
    return false;
}

// Delete application
function deleteApplication(id) {
    const applications = getApplications();
    const filtered = applications.filter(app => app.id !== id);
    saveApplications(filtered);
    return filtered.length !== applications.length;
}

// Admin Login
function loginAdmin(event) {
    event.preventDefault();
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    const errorDiv = document.getElementById('loginError');

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        errorDiv.style.display = 'none';
        localStorage.setItem('adminLoggedIn', 'true');
        showAdminDashboard();
    } else {
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }
}

// Show admin dashboard
function showAdminDashboard() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadApplications();
}

// Logout
function logoutAdmin() {
    localStorage.removeItem('adminLoggedIn');
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('adminLogin').style.display = 'block';
}

// Load applications into table
function loadApplications() {
    const applications = getApplications();
    const tbody = document.getElementById('applicationsTableBody');
    const search = document.getElementById('searchInput').value.toLowerCase();
    const filter = document.getElementById('filterStatus').value;

    let filtered = applications;

    // Apply search filter
    if (search) {
        filtered = filtered.filter(app =>
            app.fullName.toLowerCase().includes(search) ||
            app.email.toLowerCase().includes(search) ||
            app.service.toLowerCase().includes(search)
        );
    }

    // Apply status filter
    if (filter !== 'all') {
        filtered = filtered.filter(app => app.status === filter);
    }

    // Update stats
    updateStats(applications);

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>No applications found</h3>
                        <p>${applications.length === 0 ? 'No applications have been submitted yet.' : 'Try adjusting your search filters.'}</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map((app, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${app.fullName}</strong></td>
            <td>${app.email}</td>
            <td>${app.service}</td>
            <td>
                <span class="status-badge status-${app.status}">
                    ${app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
            </td>
            <td>${new Date(app.submittedAt).toLocaleDateString()}</td>
            <td>
                <div class="action-buttons">
                    ${app.status === STATUS.PENDING ? `
                        <button class="btn-review" onclick="reviewApplication(${app.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-approve" onclick="approveApplication(${app.id})">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn-reject" onclick="rejectApplication(${app.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : `
                        ${app.status === STATUS.REVIEWED ? `
                            <button class="btn-approve" onclick="approveApplication(${app.id})">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="btn-reject" onclick="rejectApplication(${app.id})">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : ''}
                    `}
                    <button class="btn-delete" onclick="deleteApplicationHandler(${app.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Update statistics
function updateStats(applications) {
    const total = applications.length;
    const pending = applications.filter(app => app.status === STATUS.PENDING).length;
    const approved = applications.filter(app => app.status === STATUS.APPROVED).length;
    const rejected = applications.filter(app => app.status === STATUS.REJECTED).length;

    document.getElementById('totalApps').textContent = total;
    document.getElementById('pendingApps').textContent = pending;
    document.getElementById('approvedApps').textContent = approved;
    document.getElementById('rejectedApps').textContent = rejected;
}

// Filter applications
function filterApplications() {
    loadApplications();
}

// Refresh applications
function refreshApplications() {
    showAdminSuccess('Applications refreshed successfully!');
    loadApplications();
}

// Review application
function reviewApplication(id) {
    if (updateApplicationStatus(id, STATUS.REVIEWED)) {
        showAdminSuccess('Application marked as reviewed!');
        loadApplications();
    }
}

// Approve application
function approveApplication(id) {
    if (updateApplicationStatus(id, STATUS.APPROVED)) {
        showAdminSuccess('Application approved!');
        loadApplications();
    }
}

// Reject application
function rejectApplication(id) {
    if (updateApplicationStatus(id, STATUS.REJECTED)) {
        showAdminSuccess('Application rejected.');
        loadApplications();
    }
}

// Delete application
function deleteApplicationHandler(id) {
    if (confirm('Are you sure you want to delete this application?')) {
        if (deleteApplication(id)) {
            showAdminSuccess('Application deleted successfully!');
            loadApplications();
        }
    }
}

// Show admin success message
function showAdminSuccess(message) {
    const successDiv = document.getElementById('adminSuccess');
    document.getElementById('successMessage').textContent = message;
    successDiv.style.display = 'block';
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}

// Check admin login status
function checkAdminAuth() {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    if (loggedIn === 'true') {
        showAdminDashboard();
    } else {
        document.getElementById('adminLogin').style.display = 'block';
        document.getElementById('adminDashboard').style.display = 'none';
    }
}

// Setup login form
function setupAdminLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', loginAdmin);
    }
}

// Initialize admin portal
document.addEventListener('DOMContentLoaded', function() {
    setupAdminLogin();
    checkAdminAuth();
});
