import React from 'react';

import { Routes, Route } from 'react-router-dom';

import LoginForm from './components/forms/LoginForm';
import RegisterForm from './components/forms/RegisterForm';
import ForgotPasswordForm from "./components/forms/ForgotPasswordForm";
import ResetPasswordForm from "./components/forms/ResetPasswordForm";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginForm />}></Route>
        <Route path="/register" element={<RegisterForm />}></Route>
        <Route path="/forgot-password" element={<ForgotPasswordForm />}></Route>
        <Route path="/reset-password" element={<ResetPasswordForm />}></Route>
      </Routes>
    </div>
  );
}

export default App;
