import React, { useState } from 'react';
import './LoginPage.css';
import eyeIcon from '../assets/eye.png'; 
import Profile from '../assets/profile.png'; 

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [iconColor, setIconColor] = useState('#000000'); // Initial color of the eye icon

  const toggleShowPassword = () => {
    setShowPassword(prevState => !prevState);
    setIconColor(prevColor => prevColor === '#000000' ? '#505050' : '#000000'); 
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); 

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });


      await new Promise(resolve => setTimeout(resolve, 1500)); // Delay for 1000 milliseconds

      setLoading(false);

      if (!response.ok) {
        const responseData = await response.json(); // Parse response JSON
        throw new Error(responseData.message || 'An error occurred. Please try again later.');
      }

    
      onLogin(); 
    } catch (error) {
      console.error('Error:', error);
      setError(error.message); 
      setLoading(false); 
    }
  };

  return (
    <div className="mf">
      {/* Loading animation */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-dots">
            <div className="dot-1"></div>
            <div className="dot-2"></div>
            <div className="dot-3"></div>
            <div className="dot-4"></div>
          </div>
        </div>
      )}
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
        <img src={Profile} alt="Profile" className="profile"/>
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img
              src={eyeIcon}
              alt="Toggle password visibility"
              className="eye-icon"
              style={{ backgroundColor: iconColor }} 
              onClick={toggleShowPassword} 
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;