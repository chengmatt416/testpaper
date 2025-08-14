// File Management JavaScript for SecureShare
document.addEventListener('DOMContentLoaded', function() {
    console.log('File management module loaded');
    
    // Check user access
    checkUserAccess();
    
    initFileInterface();
    initFileUpload();
    initFileSearch();
    loadRecentFiles();
});

// Mock file data
let fileStorage = JSON.parse(localStorage.getItem('fileStorage')) || [];
let userFiles = JSON.parse(localStorage.getItem('userFiles')) || [
    {
        id: 1,
        name: 'Project_Proposal.pdf',
        type: 'pdf',
        size: 2048576, // 2MB
        created: '2025-08-10T10:30:00Z',
        modified: '2025-08-10T15:45:00Z',
        shared: false,
        owner: 'user@secureshare.com'
    },
    {
        id: 2,
        name: 'Budget_Analysis.xlsx',
        type: 'xlsx',
        size: 1024000, // 1MB
        created: '2025-08-12T09:15:00Z',
        modified: '2025-08-12T16:20:00Z',
        shared: true,
        owner: 'user@secureshare.com'
    },
    {
        id: 3,
        name: 'Team_Photo.jpg',
        type: 'jpg',
        size: 5242880, // 5MB
        created: '2025-08-13T14:30:00Z',
        modified: '2025-08-13T14:30:00Z',
        shared: false,
        owner: 'user@secureshare.com'
    }
];

function checkUserAccess() {
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!userRole || !userEmail) {
        alert('Access denied. Please login first.');
        window.location.href = '../auth/login.html';
        return;
    }
    
    // Update user info in UI
    const userEmailElements = document.querySelectorAll('.user-email');
    userEmailElements.forEach(element => {
        if (element) {
            element.textContent = userEmail;
        }
    });
}

function initFileInterface() {
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('userRole');
                localStorage.removeItem('userEmail');
                window.location.href = '../auth/login.html';
            }
        });
    }
    
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.body.classList.toggle('sidebar-collapsed');
        });
    }
}

function initFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    
    // Upload button click
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    // Upload area click
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Drag and drop functionality
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = Array.from(e.dataTransfer.files);
            handleFileUpload(files);
        });
    }
    
    // File input change
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            handleFileUpload(files);
        });
    }
}

function handleFileUpload(files) {
    if (files.length === 0) return;
    
    const uploadModal = document.getElementById('uploadModal');
    const uploadProgress = document.getElementById('uploadProgress');
    
    // Show upload modal
    if (uploadModal) {
        uploadModal.style.display = 'flex';
        uploadProgress.innerHTML = '';
    }
    
    files.forEach((file, index) => {
        // Create progress item
        const progressItem = document.createElement('div');
        progressItem.className = 'upload-item';
        progressItem.innerHTML = `
            <div class="upload-item-info">
                <i class="fas fa-file"></i>
                <span class="filename">${file.name}</span>
                <span class="filesize">${formatFileSize(file.size)}</span>
            </div>
            <div class="upload-item-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <span class="progress-text">0%</span>
            </div>
        `;
        uploadProgress.appendChild(progressItem);
        
        // Simulate upload progress
        simulateUpload(progressItem, file, index);
    });
}

function simulateUpload(progressItem, file, index) {
    const progressFill = progressItem.querySelector('.progress-fill');
    const progressText = progressItem.querySelector('.progress-text');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Add file to storage
            const newFile = {
                id: Date.now() + index,
                name: file.name,
                type: file.name.split('.').pop().toLowerCase(),
                size: file.size,
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
                shared: false,
                owner: localStorage.getItem('userEmail')
            };
            
            userFiles.unshift(newFile);
            localStorage.setItem('userFiles', JSON.stringify(userFiles));
            
            // Mark as complete
            progressItem.classList.add('upload-complete');
            progressText.textContent = 'Complete';
            
            // Refresh file grid
            loadRecentFiles();
        }
        
        progressFill.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';
    }, 200);
}

function initFileSearch() {
    const searchInput = document.getElementById('fileSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterFiles(searchTerm);
        });
    }
}

function filterFiles(searchTerm) {
    const filteredFiles = userFiles.filter(file => 
        file.name.toLowerCase().includes(searchTerm)
    );
    displayFiles(filteredFiles);
}

function loadRecentFiles() {
    // Sort by creation date and take the most recent 6
    const recentFiles = userFiles
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .slice(0, 6);
    
    displayFiles(recentFiles);
}

