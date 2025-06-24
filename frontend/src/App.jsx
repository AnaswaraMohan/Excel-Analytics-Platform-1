import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ChakraProvider } from '@chakra-ui/react';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';
import ExcelUpload from './pages/ExcelUpload';
import PrivateRoute from './components/PrivateRoute';
import { authService } from './utils/auth';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <div className="App font-dm-regular antialiased">
          <Routes>
            <Route 
              path="/" 
              element={<LandingPage />}
            />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <PrivateRoute>
                <ExcelUpload />
              </PrivateRoute>
            } 
          />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;
