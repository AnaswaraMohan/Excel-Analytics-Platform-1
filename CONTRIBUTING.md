# Contributing to Excel Analytics Platform

🎉 **Thank you for your interest in contributing to the Excel Analytics Platform!** 

This document provides comprehensive guidelines for contributing to our project. Whether you're fixing bugs, adding features, improving documentation, or suggesting enhancements, your contributions are valuable and appreciated.

## 📋 Table of Contents

- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Project Structure](#-project-structure)
- [Development Workflow](#-development-workflow)
- [Coding Standards](#-coding-standards)
- [Testing Guidelines](#-testing-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Issue Guidelines](#-issue-guidelines)
- [Communication](#-communication)

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v8.0.0 or higher)
- **Git** - [Download](https://git-scm.com/)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Code Editor** - VS Code recommended

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "rangav.vscode-thunder-client",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## 🛠️ Development Setup

### 1. Fork and Clone the Repository

```bash
# Fork the repository on GitHub first, then clone your fork
git clone https://github.com/YOUR-USERNAME/Excel-Analytics-Platform.git
cd Excel-Analytics-Platform

# Add the original repository as upstream
git remote add upstream https://github.com/ORIGINAL-OWNER/Excel-Analytics-Platform.git
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

Create environment files:

**Backend (.env)**
```bash
cd backend
cp .env.example .env  # If example exists, otherwise create new
```

```env
# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/excel-analytics?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_at_least_32_characters_long

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=5242880  # 5MB in bytes
ALLOWED_FILE_TYPES=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 4. Database Setup

1. **Create MongoDB Atlas Cluster**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (free tier available)
   - Create a database user
   - Whitelist your IP address

2. **Configure Connection**
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Update `MONGO_URI` in your `.env` file

### 5. Verify Installation

```bash
# Start backend (Terminal 1)
cd backend
npm run dev

# Start frontend (Terminal 2)
cd frontend
npm run dev
```

Visit:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🏗️ Project Structure

Understanding the project structure is crucial for effective contribution:

```
Excel-Analytics-Platform/
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/           # Business logic
│   │   ├── authController.js  # Authentication handlers
│   │   └── uploadController.js # File upload handlers
│   ├── middleware/            # Custom middleware
│   │   ├── authMiddleware.js  # JWT authentication
│   │   └── uploadMulter.js    # File upload middleware
│   ├── models/                # Mongoose schemas
│   │   ├── User.js            # User data model
│   │   └── Upload.js          # Upload data model
│   ├── routes/                # API route definitions
│   │   ├── authRoutes.js      # Authentication routes
│   │   └── uploadRoutes.js    # File upload routes
│   ├── uploads/               # Temporary file storage
│   ├── utils/                 # Utility functions
│   ├── .env                   # Environment variables
│   ├── server.js              # Express server
│   └── package.json
├── frontend/                   # React + Vite
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── FileDropzone.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ExcelUpload.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Register.jsx
│   │   ├── services/          # API service functions
│   │   │   └── uploadService.js
│   │   ├── utils/             # Utility functions
│   │   │   ├── api.js         # Axios configuration
│   │   │   └── auth.js        # Authentication utilities
│   │   ├── styles/            # CSS and styling
│   │   ├── App.jsx            # Main App component
│   │   └── main.jsx           # React entry point
│   └── package.json
├── docs/                      # Project documentation
├── .gitignore
├── CONTRIBUTING.md            # This file
├── LICENSE
└── README.md
```

## 🔄 Development Workflow

### Branch Strategy

We follow a **Git Flow** inspired workflow:

1. **Main Branches**
   - `main`: Production-ready code
   - `develop`: Integration branch for features

2. **Feature Branches**
   - `feature/feature-name`: New features
   - `bugfix/bug-description`: Bug fixes
   - `hotfix/critical-fix`: Critical production fixes
   - `docs/documentation-update`: Documentation changes

### Creating a New Branch

```bash
# Switch to develop branch
git checkout develop
git pull upstream develop

# Create and switch to feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b bugfix/issue-description
```

### Making Changes

1. **Make your changes** in small, logical commits
2. **Test your changes** thoroughly
3. **Update documentation** if necessary
4. **Follow coding standards** (see below)

### Committing Changes

Use conventional commit messages:

```bash
# Format: type(scope): description
git commit -m "feat(upload): add drag and drop functionality"
git commit -m "fix(auth): resolve JWT token expiration issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(dashboard): improve responsive layout"
git commit -m "refactor(api): optimize database queries"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Staying Up to Date

```bash
# Fetch latest changes from upstream
git fetch upstream

# Merge latest develop into your branch
git checkout your-branch-name
git merge upstream/develop

# Or rebase your branch onto develop
git rebase upstream/develop
```

## 📝 Coding Standards

### General Principles

- **Write clean, readable code**
- **Follow DRY (Don't Repeat Yourself) principle**
- **Use meaningful variable and function names**
- **Add comments for complex logic**
- **Keep functions small and focused**

### JavaScript/React Standards

```javascript
// ✅ Good: Use arrow functions for components
const Dashboard = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Component content */}
    </div>
  );
};

// ✅ Good: Use meaningful prop names
const FileUpload = ({ onUploadSuccess, maxFileSize, allowedTypes }) => {
  // Component logic
};

// ✅ Good: Handle errors gracefully
const fetchUserData = async () => {
  try {
    const response = await api.get('/user/profile');
    setUserData(response.data);
  } catch (error) {
    toast.error('Failed to fetch user data');
    console.error('Error fetching user data:', error);
  }
};
```

### Node.js/Express Standards

```javascript
// ✅ Good: Use async/await with proper error handling
const uploadFile = asyncHandler(async (req, res) => {
  try {
    const { file } = req;
    
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Process file logic
    const result = await processExcelFile(file);
    
    res.status(201).json({
      success: true,
      data: result,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'File upload failed' 
    });
  }
});

// ✅ Good: Use proper middleware structure
const validateFileUpload = (req, res, next) => {
  const { file } = req;
  
  if (!file) {
    return res.status(400).json({ message: 'No file provided' });
  }
  
  if (!allowedFileTypes.includes(file.mimetype)) {
    return res.status(400).json({ message: 'Invalid file type' });
  }
  
  next();
};
```

### CSS/Tailwind Standards

```jsx
// ✅ Good: Use Tailwind utility classes consistently
const Card = ({ children, className = "" }) => (
  <div className={`
    bg-white 
    rounded-lg 
    shadow-md 
    p-6 
    border 
    border-gray-200 
    hover:shadow-lg 
    transition-shadow 
    duration-200 
    ${className}
  `}>
    {children}
  </div>
);

// ✅ Good: Create reusable component classes
const Button = ({ variant = "primary", size = "md", children, ...props }) => {
  const baseClasses = "font-medium rounded-lg transition-colors duration-200";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

### File Naming Conventions

- **Components**: PascalCase (`UserProfile.jsx`)
- **Utilities**: camelCase (`apiHelpers.js`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.js`)
- **Stylesheets**: kebab-case (`user-profile.css`)

## 🧪 Testing Guidelines

### Frontend Testing

```javascript
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  test('renders login form', () => {
    renderLogin();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  test('displays validation errors for empty fields', async () => {
    renderLogin();
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    
    fireEvent.click(submitButton);
    
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });
});
```

### Backend Testing

```javascript
// API endpoint testing with Jest and Supertest
const request = require('supertest');
const app = require('../server');

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    test('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
    });

    test('should return error for duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });
  });
});
```

### Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# Run tests with coverage
npm run test:coverage
```

