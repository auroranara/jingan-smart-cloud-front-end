import React from 'react';

import styles from './MonitorCard.less';

export default function MonitorCard(props) {
  return (
    <div className={styles.outer}>
      <div className={styles.container}>
        <p>
          <span className={styles.item}>监测模块</span>
          用电安全
        </p>
        <p>
          <span className={styles.item}>设备号</span>
          200123456789
        </p>
        <p>
          <span className={styles.item}>设备状态</span>
          <span className={styles.red}>报警</span>
        </p>
        <p>
          <span className={styles.item}>区域位置</span>
          厂区一车间
        </p>
        <p>
          <span className={styles.item}>发生时间</span>
          2019-01-12 12:05
        </p>
      </div>
    </div>
  );
}
