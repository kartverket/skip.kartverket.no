import React, { useState, useEffect } from 'react';
import styles from './ShipAnimation.module.css';
import ship from '../../static/img/ship.png';

export default function ShipAnimation() {
  const [clickCount, setClickCount] = useState(0);
  const handleClick = () => {
    setClickCount(val => val + 1);
  };
  useEffect(() => {
    const amountOfTeamMembersInTheGoldenDays = 12;
    if (clickCount === amountOfTeamMembersInTheGoldenDays) {
      window.location.pathname = '/img/dreamteam.png';
    }
  }, [clickCount]);

  return <img src={ship} className={styles.ship} onClick={handleClick} />;
}
