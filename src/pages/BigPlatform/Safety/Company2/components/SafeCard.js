import React from 'react';

import styles from './MonitorCard.less';

const NO_DATA = '暂无信息';

export default function SafeCard(props) {
  const { data: { name, expire } } = props;

  return (
    <div className={styles.outer}>
      <div className={styles.container}>
        <p>
          <span className={styles.item}>信息类型</span>
          {name}
        </p>
        <p>
          <span className={styles.item}>过期类型</span>
          复审日期
        </p>
        <p>
          <span className={styles.item}>过期天数</span>
          {expire || NO_DATA}
        </p>
      </div>
    </div>
  );
}
