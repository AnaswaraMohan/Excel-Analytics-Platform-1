# Excel Analytics Platform

🚀 **A comprehensive full-stack MERN application for Excel file analytics with advanced data processing capabilities.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-%5E19.1.0-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-atlas-green)](https://www.mongodb.com/cloud/atlas)

## 📋 Project Overview

The **Excel Analytics Platform** is a modern, full-stack web application designed to revolutionize how users interact with and analyze Excel data. Built with the MERN stack (MongoDB, Express.js, React, Node.js), this platform provides secure file upload, intelligent data processing, and comprehensive analytics capabilities.

### 🎯 Key Features
- **Secure Authentication**: JWT-based user management system
- **Excel File Processing**: Support for .xls and .xlsx files with advanced parsing
- **Data Visualization**: Interactive charts and dashboard (coming soon)
- **Real-time Analytics**: Statistical analysis and insights
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **RESTful API**: Well-documented endpoints for all operations

This is a **5-week progressive development project** building a complete Excel Analytics Platform. Each week introduces new features and capabilities while maintaining a solid foundation for continuous integration and upgrades.

## 📚 Table of Contents

- [Project Phases & Implementation](#-project-phases--continuous-implementation)
- [Project Structure](#-current-project-structure)
- [Current Features](#-current-features--capabilities)
- [API Documentation](#-api-documentation)
- [Getting Started](#-getting-started)
- [Tech Stack](#️-tech-stack)
- [Testing & Usage](#-testing--usage)
- [Contributing](#-contributing)
- [Support & Troubleshooting](#-support--troubleshooting)
- [Future Enhancements](#-future-enhancements--roadmap)
- [License](#-license)

## 🎯 Project Phases & Continuous Implementation

### ✅ **Week 1: Foundation & Authentication** (COMPLETED)
- **Tech Stack Setup**: MERN (MongoDB, Express, React, Node.js)
- **Authentication System**: JWT-based secure authentication
- **User Management**: Registration, login, protected routes
- **UI Framework**: Tailwind CSS with responsive design
- **Database Integration**: MongoDB Atlas connection
- **Core Components**: Navbar, PrivateRoute, Dashboard foundation

### ✅ **Week 2: File Upload & Excel Processing** (COMPLETED)
- **File Upload System**: Multer middleware for Excel files
- **Excel Parsing**: SheetJS integration for data extraction
- **Data Storage**: MongoDB storage with user association
- **Security Features**: File validation, size limits, JWT protection
- **UI Components**: Drag-drop upload, data preview, progress indicators
- **API Endpoints**: Upload, retrieve, and manage Excel data

### 🔄 **Week 3: Data Visualization** (UPCOMING)
- Chart generation with Chart.js/D3.js
- Interactive dashboards
- Custom visualization options
- Export capabilities

### 🔄 **Week 4: Advanced Analytics** (UPCOMING)
- Statistical analysis tools
- Data filtering and sorting
- Comparative analytics
- Report generation

### 🔄 **Week 5: AI Integration & Deployment** (UPCOMING)
- AI-powered insights
- Automated reporting
- Production deployment
- Performance optimization

## 🏗️ Current Project Structure

```
Excel-Analytics-Platform/
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── uploadController.js # File upload & Excel parsing
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT authentication
│   │   └── uploadMulter.js    # File upload middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Upload.js          # File upload schema
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   └── uploadRoutes.js    # File upload routes
│   ├── uploads/               # Temporary file storage
│   ├── .env                   # Environment variables
│   ├── server.js              # Express server
│   └── package.json
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── FileDropzone.jsx # Drag & drop upload
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── ExcelUpload.jsx  # File upload page
│   │   ├── services/
│   │   │   └── uploadService.js # Upload API calls
│   │   ├── utils/
│   │   │   ├── api.js          # Axios configuration
│   │   │   └── auth.js         # Auth service
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🔧 **Current Features & Capabilities**

### **Authentication & Security**
- **JWT-based Authentication**: Secure token-based user sessions
- **Protected Routes**: Role-based access control
- **User Registration/Login**: Complete user management system
- **Password Encryption**: Bcrypt.js for secure password hashing

### **File Processing & Management**
- **Excel File Upload**: Support for .xls and .xlsx formats
- **Drag & Drop Interface**: Intuitive file selection
- **File Validation**: Type checking and size limits (5MB max)
- **Excel Parsing**: SheetJS integration for data extraction
- **Data Preview**: Real-time preview of uploaded data
- **MongoDB Storage**: Structured data storage with user association

### **User Interface & Experience**
- **Responsive Design**: Mobile-first Tailwind CSS implementation
- **Modern UI Components**: Clean, professional interface
- **Real-time Feedback**: Loading states and progress indicators
- **Toast Notifications**: User-friendly success/error messages
- **Interactive Dashboard**: Feature cards and navigation

## 📊 **API Documentation**

### **Authentication Endpoints**
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/profile     # Get user profile (protected)
```

### **File Upload Endpoints**
```
POST /api/upload           # Upload & parse Excel file (protected)
GET  /api/upload          # Get user's upload history (protected)
GET  /api/upload/:id      # Get specific upload data (protected)
```

## 🚀 **Getting Started**

### **Prerequisites**
- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Comes with Node.js
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** - VS Code recommended with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint
  - Thunder Client (for API testing)

### **Installation & Setup**

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Excel-Analytics-Platform.git
   cd Excel-Analytics-Platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create `.env` file in the backend directory:
   ```env
   # Database Configuration
   MONGO_URI=your_mongodb_atlas_connection_string
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_minimum_32_characters
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # File Upload Configuration
   MAX_FILE_SIZE=5242880  # 5MB in bytes
   ALLOWED_FILE_TYPES=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Database Setup**
   - Create a MongoDB Atlas cluster
   - Add your IP address to the whitelist
   - Create a database user
   - Copy the connection string to your `.env` file

5. **Environment Variables**
   - Ensure all environment variables are properly set
   - Never commit the `.env` file to version control

### **Running the Application**

#### **Development Mode** (Recommended)

1. **Start Backend Server** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```
   ✅ Server runs on: http://localhost:5000
   ✅ Hot reload enabled with Nodemon

2. **Start Frontend Development Server** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   ✅ App runs on: http://localhost:5173
   ✅ Hot reload enabled with Vite

#### **Production Mode**

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start Backend in Production**
   ```bash
   cd backend
   npm start
   ```

#### **Using VS Code Tasks** (Recommended)
The project includes VS Code tasks for easy development:
- Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
- Type "Tasks: Run Task"
- Select "Start Backend" to run the backend server

### **Accessing the Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api (if implemented)

## 🛠️ **Tech Stack**

### **Backend Technologies**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (Atlas)
- **Mongoose** - ODM for MongoDB
- **Multer** - File upload middleware
- **SheetJS (xlsx)** - Excel file processing
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-async-handler** - Async error handling
- **cors** - Cross-origin requests
- **dotenv** - Environment variables

### **Frontend Technologies**
- **React 19** - Latest UI library with concurrent features
- **Vite 6** - Next-generation build tool and dev server
- **React Router DOM 7** - Declarative routing for React
- **Tailwind CSS 3** - Utility-first CSS framework
- **Chakra UI 2** - Modern React component library
- **Axios 1.10** - Promise-based HTTP client
- **JWT Decode 4** - JWT token decoding utility
- **React Toastify 11** - Toast notifications
- **React Icons 5** - Popular icon libraries

### **Development Tools**
- **ESLint 9** - Code linting and formatting
- **Prettier** - Code formatting
- **Nodemon** - Auto-restart development server
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🧪 **Testing & Usage**

### **User Flow**
1. **Register/Login**: Create account or sign in
2. **Dashboard Access**: View available features
3. **File Upload**: Navigate to upload page
4. **Excel Processing**: Upload your Excel files (.xls/.xlsx)
5. **Data Preview**: Review parsed data
6. **Continue**: Proceed to analysis (future features)

### **File Upload Process**
1. Select Excel file via drag-drop or file picker
2. Client-side validation (file type, size)
3. Upload with JWT authentication
4. Server-side parsing with SheetJS
5. Data storage in MongoDB
6. Preview display with statistics
7. Success confirmation and navigation options

## 🔒 **Security Features**
- **JWT Authentication**: Secure token-based sessions
- **File Validation**: Type and size restrictions
- **Protected Routes**: Authentication required for uploads
- **Data Sanitization**: Clean headers and input validation
- **Error Handling**: Comprehensive error management
- **File Cleanup**: Temporary file removal after processing

## 🚀 **Future Enhancements & Roadmap**

### **Week 3: Data Visualization**
- Interactive charts and graphs
- Custom visualization options
- Export capabilities
- Advanced filtering

### **Week 4: Advanced Analytics**
- Statistical analysis tools
- Data comparison features
- Automated insights
- Report generation

### **Week 5: AI Integration & Production**
- Machine learning insights
- Predictive analytics
- Production deployment
- Performance optimization
- Monitoring and logging

## 📈 **Project Evolution & Continuous Integration**

This project follows an **iterative development approach** with continuous integration of new features:

- **Modular Architecture**: Each week builds upon the previous foundation
- **Scalable Design**: Components designed for easy extension
- **Version Control**: Git-based development with feature branches
- **Documentation**: Comprehensive docs updated with each iteration
- **Testing Strategy**: Progressive testing implementation
- **Performance Optimization**: Ongoing performance improvements

## 🤝 **Contributing**

We welcome contributions from the community! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines on:

- **Setting up the development environment**
- **Creating feature branches**
- **Code style and standards**
- **Testing requirements**
- **Pull request process**
- **Issue reporting**

### **Quick Contribution Guide**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### **Areas for Contribution**
- 🐛 **Bug fixes and improvements**
- ✨ **New feature implementations**
- 🎨 **UI/UX enhancements**
- 📚 **Documentation updates**
- 🧪 **Testing coverage**
- ⚡ **Performance optimizations**
- 🔒 **Security improvements**

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support & Troubleshooting**

### **Common Issues & Solutions**

#### **Backend Issues**
- **MongoDB Connection Error**
  ```
  Solution: Verify MONGO_URI in .env file and ensure IP is whitelisted in Atlas
  ```
- **JWT Authentication Error**
  ```
  Solution: Check JWT_SECRET is set and tokens are not expired
  ```
- **Port Already in Use**
  ```
  Solution: Kill process on port 5000 or change PORT in .env
  ```

#### **Frontend Issues**
- **CORS Errors**
  ```
  Solution: Ensure backend CORS is configured for http://localhost:5173
  ```
- **Build Failures**
  ```
  Solution: Clear node_modules and package-lock.json, then npm install
  ```
- **Hot Reload Not Working**
  ```
  Solution: Check Vite configuration and restart dev server
  ```

#### **File Upload Issues**
- **File Format Error**: Only .xls and .xlsx files are supported
- **File Size Error**: Maximum file size is 5MB
- **Upload Timeout**: Check network connection and file size

### **Getting Help**
- 📧 **Email**: [your-email@example.com]
- 💬 **Discord**: [Your Discord Server]
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/Excel-Analytics-Platform/issues)
- 📖 **Wiki**: [Project Wiki](https://github.com/your-username/Excel-Analytics-Platform/wiki)

### **Development Notes**
- **Backend**: Runs on port 5000 with auto-restart via Nodemon
- **Frontend**: Runs on port 5173 with Vite's lightning-fast HMR
- **Database**: MongoDB Atlas with collections: `users`, `uploads`
- **File Storage**: Temporary files stored in `backend/uploads/` (auto-cleanup)
- **Authentication**: JWT tokens with 24-hour expiration
- **API Rate Limiting**: Implemented for production security

---

**🎯 Current Status: Week 2 Complete**
- ✅ Authentication system with JWT security
- ✅ Excel file upload & intelligent processing
- ✅ Data preview & management dashboard
- ✅ Responsive UI/UX with Tailwind CSS
- ✅ RESTful API with comprehensive error handling
- 🔄 Ready for Week 3 development (Data Visualization)

**🚀 Quick Start**: Follow the [Installation Guide](#-getting-started) to get started in minutes!

**🤝 Want to Contribute?**: Check out our [Contributing Guidelines](CONTRIBUTING.md) for detailed instructions on how to contribute to this project.
