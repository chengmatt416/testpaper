// Admin Panel JavaScript for SecureTest
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin module loaded');
    
    // Check if user has admin access
    checkAdminAccess();
    
    initAdminInterface();
    initUserManagement();
    initRegistrationCodeManagement();
    initDashboardStats();
});

function checkAdminAccess() {
    const userRole = localStorage.getItem('userRole');
    
    if (userRole !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = '../auth/login.html';
        return;
    }
}

function initAdminInterface() {
    // Set admin user info
    const userEmail = localStorage.getItem('userEmail');
    const adminEmailElements = document.querySelectorAll('.admin-email');
    adminEmailElements.forEach(element => {
        if (element && userEmail) {
            element.textContent = userEmail;
        }
    });
    
    // Initialize navigation
    const navItems = document.querySelectorAll('.admin-nav a');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').replace('../admin/', '').replace('.html', '');
            showAdminSection(target);
        });
    });
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('userRole');
                localStorage.removeItem('userEmail');
                window.location.href = '../auth/login.html';
            }
        });
    }
}

function showAdminSection(section) {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(sec => sec.style.display = 'none');
    
    // Show target section
    const targetSection = document.getElementById(section + 'Section');
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Update active nav item
    const navItems = document.querySelectorAll('.admin-nav a');
    navItems.forEach(item => item.classList.remove('active'));
    
    const activeItem = document.querySelector(`.admin-nav a[href*="${section}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

function initUserManagement() {
    loadUsers();
    
    // Add user form
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewUser();
        });
    }
    
    // Search functionality
    const userSearch = document.getElementById('userSearch');
    if (userSearch) {
        userSearch.addEventListener('input', function() {
            filterUsers(this.value);
        });
    }
}

function loadUsers() {
    // Mock user data (in a real app, this would come from an API)
    const mockUsers = [
        {
            id: 1,
            email: 'student1@example.com',
            role: 'student',
            status: 'active',
            lastLogin: '2024-08-13',
            quizzesTaken: 5
        },
        {
            id: 2,
            email: 'student2@example.com',
            role: 'student',
            status: 'active',
            lastLogin: '2024-08-12',
            quizzesTaken: 3
        },
        {
            id: 3,
            email: 'editor1@example.com',
            role: 'editor',
            status: 'active',
            lastLogin: '2024-08-13',
            quizzesTaken: 0
        },
        {
            id: 4,
            email: 'student3@example.com',
            role: 'student',
            status: 'suspended',
            lastLogin: '2024-08-10',
            quizzesTaken: 1
        }
    ];
    
    displayUsers(mockUsers);
    updateUserStats(mockUsers);
}

function displayUsers(users) {
    const userTableBody = document.getElementById('userTableBody');
    if (!userTableBody) return;
    
    userTableBody.innerHTML = users.map(user => `
        <tr data-user-id="${user.id}">
            <td>${user.email}</td>
            <td>
                <span class="role-badge ${user.role}">${user.role}</span>
            </td>
            <td>
                <span class="status-badge ${user.status}">${user.status}</span>
            </td>
            <td>${user.lastLogin}</td>
            <td>${user.quizzesTaken}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-secondary" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm ${user.status === 'active' ? 'btn-warning' : 'btn-success'}" 
                        onclick="toggleUserStatus(${user.id})">
                    <i class="fas fa-${user.status === 'active' ? 'ban' : 'check'}"></i>
                    ${user.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

function updateUserStats(users) {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const suspendedUsers = users.filter(u => u.status === 'suspended').length;
    
    const totalUsersElement = document.getElementById('totalUsers');
    const activeUsersElement = document.getElementById('activeUsers');
    const suspendedUsersElement = document.getElementById('suspendedUsers');
    
    if (totalUsersElement) totalUsersElement.textContent = totalUsers;
    if (activeUsersElement) activeUsersElement.textContent = activeUsers;
    if (suspendedUsersElement) suspendedUsersElement.textContent = suspendedUsers;
}

function filterUsers(searchTerm) {
    const rows = document.querySelectorAll('#userTableBody tr');
    
    rows.forEach(row => {
        const email = row.querySelector('td:first-child').textContent.toLowerCase();
        const visible = email.includes(searchTerm.toLowerCase());
        row.style.display = visible ? '' : 'none';
    });
}

function addNewUser() {
    const formData = new FormData(document.getElementById('addUserForm'));
    const email = formData.get('email');
    const role = formData.get('role');
    
    if (!email || !role) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        alert(`User ${email} has been added successfully!`);
        document.getElementById('addUserForm').reset();
        loadUsers(); // Reload users
    }, 500);
}

function editUser(userId) {
    alert(`Edit user functionality would open a modal for user ID: ${userId}`);
    // In a real app, this would open an edit modal
}

function toggleUserStatus(userId) {
    const row = document.querySelector(`tr[data-user-id="${userId}"]`);
    const statusBadge = row.querySelector('.status-badge');
    const currentStatus = statusBadge.textContent;
    
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const confirmMessage = `Are you sure you want to ${newStatus === 'suspended' ? 'suspend' : 'activate'} this user?`;
    
    if (confirm(confirmMessage)) {
        // Simulate API call
        setTimeout(() => {
            statusBadge.textContent = newStatus;
            statusBadge.className = `status-badge ${newStatus}`;
            alert(`User has been ${newStatus} successfully!`);
            loadUsers(); // Reload to update stats
        }, 500);
    }
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        // Simulate API call
        setTimeout(() => {
            const row = document.querySelector(`tr[data-user-id="${userId}"]`);
            if (row) {
                row.remove();
                alert('User has been deleted successfully!');
                loadUsers(); // Reload to update stats
            }
        }, 500);
    }
}