function displayFiles(files) {
    const filesGrid = document.getElementById('recentFilesGrid');
    if (!filesGrid) return;
    
    if (files.length === 0) {
        filesGrid.innerHTML = '<p class="no-files">No files found</p>';
        return;
    }
    
    filesGrid.innerHTML = files.map(file => `
        <div class="file-item" data-file-id="${file.id}">
            <div class="file-icon">
                <i class="fas ${getFileIcon(file.type)}"></i>
            </div>
            <div class="file-info">
                <h4 class="file-name" title="${file.name}">${file.name}</h4>
                <p class="file-details">${formatFileSize(file.size)} • ${formatDate(file.modified)}</p>
                <div class="file-actions">
                    <button class="action-btn small" onclick="downloadFile(${file.id})" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="action-btn small" onclick="shareFile(${file.id})" title="Share">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="action-btn small" onclick="deleteFile(${file.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            ${file.shared ? '<div class="shared-indicator"><i class="fas fa-share-alt"></i></div>' : ''}
        </div>
    `).join('');
}

function getFileIcon(type) {
    const iconMap = {
        'pdf': 'fa-file-pdf',
        'doc': 'fa-file-word',
        'docx': 'fa-file-word',
        'xls': 'fa-file-excel',
        'xlsx': 'fa-file-excel',
        'ppt': 'fa-file-powerpoint',
        'pptx': 'fa-file-powerpoint',
        'jpg': 'fa-file-image',
        'jpeg': 'fa-file-image',
        'png': 'fa-file-image',
        'gif': 'fa-file-image',
        'mp4': 'fa-file-video',
        'avi': 'fa-file-video',
        'mp3': 'fa-file-audio',
        'wav': 'fa-file-audio',
        'zip': 'fa-file-archive',
        'rar': 'fa-file-archive',
        'txt': 'fa-file-alt',
        'default': 'fa-file'
    };
    
    return iconMap[type] || iconMap['default'];
}

function formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    
    return date.toLocaleDateString();
}

// File actions
function downloadFile(fileId) {
    const file = userFiles.find(f => f.id === fileId);
    if (file) {
        // In a real application, this would trigger an actual download
        alert(`Downloading ${file.name}...`);
        
        // Simulate download
        const link = document.createElement('a');
        link.href = '#';
        link.download = file.name;
        link.textContent = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function shareFile(fileId) {
    const file = userFiles.find(f => f.id === fileId);
    if (file) {
        const shareUrl = `${window.location.origin}/share/${file.id}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert(`Share link copied to clipboard!\n${shareUrl}`);
            
            // Mark file as shared
            file.shared = true;
            localStorage.setItem('userFiles', JSON.stringify(userFiles));
            loadRecentFiles();
        }).catch(() => {
            alert(`Share link: ${shareUrl}`);
        });
    }
}

function deleteFile(fileId) {
    const file = userFiles.find(f => f.id === fileId);
    if (file && confirm(`Are you sure you want to delete "${file.name}"?`)) {
        userFiles = userFiles.filter(f => f.id !== fileId);
        localStorage.setItem('userFiles', JSON.stringify(userFiles));
        loadRecentFiles();
        alert('File deleted successfully!');
    }
}

// Quick action functions
function createFolder() {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
        const newFolder = {
            id: Date.now(),
            name: folderName,
            type: 'folder',
            size: 0,
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            shared: false,
            owner: localStorage.getItem('userEmail')
        };
        
        userFiles.unshift(newFolder);
        localStorage.setItem('userFiles', JSON.stringify(userFiles));
        loadRecentFiles();
        alert(`Folder "${folderName}" created successfully!`);
    }
}

function viewShared() {
    const sharedFiles = userFiles.filter(file => file.shared);
    displayFiles(sharedFiles);
}

function manageStorage() {
    const totalSize = userFiles.reduce((sum, file) => sum + (file.size || 0), 0);
    const totalSizeFormatted = formatFileSize(totalSize);
    const fileCount = userFiles.length;
    
    alert(`Storage Information:\n\nTotal Files: ${fileCount}\nTotal Size: ${totalSizeFormatted}\nStorage Limit: 10 GB`);
}

// Close modal functionality
document.addEventListener('click', function(e) {
    if (e.target.id === 'closeUploadModal' || e.target.closest('.modal') === e.target) {
        const uploadModal = document.getElementById('uploadModal');
        if (uploadModal) {
            uploadModal.style.display = 'none';
        }
    }
});

// Export functions for global use
window.FileManager = {
    downloadFile,
    shareFile,
    deleteFile,
    createFolder,
    viewShared,
    manageStorage
};