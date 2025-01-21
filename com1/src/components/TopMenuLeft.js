// src/components/TopMenuLeft.js
import React from 'react';

const TopMenuLeft = () => {
  return (
    <div style={styles.container}>
      <span style={styles.logo}>UTM Logo</span>
      <span>📞 +60 3-2203 1517</span>
      <span>📧 mjiit@utm.my</span>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    color: 'white',
  },
  logo: {
    fontWeight: 'bold',
  },
};

export default TopMenuLeft;
