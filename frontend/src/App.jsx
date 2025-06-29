import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import './App.css';

import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';
import ExcelUpload from './pages/ExcelUpload';
import DataVisualization from './pages/DataVisualization';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import OAuthCallback from './pages/OAuthCallback';
import PrivateRoute from './components/PrivateRoute';
import { authService } from './utils/auth';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <div className="App font-primary antialiased">
          <Routes>
            <Route 
              path="/" 
              element={<LandingPage />}
            />
            <Route 
              path="/oauth-callback" 
              element={<OAuthCallback />}
            />
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
            <Route 
              path="/visualize/:id" 
              element={
                <PrivateRoute>
                  <DataVisualization />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <PrivateRoute>
                  <Analytics />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              } 
            />
          </Routes>
          
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;
