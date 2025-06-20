# Excel Analytics Platform

🚀 **A comprehensive full-stack MERN application for Excel file analytics with advanced data processing capabilities.**

## 📋 Project Overview

This is a **5-week progressive development project** building a complete Excel Analytics Platform. Each week introduces new features and capabilities while maintaining a solid foundation for continuous integration and upgrades.

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
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### **Installation & Setup**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Excel-Analytics-Platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create `.env` file with:
   ```env
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### **Running the Application**

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on: http://localhost:5000

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   App runs on: http://localhost:5173

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
- **React** - UI library
- **Vite** - Build tool & dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **jwt-decode** - JWT token decoding
- **react-toastify** - Toast notifications
- **react-icons** - Icon components

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

This project welcomes contributions for:
- Bug fixes and improvements
- New feature implementations  
- UI/UX enhancements
- Documentation updates
- Testing coverage
- Performance optimizations

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support & Troubleshooting**

### **Common Issues**
- **MongoDB Connection**: Ensure Atlas connection string is correct
- **JWT Errors**: Verify JWT_SECRET is set in environment
- **File Upload**: Check file format (.xls/.xlsx) and size (<5MB)
- **CORS Issues**: Ensure backend CORS is configured for frontend URL

### **Development Notes**
- Backend runs on port 5000
- Frontend runs on port 5173 (Vite default)
- MongoDB collections: users, uploads
- File uploads temporarily stored in backend/uploads/

---

**🎯 Current Status: Week 2 Complete**
- ✅ Authentication system
- ✅ Excel file upload & processing
- ✅ Data preview & management
- ✅ Responsive UI/UX
- 🔄 Ready for Week 3 development
