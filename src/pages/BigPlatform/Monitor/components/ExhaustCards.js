import React from 'react';

import styles from './ExhaustCards.less';

export default function ExhaustCards(props) {
  const { num, unit, title, color } = props;
  return (
    <div className={styles.card}>
      <div className={styles.numContainer}>
        <div className={styles.num} style={{ color: color }}>
          {num}
        </div>
        <div className={styles.unit} style={{ color: color }}>
          {unit}
        </div>
      </div>
      <div className={styles.titleContainer} style={{ backgroundColor: color }}>
        <p className={styles.title}>{title}</p>
      </div>
    </div>
  );
}
