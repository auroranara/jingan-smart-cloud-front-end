import React from 'react';
import { Progress } from 'antd';

import styles from './OvProgress.less';

export default function OvProgress(props) {
  const { title, percent=0, quantity, iconStyle, strokeWidth=10, strokeColor='red', ...restProps } = props;

  return (
    <div className={styles.container} {...restProps}>
      <span className={styles.icon} style={iconStyle} />
      <span>{title}</span>
      <Progress percent={percent} strokeWidth={strokeWidth} strokeColor={strokeColor} showInfo={false} />
      <span className={styles.percent} style={{ color: strokeColor }}>{quantity === undefined ? percent : quantity}</span>
    </div>
  );
}
