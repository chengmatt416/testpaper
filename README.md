# SecureShare - File Sharing Platform

A modern, secure file sharing platform with enterprise-grade features and intuitive user interface.

## Features

- **Easy File Upload**: Drag and drop files or browse to upload documents, images, videos, and more
- **Secure File Sharing**: Generate secure links, set permissions, and collaborate with teams
- **Smart Organization**: Create folders, organize files, and find them quickly with search
- **Storage Analytics**: Monitor usage, track activity, and manage storage efficiently
- **Role Management**: Separate interfaces for administrators, managers, and users
- **Enterprise Security**: End-to-end encryption, secure access controls, and detailed audit logs

## Live Demo

The application is deployed on GitHub Pages: [https://chengmatt416.github.io/testpaper/](https://chengmatt416.github.io/testpaper/)

## Demo Credentials

To test the platform, use these demo accounts:

### Admin Access
- Email: `admin@secureshare.com`
- Password: `admin123`
- Features: User management, system administration, full access

### Manager Access  
- Email: `manager@secureshare.com`
- Password: `manager123`
- Features: File management, sharing, team collaboration

### User Access
- Email: `user@secureshare.com` 
- Password: `user123`
- Features: File upload, sharing, basic file management

## Getting Started

1. Visit the live demo URL above
2. Click "Get Started" or "Login"
3. Use one of the demo accounts above
4. Start uploading and sharing files!

## Local Development

To run locally:

1. Clone this repository
2. Navigate to the "Online Test Platform" directory
3. Open `index.html` in your browser or serve with a local web server:
   ```bash
   cd "Online Test Platform"
   python3 -m http.server 8000
   ```
4. Open http://localhost:8000 in your browser

## Project Structure

```
Online Test Platform/
├── index.html              # Main homepage
├── assets/
│   ├── css/
│   │   └── styles.css       # Main stylesheet with file sharing UI
│   └── js/
│       ├── app.js           # Main application logic
│       ├── auth.js          # Authentication system
│       ├── admin.js         # Admin functionality  
│       └── files.js         # File management system
└── pages/
    ├── auth/
    │   ├── login.html       # Login page
    │   └── register.html    # Registration page
    ├── admin/
    │   ├── index.html       # Admin dashboard
    │   ├── users.html       # User management
    │   └── regcodes.html    # Registration codes
    └── files/
        └── dashboard.html   # File management interface
```

## Key Features Implemented

### File Management
- **Drag & Drop Upload**: Intuitive file upload with progress tracking
- **File Organization**: Create folders and organize files efficiently
- **File Actions**: Download, share, and delete files with one click
- **Search & Filter**: Find files quickly by name or type
- **File Preview**: Visual file type indicators and metadata display

### Sharing & Collaboration  
- **Secure Links**: Generate shareable links for any file
- **Permission Control**: Manage who can access shared files
- **Team Collaboration**: Share files with team members
- **Activity Tracking**: Monitor file access and sharing activity

### Storage & Analytics
- **Usage Monitoring**: Track storage usage and file counts
- **Activity Dashboard**: View recent file operations
- **Storage Limits**: Monitor and manage storage quotas
- **Performance Metrics**: Analyze upload/download patterns

### Security Features
- **User Authentication**: Secure login with role-based access
- **Access Controls**: Granular permissions for files and folders
- **Audit Logging**: Track all file operations and user activity
- **Secure URLs**: Time-limited and encrypted sharing links

## Technology Stack

- HTML5 & CSS3
- JavaScript (ES6+)
- Font Awesome Icons
- LocalStorage for data persistence
- Responsive Design
- Progressive Web App features

## Deployment

The application is automatically deployed to GitHub Pages using GitHub Actions when changes are pushed to the main branch. The deployment workflow handles:

- Automatic building and optimization
- Static file serving
- HTTPS security
- Global CDN distribution

## Browser Support

- Chrome 70+
- Firefox 65+  
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.