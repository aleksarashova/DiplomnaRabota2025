import React from 'react';

import { Routes, Route } from 'react-router-dom';

import LoginForm from './components/forms/LoginForm';
import RegisterForm from './components/forms/RegisterForm';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginForm />}></Route>
        <Route path="/register" element={<RegisterForm />}></Route>
      </Routes>
    </div>
  );
}

export default App;
