import React from 'react';
import line from '../imgs/line.png';
// import { Col, Row } from 'antd';
import styles from './StorageLableCards.less';

export default function StorageCards(props) {
  const { num, title, desc, unit, color } = props;
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.dot} />
        <span className={styles.topTitle}>
          储罐ID：
          {title}
        </span>
        <span className={styles.topNum}>
          位号：
          {num}
        </span>
      </div>
      <div className={styles.bottom}>
        <div
          className={styles.liquid}
          style={{
            backgroundImage: `url(${line})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1% 100%',
          }}
        >
          <p className={styles.liquidCount}>{0}</p>
          <p className={styles.liquidTitle}>液位(mm)</p>
        </div>

        <div
          className={styles.pressure}
          style={{
            backgroundImage: `url(${line})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1% 100%',
          }}
        >
          <p className={styles.pressureCount}>{0}</p>
          <p className={styles.pressureTitle}>压力(Pa)(>50)</p>
        </div>

        <div className={styles.temp}>
          <p className={styles.tempCount}>{0}</p>
          <p className={styles.tempTitle}>温度(℃)</p>
        </div>
      </div>
    </div>
  );
}
