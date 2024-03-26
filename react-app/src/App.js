import React from 'react'
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Pages
import LandingPage from './public/LandingPage';
import LoginPage from './auth/Login';
import ForgotPasswordPage from './auth/ForgotPassword';
import ResetPasswordPage from './auth/ResetPassword';
import AdminDashboard from './admin/AdminDash';
import STSManagerDashboard from './sts_mang/StsDash';
import LandfillManagerDashboard from './landfil_mang/LangfilDash';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/reset-password' element={<ResetPasswordPage />} />
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/sts/dashboard' element={<STSManagerDashboard />} />
          <Route path='/landfill/dashboard' element={<LandfillManagerDashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
