// src/components/TopMenu.js
import React from 'react';

const TopMenu = () => {
  return (
    <div style={styles.container}>
      <div style={styles.leftSection}>
        <a href="tel:+60322031517" style={styles.link}>
          <img
            src="https://mjiit.utm.my/wp-content/uploads/2018/06/Call.png"
            alt="Call Icon"
            style={styles.icon}
          />
          <span style={styles.text}>+60 3-2203 1517</span>
        </a>
        <a href="mailto:mjiit@utm.my" style={styles.link}>
          <img
            src="https://mjiit.utm.my/wp-content/uploads/2018/06/Mail-Icon-e1625484282441.png"
            alt="Mail Icon"
            style={styles.icon}
          />
          <span style={styles.text}>mjiit@utm.my</span>
        </a>
        <a href="https://www.facebook.com/mjiitutm/" target="_blank" rel="noopener noreferrer">
          <img
            src="https://mjiit.utm.my/wp-content/uploads/2018/06/Facebook-Icon.png"
            alt="Facebook Icon"
            style={styles.icon}
          />
        </a>
        <a href="https://www.instagram.com/mjiitofficial/" target="_blank" rel="noopener noreferrer">
          <img
            src="https://mjiit.utm.my/wp-content/uploads/2018/06/Instagram-Icon.png"
            alt="Instagram Icon"
            style={styles.icon}
          />
        </a>
        <a href="https://www.youtube.com/channel/UCOg5qJb6ogHpwrO_lokLmQQ" target="_blank" rel="noopener noreferrer">
          <img
            src="https://mjiit.utm.my/wp-content/uploads/2018/06/Youtube.png"
            alt="YouTube Icon"
            style={styles.icon}
          />
        </a>
      </div>

      <div style={styles.rightSection}>
        
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#278F6A',
    padding: '10px 20px',
    color: 'white',
    paddingRight:'50px'
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'white',
    fontSize: '10pt',
  },
  icon: {
    width: '16px',
    height: '16px',
    marginRight: '5px',
  },
  text: {
    color: '#ffffff',
  },
  loginLink: {
    color: '#ff6666',
    fontSize: '10pt',
    textDecoration: 'none',
  },
};

export default TopMenu;
