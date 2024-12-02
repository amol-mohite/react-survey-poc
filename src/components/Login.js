import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setIsLoggedIn, setUserName, setUserRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/v1/sessions', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }

      const data = await response.json();
      const { token, name, role } = data;

      localStorage.setItem('token', token);
      localStorage.setItem('userName', name);
      localStorage.setItem('userRole', role);

      setIsLoggedIn(true);
      setUserName(name);
      setUserRole(role);

      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </div>
        <button type="submit" className="btn btn-primary me-2">Submit</button>
        <Link to="/signup" className="btn btn-outline-primary">Sign Up</Link>
      </form>
    </div>
  );
}

export default Login;
