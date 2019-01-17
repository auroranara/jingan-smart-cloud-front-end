import React from 'react';

import styles from './MonitorCard.less';

export default function SafeCard(props) {
  return (
    <div className={styles.outer}>
      <div className={styles.container}>
        <p>
          <span className={styles.item}>信息类型</span>
          特种设备
        </p>
        <p>
          <span className={styles.item}>过期类型</span>
          复审日期
        </p>
        <p>
          <span className={styles.item}>过期天数</span>
          10
        </p>
      </div>
    </div>
  );
}
