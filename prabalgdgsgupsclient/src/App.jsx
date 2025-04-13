import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './components/Auth/Login';
import MainPage from './pages/MainPage';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  useEffect(() => {
    console.log(
      "%cStop!",
      "color: red; font-size: 50px; font-weight: bold;"
    );
    console.log(
      "%cThis is a browser feature intended for developers...",
      "font-size: 16px;"
    );
  }, []);
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;