import React from 'react';

import { Routes, Route } from 'react-router-dom';

import LoginForm from './components/forms/LoginForm';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginForm />}></Route>
      </Routes>
    </div>
  );
}

export default App;
