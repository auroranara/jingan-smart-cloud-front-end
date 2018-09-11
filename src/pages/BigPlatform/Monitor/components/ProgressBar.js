import React from 'react';
import { Progress } from 'antd';

import styles from './ProgressBar.less';

export default function ProgressBar(props) {
  const { status, num=0, percent=0, strokeWidth=10, strokeColor='blue', handleClick } = props;

  return (
    <div className={styles.progress}>
      <div className={styles.container}>
        <span className={styles.status}>{status}</span>
        <span className={styles.num} style={{ color: strokeColor }} onClick={handleClick}>{num}</span>
        <span className={styles.percent}>{percent}%</span>
      </div>
      <Progress percent={percent} strokeColor={strokeColor} strokeWidth={strokeWidth} showInfo={false} />
    </div>
  );
}
