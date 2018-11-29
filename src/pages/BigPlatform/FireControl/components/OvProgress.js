import React from 'react';
import { Progress } from 'antd';

import styles from './OvProgress.less';

export default function OvProgress(props) {
  const { title, percent=0, icon, strokeWidth=10, strokeColor='red' } = props;

  return (
    <div className={styles.container}>
      {icon}
      <span>{title}</span>
      <Progress percent={percent} strokeWidth={strokeWidth} strokeColor={strokeColor} showInfo={false} />
      <span className={styles.percent} style={{ color: strokeColor }}>{percent}</span>
    </div>
  );
}
