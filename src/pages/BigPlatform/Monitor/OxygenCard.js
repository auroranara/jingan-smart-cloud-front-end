import React from 'react';

import styles from './OxygenCard.less';

export default function OxygenCard(props) {
  const { num, unit, title } = props;
  return (
    <div className={styles.card}>
      <div className={styles.numContainer}>
        <div className={styles.num}>{num}</div>
        <div className={styles.unit}>{unit}</div>
      </div>
      <div className={styles.titleContainer}>
        <p className={styles.title}>{title}</p>
      </div>
    </div>
  );
}
