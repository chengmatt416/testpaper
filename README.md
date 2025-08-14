# SecureTest - Online Testing Platform

An advanced online testing platform with anti-cheating measures and secure quiz management.

## Features

- **Advanced Quiz Generation**: Create diverse question types including multiple choice, short answer, and essay questions
- **Anti-Cheating Measures**: Browser focus detection, screen recording prevention, and AI-powered content similarity checks
- **Role Management**: Separate interfaces for administrators, editors, and test-takers
- **Secure Registration**: One-time registration codes controlled by administrators

## Live Demo

The application is deployed on GitHub Pages: [https://chengmatt416.github.io/testpaper/](https://chengmatt416.github.io/testpaper/)

## Getting Started

1. Visit the live demo URL above
2. Click "Login" or "Register" to get started
3. Use the platform based on your role (admin, editor, or test-taker)

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
│   │   └── styles.css       # Main stylesheet
│   └── js/
│       ├── app.js           # Main application logic
│       ├── auth.js          # Authentication logic
│       ├── admin.js         # Admin functionality
│       ├── quiz-taking.js   # Quiz taking functionality
│       └── quiz-creator.js  # Quiz creation functionality
└── pages/
    ├── auth/
    │   ├── login.html       # Login page
    │   └── register.html    # Registration page
    ├── admin/
    │   ├── index.html       # Admin dashboard
    │   ├── users.html       # User management
    │   └── regcodes.html    # Registration codes
    ├── editor/
    │   └── create-quiz.html # Quiz creation
    └── tester/
        └── take-quiz.html   # Quiz taking interface
```

## Technology Stack

- HTML5
- CSS3
- JavaScript (ES6+)
- Font Awesome Icons
- LocalStorage for data persistence

## Deployment

The application is automatically deployed to GitHub Pages using GitHub Actions when changes are pushed to the main branch.