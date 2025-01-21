// src/components/TopMenuRight.js
import React from 'react';

const TopMenuRight = () => {
  return (
    <div style={styles.container}>
      <a href="https://facebook.com" style={styles.link}>Facebook</a>
      <a href="https://instagram.com" style={styles.link}>Instagram</a>
      <a href="https://youtube.com" style={styles.link}>YouTube</a>
      <a href="/login" style={styles.login}>Login</a>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '15px',
  },
  link: {
    color: '#FFFFFF',
    textDecoration: 'none',
  },
  login: {
    color: '#ff6666',
    textDecoration: 'none',
  },
};

export default TopMenuRight;
