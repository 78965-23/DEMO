// Admin Portal JavaScript – Password: 08092003
const ADMIN_PASSWORD = '08092003';
const MAX_ATTEMPTS = 3;
let loginAttempts = 0;
const STATUS = { PENDING:'pending', REVIEWED:'reviewed', APPROVED:'approved', REJECTED:'rejected' };

// ---------- Password handling ----------
function handlePasswordSubmit(event) {
    event.preventDefault();
    const passwordInput = document.getElementById('adminPasswordInput');
    const errorDiv = document.getElementById('passwordError');
    const attemptCounter = document.getElementById('attemptCounter');
    const attemptCountSpan = document.getElementById('attemptCount');
    const unlockBtn = document.getElementById('unlockBtn');
    const entered = passwordInput.value.trim();

    if (loginAttempts >= MAX_ATTEMPTS) {
        errorDiv.textContent = '🔒 Account locked. Please contact administrator.';
        errorDiv.className = 'error-message show';
        passwordInput.disabled = true;
        unlockBtn.disabled = true;
        return;
    }

    if (entered === ADMIN_PASSWORD) {
        // Success
        errorDiv.className = 'error-message';
        document.getElementById('passwordOverlay').style.display = 'none';
        document.getElementById('adminDashboard').className = 'admin-dashboard show';
        document.body.style.overflow = 'auto';
        loadApplications();
        loginAttempts = 0;
        attemptCounter.className = 'attempt-counter';
        localStorage.setItem('adminAccess', 'granted');
    } else {
        loginAttempts++;
        const remaining = MAX_ATTEMPTS - loginAttempts;
        errorDiv.textContent = '❌ Incorrect password. Please try again.';
        errorDiv.className = 'error-message show';
        passwordInput.className = 'error';
        if (remaining > 0) {
            attemptCountSpan.textContent = remaining;
            attemptCounter.className = 'attempt-counter show';
        }
        passwordInput.value = '';
        passwordInput.focus();
        if (loginAttempts >= MAX_ATTEMPTS) {
            errorDiv.textContent = '🔒 Account locked. Maximum attempts exceeded.';
            errorDiv.className = 'error-message show';
            passwordInput.disabled = true;
            unlockBtn.disabled = true;
            attemptCounter.className = 'attempt-counter show';
            attemptCountSpan.textContent = '0';
        }
        // Shake
        document.querySelector('.password-box').style.animation = 'none';
        setTimeout(() => document.querySelector('.password-box').style.animation = 'shake 0.5s ease', 10);
    }
}

function checkAdminAuth() {
    if (localStorage.getItem('adminAccess') === 'granted') {
        document.getElementById('passwordOverlay').style.display = 'none';
        document.getElementById('adminDashboard').className = 'admin-dashboard show';
        document.body.style.overflow = 'auto';
        loadApplications();
    }
}

// ---------- Application CRUD ----------
function getApplications() {
    return JSON.parse(localStorage.getItem('serviceApplications') || '[]');
}
function saveApplications(apps) {
    localStorage.setItem('serviceApplications', JSON.stringify(apps));
}

