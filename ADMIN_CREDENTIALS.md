# Admin Account Credentials for SecureTest Platform

This document contains the admin account credentials for the SecureTest online testing platform.

## Admin Accounts

### Primary Admin Account
- **Email:** `admin@securetest.com`
- **Password:** `admin123`
- **Role:** Administrator
- **Status:** Active
- **Description:** Original admin account with full administrative privileges

### Super Admin Account (NEW)
- **Email:** `superadmin@securetest.com`
- **Password:** `SecureAdmin2024!`
- **Role:** Administrator
- **Status:** Active  
- **Description:** New admin account with full administrative privileges and stronger password

## Other Test Accounts

### Editor Account
- **Email:** `editor@securetest.com`
- **Password:** `editor123`
- **Role:** Editor
- **Status:** Active

### Student Account
- **Email:** `student@securetest.com`
- **Password:** `student123`
- **Role:** Student
- **Status:** Active

## Admin Dashboard Features

Both admin accounts have access to:
- User Management (create, edit, suspend, delete users)
- Registration Code Management (generate, activate, deactivate codes)
- Quiz Management
- Analytics and Reports
- Security Logs and Monitoring
- System Settings

## Access Instructions

1. Navigate to the login page: `/pages/auth/login.html`
2. Enter admin credentials (either account above)
3. Click "Login" 
4. You will be redirected to the admin dashboard at `/pages/admin/index.html`

## Security Notes

- The new super admin account uses a stronger password with special characters
- Both accounts have identical privileges and access levels
- The authentication system is currently client-side only for demo purposes
- In a production environment, implement proper server-side authentication and password hashing

## Technical Implementation

The admin accounts are implemented in `/assets/js/auth.js` in the `handleLogin()` function using hardcoded credentials for demonstration purposes.