function initRegistrationCodeManagement() {
    loadRegistrationCodes();
    
    // Generate new code form
    const generateCodeForm = document.getElementById('generateCodeForm');
    if (generateCodeForm) {
        generateCodeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            generateNewCode();
        });
    }
}

function loadRegistrationCodes() {
    // Mock registration codes data
    const mockCodes = [
        {
            id: 1,
            code: 'ADMIN2024',
            role: 'admin',
            status: 'active',
            usedCount: 2,
            maxUses: 5,
            expiryDate: '2024-12-31',
            createdDate: '2024-01-01'
        },
        {
            id: 2,
            code: 'EDITOR2024',
            role: 'editor',
            status: 'active',
            usedCount: 8,
            maxUses: 10,
            expiryDate: '2024-12-31',
            createdDate: '2024-01-01'
        },
        {
            id: 3,
            code: 'STUDENT2024',
            role: 'student',
            status: 'active',
            usedCount: 45,
            maxUses: 100,
            expiryDate: '2024-12-31',
            createdDate: '2024-01-01'
        },
        {
            id: 4,
            code: 'TEMP123',
            role: 'student',
            status: 'expired',
            usedCount: 3,
            maxUses: 5,
            expiryDate: '2024-08-01',
            createdDate: '2024-07-01'
        }
    ];
    
    displayRegistrationCodes(mockCodes);
    updateCodeStats(mockCodes);
}

