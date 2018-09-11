import React from 'react';

import styles from './GasCircle.less';

export default function GasCircle(props) {
  const { percent='-', label='LEL', width=64, color='#FFF', style={}, ...restProps } = props;

  const newStyle = {
    width,
    color,
    height: width,
    border: `2px solid ${color}`,
    ...style,
  }

  return (
    <div className={styles.circle} style={newStyle} {...restProps}>
      <p className={styles.percent}><span className={styles.percentNum}>{percent}</span>%</p>
      <p className={styles.label} style={{ backgroundColor: color }}>{label}</p>
    </div>
  );
}
