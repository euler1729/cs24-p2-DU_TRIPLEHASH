import React from 'react'
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Pages
import LandingPage from './public/LandingPage';
import LoginPage from './auth/Login';
import ForgotPasswordPage from './auth/ForgotPassword';
import ResetPasswordPage from './auth/ResetPassword';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/reset-password' element={<ResetPasswordPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
