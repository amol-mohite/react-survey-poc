
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './components/Home';
import Signup from './components/Signup';
import SurveyDetails from './components/SurveyDetails';
import NewSurvey from './components/NewSurvey';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedToken = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (storedName && storedToken) {
      setIsLoggedIn(true);
      setUserName(storedName);
      setUserRole(role);
    }
  }, []);

  return (
    <Router>
      <div className="App">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} setUserRole={setUserRole} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} setUserRole={setUserRole}/>} />
          <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} setUserRole={setUserRole}/>} />
          <Route path="/survey/:id" element={<SurveyDetails />} />
          <Route path="/create-survey" element={<NewSurvey />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
