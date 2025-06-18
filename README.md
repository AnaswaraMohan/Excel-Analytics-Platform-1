# Excel Analytics Platform - Week 1

A full-stack MERN application for Excel file analytics with JWT-based authentication.

## 🚀 Features Implemented (Week 1)

- ✅ Full MERN stack setup (MongoDB, Express, React, Node.js)
- ✅ JWT-based user authentication
- ✅ User registration and login
- ✅ Protected dashboard routes
- ✅ Responsive UI with Tailwind CSS
- ✅ Clean and modern design
- ✅ User/Admin role system
- ✅ Toast notifications
- ✅ MongoDB Atlas integration

## 🏗️ Project Structure

```
Excel-Analytics-Platform/
├── backend/                 # Node.js + Express API
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/
│   │   └── authController.js # Auth logic
│   ├── middleware/
│   │   └── authMiddleware.js # JWT middleware
│   ├── models/
│   │   └── User.js         # User model
│   ├── routes/
│   │   └── authRoutes.js   # Auth routes
│   ├── .env                # Environment variables
│   ├── server.js           # Express server
│   └── package.json
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── utils/
│   │   │   ├── api.js      # Axios configuration
│   │   │   └── auth.js     # Auth service
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (Atlas)
- **Mongoose** - ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin requests
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **jwt-decode** - Token decoding
- **react-toastify** - Notifications

## 🚦 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ezDecode/Excel-Analytics-Platform.git
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

### Running the Application

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

## 🔐 Authentication

### User Registration
- Navigate to `/register`
- Provide: Name, Email, Password, Confirm Password
- Automatic redirect to dashboard upon success

### User Login
- Navigate to `/login`
- Provide: Email, Password
- JWT token stored in localStorage
- Automatic redirect to dashboard upon success

### Protected Routes
- Dashboard (`/dashboard`) requires authentication
- Automatic redirect to login if not authenticated
- Token validation on each request

## 📱 UI Components

### Login Page
- Centered form layout
- Email/password fields
- Sign up link
- Toast notifications for feedback

### Register Page
- Centered form layout
- Name, email, password, confirm password fields
- Sign in link
- Password validation

### Dashboard
- Welcome section
- User profile information
- Feature cards (Coming Soon placeholders)
- Getting started guide
- Responsive navigation

### Navigation
- User info display
- Role badge (user/admin)
- Logout functionality

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile (protected)

## 🔮 Upcoming Features (Week 2-5)

- **Week 2**: File upload functionality for Excel files
- **Week 3**: Interactive charts and data visualization
- **Week 4**: AI-powered insights and recommendations
- **Week 5**: Advanced analytics and reporting features

## 🏷️ User Roles

- **User**: Standard access to upload and view analytics
- **Admin**: Additional administrative privileges (future implementation)

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Token expiration (30 days)
- Input validation
- CORS enabled

## 📄 License

This project is licensed under the ISC License.

---

**Week 1 Status: ✅ Complete**
- Full authentication system implemented
- Clean, responsive UI
- MongoDB integration
- Protected routes working
- Ready for Week 2 development
