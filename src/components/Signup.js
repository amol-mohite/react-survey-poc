import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Signup({ setIsLoggedIn, setUserName }) {
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      navigate('/');
    }
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          name,
          mobile_no: mobileNo,
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Signup failed. Please try again.');
      }

      const data = await response.json();
      const { token, name: userName } = data;

      localStorage.setItem('token', token);
      localStorage.setItem('userName', userName);

      setIsLoggedIn(true);
      setUserName(userName);

      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required/>
        </div>
        <div className="mb-3">
            <label htmlFor="mobileNo" className="form-label">Mobile Number</label>
            <input type="text" className="form-control" id="mobileNo" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} required/>
        </div>
        <div className="mb-3">
            <label htmlFor="email" className="form-label"> Email address </label> 
            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label"> Password </label> 
            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary me-2">Signup</button>
        <Link to="/login" className="btn btn-outline-primary">Login</Link>
        </form>
    </div>
  );
}

export default Signup;
