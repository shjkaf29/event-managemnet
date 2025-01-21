// src/components/Header.js
import React from 'react';
import './Header.css'; // Import the CSS for styling

const Header = () => {
  return (
    <div className="header">
      <div className="header-left">
        <img src="https://mjiit.utm.my/wp-content/uploads/2018/06/Asset-13-300x62.png" alt="UTM Logo" className="utm-logo" />
      </div>
      <div className="header-center">
        <h1>Malaysian - Japan International Institute of Technology (MJIIT)</h1>
      </div>
      <div className="header-right">
        <a href="/login" className="login-button">Login</a>
      </div>
    </div>
  );
};

export default Header;

