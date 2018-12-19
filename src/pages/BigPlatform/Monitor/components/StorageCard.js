import React from 'react';

import styles from './StorageCard.less';

export default function StorageCard(props) {
  const { num, title, color } = props;
  return (
    <div className={styles.card}>
      <div className={styles.numContainer}>
        <div className={styles.num} style={{ color: color }}>
          {num}
        </div>
      </div>
      <div className={styles.titleContainer}>
        <p className={styles.title}>{title}</p>
      </div>
    </div>
  );
}
