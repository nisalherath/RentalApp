import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Vehicle from './components/vehicles/Vehicle';
import Rented from './components/rented/Rented';
import VehicleAdd from './components/addmore/VehicleAdd';
import LoginPage from './components/login/LoginPage';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('loggedIn');
    if (loggedInStatus === 'true') {
      setLoggedIn(true);
      const alertShownStatus = sessionStorage.getItem('alertShown');
      if (!alertShownStatus) {
        setShowAlert(true);
        sessionStorage.setItem('alertShown', 'true');
        setAlertShown(true);
      }
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('loggedIn', 'true');
    setLoggedIn(true);
    if (!alertShown) {
      setShowAlert(true);
      sessionStorage.setItem('alertShown', 'true');
      setAlertShown(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    sessionStorage.removeItem('alertShown');
    setLoggedIn(false);
    setAlertShown(false);
  };

  return (
    <Router>
      <div>
        {showAlert && (
          <div className="alert-backdrop">
            <div className="alert3">
              <p>Welcome back!</p>
              <button onClick={() => setShowAlert(false)}>Let's get started</button>
            </div>
          </div>
        )}
        {!loggedIn && <LoginPage onLogin={handleLogin} />}
        {loggedIn && (
          <>
            <Navbar onLogout={handleLogout} />
            {/* Add error boundary here if needed */}
            <Routes>
              <Route path="/" element={<Navigate to="/allvehicles" />} />
              <Route path="/allvehicles" element={<Vehicle />} />
              <Route path="/rented" element={<Rented />} />
              <Route path="/addVehicle" element={<VehicleAdd />} />
              {/* Add a catch-all route for 404 errors */}
              <Route path="*" element={<Navigate to="/allvehicles" />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
