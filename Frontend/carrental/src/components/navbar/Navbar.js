import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';
import logoutIcon from '../assets/profile.png'; // Import the logout icon image

const Navbar = ({ onLogout }) => {
  const [menu, setMenu] = useState(""); // Initialize menu state to empty string
  const [showMenu, setShowMenu] = useState(false); // State to control showing/hiding the menu on mobile
  const [scrolled, setScrolled] = useState(false); // State to track whether the user has scrolled
  const [showAlert, setShowAlert] = useState(false); // State to control showing/hiding the logout confirmation alert

  const location = useLocation(); // Get the current location

  // Function to toggle the mobile menu
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Function to handle scroll event
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  // Effect to add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to handle menu item click
  const handleMenuClick = (menuItem) => {
    setMenu(menuItem);
    setShowMenu(false);
  };

  // Function to show the logout confirmation alert
  const handleLogout = () => {
    setShowAlert(true);
  };

  // Function to handle logout
  const confirmLogout = () => {
    onLogout(); // Call the logout function passed from props
    setShowAlert(false); // Hide the alert after logout
  };

  // Function to cancel logout
  const cancelLogout = () => {
    setShowAlert(false); // Hide the alert
  };

  // Initialize menu state based on the current route
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === '/allvehicles') {
      setMenu('allvehicles');
    } else if (currentPath === '/rented') {
      setMenu('rented');
    } else if (currentPath === '/addVehicle') {
      setMenu('addVehicle');
    }
  }, [location.pathname]); // Update menu state whenever the location changes

  return (
    <div className={`navbar ${showMenu ? 'active' : ''} ${scrolled ? 'scrolled' : ''}`}>
      {/* Fancy hamburger menu icon */}
      <div className={`hamburger2 ${showMenu ? 'active' : ''}`} onClick={toggleMenu}>
        <div />
        <div />
        <div />
      </div>

      {/* Actual menu */}
      <ul className={`nav-menu ${showMenu ? 'show' : ''}`}>
        <li onClick={() => handleMenuClick("allvehicles")}>
          <Link to="/allvehicles" className={menu === "allvehicles" ? "active" : ""}>
            All Vehicles
            <div className="linebar" style={{ width: menu === "allvehicles" ? '100%' : '0' }} /> {/* Dynamic width */}
          </Link>
        </li>
        <li onClick={() => handleMenuClick("rented")}>
          <Link to="/rented" className={menu === "rented" ? "active" : ""}>
            Rented
            <div className="linebar" style={{ width: menu === "rented" ? '100%' : '0' }} /> {/* Dynamic width */}
          </Link>
        </li>
        <li onClick={() => handleMenuClick("addVehicle")}>
          <Link to="/addVehicle" className={menu === "addVehicle" ? "active" : ""}>
            Add Vehicle
            <div className="linebar" style={{ width: menu === "addVehicle" ? '100%' : '0' }} /> {/* Dynamic width */}
          </Link>
        </li>
        <li className="logout-button" onClick={handleLogout}>
          <img src={logoutIcon} alt="Logout" /> 
          <h3 id="logout">LogOut</h3>
        </li>
      </ul>

      {/* Logout confirmation alert */}
      {showAlert && (
        <div className="alert-backdrop">
          <div className="alert">
            <p>Do you want to Logout?</p>
            <button onClick={confirmLogout} name="okaybutton" id="okaybutton">OK</button>
            <button onClick={cancelLogout} name="cancelbutton" id="cancelbutton">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
