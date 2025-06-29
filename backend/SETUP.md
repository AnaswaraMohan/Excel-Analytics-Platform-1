# Backend Setup Guide

## MongoDB Connection Fix

The error you're seeing is because the `.env` file is missing. Follow these steps:

### 1. Create `.env` file in the backend directory

Create a file named `.env` in the `backend/` directory with the following content:

```env
# Database Configuration
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster_url/your_database_name?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_for_security

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel
```

### 2. Get MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster if you don't have one
3. Click "Connect" on your cluster
4. Choose "Connect your application"
5. Copy the connection string
6. Replace `<username>`, `<password>`, and `<dbname>` with your actual values

### 3. Generate JWT Secret

You can generate a secure JWT secret using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Restart the server

After creating the `.env` file, restart your backend server:
```bash
cd backend
npm run dev
```

## Quick Fix Options

### Option 1: Use MongoDB Atlas Free Tier
1. Sign up at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Get your connection string
4. Update the `.env` file

### Option 2: Use Local MongoDB (for development)
If you have MongoDB installed locally:
```env
MONGO_URI=mongodb://localhost:27017/excel-analytics
```

### Option 3: Use MongoDB Atlas Sample Data
For testing, you can use the sample data cluster:
```env
MONGO_URI=mongodb+srv://sample_user:sample_password@sample-cluster.mongodb.net/sample_airbnb?retryWrites=true&w=majority
``` 