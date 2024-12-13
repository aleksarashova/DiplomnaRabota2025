import React from 'react';

import { Routes, Route } from 'react-router-dom';

import HomePage from "./components/pages/home/home";
import LoginForm from './components/forms/login/LoginForm';
import RegisterForm from './components/forms/register/RegisterForm';
import ForgotPasswordForm from "./components/forms/forgot-password/ForgotPasswordForm";
import ResetPasswordForm from "./components/forms/reset-password/ResetPasswordForm";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path="/login" element={<LoginForm />}></Route>
        <Route path="/register" element={<RegisterForm />}></Route>
        <Route path="/forgot-password" element={<ForgotPasswordForm />}></Route>
        <Route path="/reset-password" element={<ResetPasswordForm />}></Route>
      </Routes>
    </div>
  );
}

export default App;