function loadApplications() {
    const apps = getApplications();
    const tbody = document.getElementById('applicationsTableBody');
    const search = document.getElementById('searchInput').value.toLowerCase();
    const filter = document.getElementById('filterStatus').value;
    let filtered = apps;
    if (search) filtered = filtered.filter(a => a.fullName.toLowerCase().includes(search) || a.email.toLowerCase().includes(search) || a.service.toLowerCase().includes(search));
    if (filter !== 'all') filtered = filtered.filter(a => a.status === filter);
    updateStats(apps);

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fas fa-inbox"></i><h3>No applications found</h3><p>${apps.length === 0 ? 'No applications submitted yet.' : 'Try adjusting your filters.'}</p></div></td></tr>`;
        return;
    }
    tbody.innerHTML = filtered.map((a, i) => `
        <tr>
            <td>${i+1}</td>
            <td><strong>${a.fullName}</strong></td>
            <td>${a.email}</td>
            <td>${a.service}</td>
            <td><span class="status-badge status-${a.status}">${a.status.charAt(0).toUpperCase()+a.status.slice(1)}</span></td>
            <td>${new Date(a.submittedAt).toLocaleDateString()}</td>
            <td>
                <div class="action-buttons">
                    ${a.status === STATUS.PENDING ? `
                        <button class="btn-review" onclick="reviewApplication(${a.id})" title="Review"><i class="fas fa-eye"></i></button>
                        <button class="btn-approve" onclick="approveApplication(${a.id})" title="Approve"><i class="fas fa-check"></i></button>
                        <button class="btn-reject" onclick="rejectApplication(${a.id})" title="Reject"><i class="fas fa-times"></i></button>
                    ` : (a.status === STATUS.REVIEWED ? `
                        <button class="btn-approve" onclick="approveApplication(${a.id})" title="Approve"><i class="fas fa-check"></i></button>
                        <button class="btn-reject" onclick="rejectApplication(${a.id})" title="Reject"><i class="fas fa-times"></i></button>
                    ` : `<span style="color:var(--gray);font-size:0.8rem;">${a.status === STATUS.APPROVED ? '✅ Approved' : '❌ Rejected'}</span>`)}
                    <button class="btn-delete" onclick="deleteApplicationHandler(${a.id})" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function updateStats(apps) {
    document.getElementById('totalApps').textContent = apps.length;
    document.getElementById('pendingApps').textContent = apps.filter(a => a.status === STATUS.PENDING).length;
    document.getElementById('approvedApps').textContent = apps.filter(a => a.status === STATUS.APPROVED).length;
    document.getElementById('rejectedApps').textContent = apps.filter(a => a.status === STATUS.REJECTED).length;
}

function filterApplications() { loadApplications(); }
function refreshApplications() { showAdminSuccess('✅ Applications refreshed!'); loadApplications(); }

function reviewApplication(id) {
    if (updateStatus(id, STATUS.REVIEWED)) { showAdminSuccess('👁️ Marked as reviewed'); loadApplications(); }
}
function approveApplication(id) {
    if (updateStatus(id, STATUS.APPROVED)) { showAdminSuccess('✅ Approved'); loadApplications(); }
}
function rejectApplication(id) {
    if (updateStatus(id, STATUS.REJECTED)) { showAdminSuccess('❌ Rejected'); loadApplications(); }
}
function updateStatus(id, status) {
    const apps = getApplications();
    const idx = apps.findIndex(a => a.id === id);
    if (idx === -1) return false;
    apps[idx].status = status;
    apps[idx].updatedAt = new Date().toISOString();
    saveApplications(apps);
    return true;
}
function deleteApplicationHandler(id) {
    if (confirm('⚠️ Delete this application?')) {
        const apps = getApplications().filter(a => a.id !== id);
        saveApplications(apps);
        showAdminSuccess('🗑️ Deleted');
        loadApplications();
    }
}

function showAdminSuccess(msg) {
    const div = document.getElementById('adminSuccess');
    document.getElementById('successMessage').textContent = msg;
    div.style.display = 'block';
    setTimeout(() => div.style.display = 'none', 3000);
}

// ---------- Logout ----------
function logoutAdmin() {
    localStorage.removeItem('adminAccess');
    document.getElementById('adminDashboard').className = 'admin-dashboard';
    document.getElementById('passwordOverlay').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.getElementById('adminPasswordInput').value = '';
    document.getElementById('adminPasswordInput').disabled = false;
    document.getElementById('unlockBtn').disabled = false;
    document.getElementById('passwordError').className = 'error-message';
    document.getElementById('attemptCounter').className = 'attempt-counter';
    loginAttempts = 0;
}

// ---------- Export CSV ----------
function exportToCSV() {
    const apps = getApplications();
    if (!apps.length) { showAdminSuccess('📭 No applications to export'); return; }
    let csv = 'ID,Name,Email,Phone,Service,Experience,Budget,Status,Submitted Date\n';
    apps.forEach(a => csv += `${a.id},"${a.fullName}","${a.email}","${a.phone}","${a.service}","${a.experience||'N/A'}","${a.budget||'N/A'}","${a.status}",${new Date(a.submittedAt).toLocaleDateString()}\n`);
    const blob = new Blob([csv], {type:'text/csv'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `applications_${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); window.URL.revokeObjectURL(url);
    showAdminSuccess('📊 Exported CSV');
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('passwordForm').addEventListener('submit', handlePasswordSubmit);
    checkAdminAuth();
    document.getElementById('adminPasswordInput').focus();
});
