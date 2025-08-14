// Admin Dashboard JavaScript for SecureTest Platform

document.addEventListener('DOMContentLoaded', function() {
    // Check if user has admin privileges
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = '../auth/login.html';
        return;
    }

    // Initialize admin dashboard
    initializeAdminDashboard();
    loadUserManagement();
    loadRegistrationCodes();
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

function initializeAdminDashboard() {
    // Update user info in header
    const userEmail = localStorage.getItem('userEmail');
    const userEmailElement = document.getElementById('userEmail');
    if (userEmailElement && userEmail) {
        userEmailElement.textContent = userEmail;
    }

    // Load dashboard statistics
    loadDashboardStats();
    
    // Initialize tab navigation
    initializeTabs();
}

function loadDashboardStats() {
    // Mock data - in real app, this would come from API
    const stats = {
        totalUsers: 245,
        activeQuizzes: 12,
        completedTests: 1834,
        registrationCodes: 8
    };

    // Update stat cards
    const statElements = {
        totalUsers: document.getElementById('totalUsers'),
        activeQuizzes: document.getElementById('activeQuizzes'),
        completedTests: document.getElementById('completedTests'),
        registrationCodes: document.getElementById('registrationCodes')
    };

    Object.keys(stats).forEach(key => {
        if (statElements[key]) {
            statElements[key].textContent = stats[key];
        }
    });
}

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

function loadUserManagement() {
    // Mock user data
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student', status: 'active', joinDate: '2024-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'editor', status: 'active', joinDate: '2024-01-20' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'student', status: 'suspended', joinDate: '2024-02-01' }
    ];

    const userTableBody = document.getElementById('userTableBody');
    if (userTableBody) {
        userTableBody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="user-info">
                        <img src="../../assets/img/avatar-placeholder.png" alt="User Avatar">
                        <div>
                            <div class="user-name">${user.name}</div>
                            <div class="user-email">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td><span class="role-badge ${user.role}">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span></td>
                <td><span class="status-badge ${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
                <td>${user.joinDate}</td>
                <td>
                    <div class="user-actions">
                        <button class="btn-small btn-primary" onclick="editUser(${user.id})">Edit</button>
                        <button class="btn-small btn-danger" onclick="deleteUser(${user.id})">Delete</button>
                        ${user.status === 'active' ? 
                            `<button class="btn-small btn-warning" onclick="suspendUser(${user.id})">Suspend</button>` : 
                            `<button class="btn-small btn-success" onclick="activateUser(${user.id})">Activate</button>`
                        }
                    </div>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    }
}

function loadRegistrationCodes() {
    // Mock registration codes data
    const codes = [
        { id: 1, code: 'TEST2024', role: 'student', createdBy: 'admin@test.com', createdDate: '2024-01-01', used: false },
        { id: 2, code: 'STUDENT2024', role: 'student', createdBy: 'admin@test.com', createdDate: '2024-01-05', used: true },
        { id: 3, code: 'EDITOR2024', role: 'editor', createdBy: 'admin@test.com', createdDate: '2024-01-10', used: false }
    ];

    const codesTableBody = document.getElementById('codesTableBody');
    if (codesTableBody) {
        codesTableBody.innerHTML = '';
        
        codes.forEach(code => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><code>${code.code}</code></td>
                <td><span class="role-badge ${code.role}">${code.role.charAt(0).toUpperCase() + code.role.slice(1)}</span></td>
                <td>${code.createdBy}</td>
                <td>${code.createdDate}</td>
                <td><span class="status-badge ${code.used ? 'used' : 'active'}">${code.used ? 'Used' : 'Active'}</span></td>
                <td>
                    <div class="code-actions">
                        <button class="btn-small btn-primary" onclick="copyCode('${code.code}')">Copy</button>
                        <button class="btn-small btn-danger" onclick="deleteCode(${code.id})">Delete</button>
                    </div>
                </td>
            `;
            codesTableBody.appendChild(row);
        });
    }

    // Generate new registration code form
    const generateCodeForm = document.getElementById('generateCodeForm');
    if (generateCodeForm) {
        generateCodeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            generateNewCode();
        });
    }
}

function generateNewCode() {
    const roleSelect = document.getElementById('codeRole');
    const selectedRole = roleSelect.value;
    
    if (!selectedRole) {
        alert('Please select a role for the registration code.');
        return;
    }
    
    // Generate random code
    const newCode = generateRandomCode();
    
    // Mock saving the code
    setTimeout(() => {
        alert(`Registration code generated: ${newCode}`);
        loadRegistrationCodes(); // Refresh the table
        roleSelect.value = ''; // Reset form
    }, 500);
}

function generateRandomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// User management functions
function editUser(userId) {
    alert(`Edit user with ID: ${userId}`);
    // In real app, this would open a modal or redirect to edit page
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        alert(`User with ID ${userId} deleted.`);
        loadUserManagement(); // Refresh the table
    }
}

function suspendUser(userId) {
    if (confirm('Are you sure you want to suspend this user?')) {
        alert(`User with ID ${userId} suspended.`);
        loadUserManagement(); // Refresh the table
    }
}

function activateUser(userId) {
    if (confirm('Are you sure you want to activate this user?')) {
        alert(`User with ID ${userId} activated.`);
        loadUserManagement(); // Refresh the table
    }
}

// Registration code functions
function copyCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        alert(`Code "${code}" copied to clipboard!`);
    }).catch(() => {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert(`Code "${code}" copied to clipboard!`);
    });
}

function deleteCode(codeId) {
    if (confirm('Are you sure you want to delete this registration code?')) {
        alert(`Registration code with ID ${codeId} deleted.`);
        loadRegistrationCodes(); // Refresh the table
    }
}

function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    alert('Logged out successfully!');
    window.location.href = '../../index.html';
}

// Add some CSS for the admin interface
const adminStyles = `
    .tab-btn {
        background: transparent;
        border: none;
        padding: 1rem 2rem;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 0.3s ease;
    }
    
    .tab-btn.active {
        border-bottom-color: #667eea;
        color: #667eea;
    }
    
    .tab-content {
        display: none;
        padding: 2rem 0;
    }
    
    .tab-content.active {
        display: block;
    }
    
    .role-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .role-badge.admin {
        background: #dc3545;
        color: white;
    }
    
    .role-badge.editor {
        background: #fd7e14;
        color: white;
    }
    
    .role-badge.student {
        background: #28a745;
        color: white;
    }
    
    .status-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .status-badge.active {
        background: #28a745;
        color: white;
    }
    
    .status-badge.suspended {
        background: #dc3545;
        color: white;
    }
    
    .status-badge.used {
        background: #6c757d;
        color: white;
    }
    
    .btn-small {
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
        margin: 0 0.25rem;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .btn-primary {
        background: #667eea;
        color: white;
    }
    
    .btn-danger {
        background: #dc3545;
        color: white;
    }
    
    .btn-warning {
        background: #ffc107;
        color: #212529;
    }
    
    .btn-success {
        background: #28a745;
        color: white;
    }
    
    .user-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .user-info img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
    }
    
    .user-name {
        font-weight: 600;
    }
    
    .user-email {
        font-size: 0.8rem;
        color: #666;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
    }
    
    th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }
    
    th {
        background: #f8f9fa;
        font-weight: 600;
    }
`;

// Add the styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = adminStyles;
document.head.appendChild(styleSheet);