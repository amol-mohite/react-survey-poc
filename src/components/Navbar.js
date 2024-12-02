import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {FeedPlusIcon,PersonIcon,PersonFillIcon,HomeFillIcon} from '@primer/octicons-react'

function Navbar({ isLoggedIn, setIsLoggedIn}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const token = localStorage.getItem('token');
  
  const toggleProfile = async () => {
    if (!showProfile) {
      if (!profileData){
        setError(null);
        try {
          const response = await axios.get(
            `http://localhost:3000/api/v1/users/my_profile`,
            {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setProfileData(response.data);
          setShowProfile(true);
        } catch (err) {
          setError('Failed to fetch profile details.');
        } finally {
          setLoading(false);
        }
      }
    }
    setShowProfile(!showProfile);
  };

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setUserRole(storedRole);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');

    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-light" style={{ backgroundColor: '#e3f2fd' }}>
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img
            src={require('../assets/survey-logo.png')}
            alt="Logo"
            className="me-2"
            style={{ width: '40px', height: '40px' }}
          />
          Survey Management
        </a>
        
        <div>
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
              <Link to="/signup" className="btn btn-outline-primary">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/" className="btn btn-outline-primary me-2"><HomeFillIcon size={16} /> Home</Link>
              {userRole === 'admin' && (
                <Link to="/create-survey" className="btn btn-outline-primary me-2"><FeedPlusIcon size={16} /> New Survey</Link>
              )}
              <>
                <span className="text-primary me-2" onClick={toggleProfile} disabled={loading} style={{ cursor: 'pointer' }} >
                  <img
                    src={require('../assets/profile.png')}
                    alt="Logo"
                    className="me-2"
                    style={{ width: '40px', height: '40px' }}
                  />
                </span>
              
                {showProfile && (
                  <div className="profile-popup">
                    <div className="icon-box">
                      <i className="material-icons"><img
                    src={require('../assets/profile.png')}
                    alt="Logo"
                    className="me-2"
                    style={{ width: '40px', height: '40px' }}
                  /></i>
                    </div>	
                    <div className="card card-body">
                      <button className="btn-close position-absolute" style={{ top: '10px', right: '10px' }} onClick={toggleProfile}></button>
                      <br></br>
                      {loading && <p>Loading...</p>}
                      {error && <p className="text-danger">{error}</p>}
                      {profileData && (
                        <>
                          <h5>Profile</h5>
                          <p><strong>Name:</strong> {profileData.name}</p>
                          <p><strong>Email:</strong> {profileData.email}</p>
                          <p><strong>Role:</strong> {profileData.role}</p>
                          <div className="d-flex justify-content-end mt-3">
                            <button className="btn btn-secondary me-2" onClick={toggleProfile}>
                              Cancel
                            </button>
                            <button className="btn btn-danger" onClick={handleLogout}>
                              Logout
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
               
                </>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;