import React from 'react';

import { Routes, Route } from 'react-router-dom';

import HomePage from "./components/pages/home/Home";
import LoginPage from "./components/pages/login/Login";
import RegisterPage from "./components/pages/register/Register";
import ForgotPasswordPage from "./components/pages/forgot-password/ForgotPassword";
import ResetPasswordPage from "./components/pages/reset-password/ResetPassword";
import VerifyProfileForm from "./components/forms/verify-profile/VerifyProfile";
import SendEmailForm from "./components/forms/send-verification-email/SendVerificationEmail";
import AddRecipeForm from "./components/forms/add-recipe/AddRecipe";
import SingleView from "./components/pages/single/singlepage/singleview";
import MyProfile from "./components/pages/profile/myProfile/myProfile";
import Profile from "./components/pages/profile/otherProfile/profile";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/forgot-password" element={<ForgotPasswordPage />}></Route>
        <Route path="/reset-password" element={<ResetPasswordPage />}></Route>
        <Route path="/singleview/:recipe-id" element={<SingleView />}></Route>
        <Route path="/verify-profile/:email" element={<VerifyProfileForm />}></Route>
        <Route path="/send-verification-email" element={<SendEmailForm />}></Route>
        <Route path="/add-recipe" element={<AddRecipeForm />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/myProfile" element={<MyProfile />}></Route>
      </Routes>
    </div>
  );
}

export default App;
