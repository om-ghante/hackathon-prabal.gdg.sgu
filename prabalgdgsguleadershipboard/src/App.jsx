import React from 'react';
import { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Login from './components/Auth/Login';
import MainPage from './components/MainPage';

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
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />}/>
        <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        <Route path='/app' element={<MainPage />}/> 
      </Routes>
    </Router>
  );
}

export default App;