function displayRegistrationCodes(codes) {
    const codeTableBody = document.getElementById('codeTableBody');
    if (!codeTableBody) return;
    
    codeTableBody.innerHTML = codes.map(code => `
        <tr data-code-id="${code.id}">
            <td><strong>${code.code}</strong></td>
            <td>
                <span class="role-badge ${code.role}">${code.role}</span>
            </td>
            <td>
                <span class="status-badge ${code.status}">${code.status}</span>
            </td>
            <td>${code.usedCount} / ${code.maxUses}</td>
            <td>${code.expiryDate}</td>
            <td>${code.createdDate}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-secondary" onclick="editCode(${code.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm ${code.status === 'active' ? 'btn-warning' : 'btn-success'}" 
                        onclick="toggleCodeStatus(${code.id})">
                    <i class="fas fa-${code.status === 'active' ? 'ban' : 'check'}"></i>
                    ${code.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCode(${code.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

function updateCodeStats(codes) {
    const totalCodes = codes.length;
    const activeCodes = codes.filter(c => c.status === 'active').length;
    const expiredCodes = codes.filter(c => c.status === 'expired').length;
    
    const totalCodesElement = document.getElementById('totalCodes');
    const activeCodesElement = document.getElementById('activeCodes');
    const expiredCodesElement = document.getElementById('expiredCodes');
    
    if (totalCodesElement) totalCodesElement.textContent = totalCodes;
    if (activeCodesElement) activeCodesElement.textContent = activeCodes;
    if (expiredCodesElement) expiredCodesElement.textContent = expiredCodes;
}

function generateNewCode() {
    const formData = new FormData(document.getElementById('generateCodeForm'));
    const role = formData.get('role');
    const maxUses = formData.get('maxUses');
    const expiryDate = formData.get('expiryDate');
    
    if (!role || !maxUses || !expiryDate) {
        alert('Please fill in all fields');
        return;
    }
    
    // Generate random code
    const code = generateRandomCode(role.toUpperCase());
    
    // Simulate API call
    setTimeout(() => {
        alert(`Registration code "${code}" has been generated successfully!`);
        document.getElementById('generateCodeForm').reset();
        loadRegistrationCodes(); // Reload codes
    }, 500);
}

function generateRandomCode(prefix) {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}_${randomPart}`;
}

function editCode(codeId) {
    alert(`Edit code functionality would open a modal for code ID: ${codeId}`);
    // In a real app, this would open an edit modal
}

function toggleCodeStatus(codeId) {
    const row = document.querySelector(`tr[data-code-id="${codeId}"]`);
    const statusBadge = row.querySelector('.status-badge');
    const currentStatus = statusBadge.textContent;
    
    const newStatus = currentStatus === 'active' ? 'deactivated' : 'active';
    const confirmMessage = `Are you sure you want to ${newStatus === 'deactivated' ? 'deactivate' : 'activate'} this code?`;
    
    if (confirm(confirmMessage)) {
        // Simulate API call
        setTimeout(() => {
            statusBadge.textContent = newStatus;
            statusBadge.className = `status-badge ${newStatus}`;
            alert(`Code has been ${newStatus} successfully!`);
            loadRegistrationCodes(); // Reload to update stats
        }, 500);
    }
}

function deleteCode(codeId) {
    if (confirm('Are you sure you want to delete this registration code? This action cannot be undone.')) {
        // Simulate API call
        setTimeout(() => {
            const row = document.querySelector(`tr[data-code-id="${codeId}"]`);
            if (row) {
                row.remove();
                alert('Registration code has been deleted successfully!');
                loadRegistrationCodes(); // Reload to update stats
            }
        }, 500);
    }
}

function initDashboardStats() {
    // Load dashboard statistics
    const stats = {
        totalUsers: 156,
        activeQuizzes: 12,
        quizzesTaken: 1247,
        averageScore: 78.5,
        recentActivity: [
            'User student5@example.com completed JavaScript Fundamentals',
            'New registration code STUDENT_ABC123 generated',
            'User editor2@example.com created new quiz: React Basics',
            'User student7@example.com scored 95% on Web Security quiz'
        ]
    };
    
    updateDashboardStats(stats);
}

function updateDashboardStats(stats) {
    // Update stat cards
    const statElements = {
        'totalUsers': stats.totalUsers,
        'activeQuizzes': stats.activeQuizzes,
        'quizzesTaken': stats.quizzesTaken,
        'averageScore': stats.averageScore + '%'
    };
    
    Object.keys(statElements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = statElements[id];
        }
    });
    
    // Update recent activity
    const activityList = document.getElementById('recentActivityList');
    if (activityList && stats.recentActivity) {
        activityList.innerHTML = stats.recentActivity.map(activity => 
            `<div class="activity-item">${activity}</div>`
        ).join('');
    }
}

// Export functions for global use
window.AdminModule = {
    loadUsers,
    loadRegistrationCodes,
    generateNewCode,
    updateDashboardStats
};