import React from 'react';

import styles from './ExhaustCards.less';

export default function ExhaustCards(props) {
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
