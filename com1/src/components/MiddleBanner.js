// src/components/MiddleBanner.js
import React from 'react';

const MiddleBanner = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.institutionName}>Malaysian - Japan International Institute of Technology (MJIIT)</h2>
      <h1 style={styles.eventTitle}>EVENT CALENDAR</h1>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '40px 0',
  },
  institutionName: {
    fontSize: '20px',
    fontWeight: 'normal',
    marginBottom: '10px',
  },
  eventTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
  },
};

export default MiddleBanner;
