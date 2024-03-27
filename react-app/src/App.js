import React from 'react'
import './App.css';
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from 'react-router-dom';

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
          <Route path="/" element={<HomeX />} >
            <Route path='/' element={<LandingPage />} />
          </Route>

          <Route path='/login' element={<LoginPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/reset-password' element={<ResetPasswordPage />} />


          <Route path='/admin/dashboard' element={<Protected />} >
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
          </Route>
          <Route path='/sts/dashboard' element={<Protected />} >
            <Route path='/sts/dashboard' element={<STSManagerDashboard />} />
          </Route>
          <Route path='/landfill/dashboard' element={<Protected />} >
            <Route path='/landfill/dashboard' element={<LandfillManagerDashboard />} />
          </Route>

        </Routes>
      </Router>
    </div>
  );
}

const Protected = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user);
  if(!user){
    return <Navigate to="/login" />;
  }
  if(user.role_id===1 || user.role_id===2 || user.role_id===3){
    return <Outlet />;
  }
  return <Navigate to="/login" />;
}

const HomeX = ()=>{
  const user = JSON.parse(localStorage.getItem('user'));
  if(!user){
    return <Outlet />;
  }
  if(user.role_id===1){
    return <Navigate to="/admin/dashboard" />;
  }else if(user.role_id===2){
    return <Navigate to="/sts/dashboard" />;
  }else if (user.role_id===3){
    return <Navigate to="/landfill/dashboard" />;
  }
  return <Outlet />;
}


export default App;
