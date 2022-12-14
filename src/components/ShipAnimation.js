import React from 'react';
import styles from './ShipAnimation.module.css';
import ship from '../../static/img/ship.png';

export default function ShipAnimation() {
  return <img src={ship} className={styles.ship} />
}