## 📥 Pull Request Process

### Before Creating a Pull Request

1. **Ensure your code follows our standards**
2. **Add or update tests** for new functionality
3. **Update documentation** if necessary
4. **Test your changes** thoroughly
5. **Rebase your branch** onto the latest develop

### Creating the Pull Request

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create the PR** on GitHub with:
   - **Clear title** describing the change
   - **Detailed description** of what was changed and why
   - **Screenshots** for UI changes
   - **Testing instructions** for reviewers

### Pull Request Template

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Changes Made
- List specific changes made
- Include any new dependencies added
- Mention any configuration changes

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing (if applicable)

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows the project's coding standards
- [ ] Self-review of code completed
- [ ] Tests added for new functionality
- [ ] Documentation updated
- [ ] No breaking changes introduced
```

### Review Process

1. **Automated checks** must pass (ESLint, tests, etc.)
2. **At least one reviewer** must approve
3. **Address feedback** promptly and professionally
4. **Squash commits** if requested before merging

## 🐛 Issue Guidelines

### Reporting Bugs

Use the bug report template:

```markdown
**Bug Description**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. Windows 10, macOS Big Sur]
- Browser: [e.g. Chrome 96, Firefox 95]
- Node.js Version: [e.g. 16.14.0]
- Project Version: [e.g. v1.2.0]

**Additional Context**
Add any other context about the problem here.
```

### Feature Requests

Use the feature request template:

```markdown
**Feature Description**
A clear and concise description of what you want to happen.

**Problem Statement**
Describe the problem you're trying to solve.

**Proposed Solution**
Describe the solution you'd like.

**Alternatives Considered**
Describe any alternative solutions or features you've considered.

**Additional Context**
Add any other context, mockups, or examples about the feature request here.
```

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority: high`: High priority issue
- `priority: medium`: Medium priority issue
- `priority: low`: Low priority issue

## 💬 Communication

### Code Reviews

- **Be respectful** and constructive in feedback
- **Explain the "why"** behind suggestions
- **Ask questions** instead of making demands
- **Acknowledge good practices** in the code

### Getting Help

- **Discord**: [Project Discord Server]
- **Discussions**: [GitHub Discussions]
- **Email**: [maintainer-email@example.com]

### Community Guidelines

- Be respectful and inclusive
- Follow the Code of Conduct
- Help others learn and grow
- Share knowledge and best practices

## 🏷️ Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Workflow

1. **Feature freeze** on develop branch
2. **Create release branch**: `release/v1.2.0`
3. **Final testing** and bug fixes
4. **Merge to main** and tag release
5. **Deploy to production**
6. **Merge back to develop**

## 📚 Additional Resources

### Learning Resources

- [React Documentation](https://reactjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB University](https://university.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Tools and Extensions

- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/)
- [Thunder Client](https://www.thunderclient.com/) - VS Code API testing
- [Postman](https://www.postman.com/) - API development and testing

## 🙏 Thank You

Thank you for contributing to the Excel Analytics Platform! Your efforts help make this project better for everyone. If you have any questions or need help getting started, don't hesitate to reach out to the maintainers or community.

Happy coding! 🚀
