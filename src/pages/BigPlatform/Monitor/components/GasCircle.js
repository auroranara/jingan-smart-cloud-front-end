import React from 'react';

import styles from './GasCircle.less';

export default function GasCircle(props) {
  const { desc='NONE', unit='%', val='-', width=64, color='#FFF', style={}, ...restProps } = props;

  const newStyle = {
    width,
    color,
    height: width,
    border: `2px solid ${color}`,
    ...style,
  }

  return (
    <div className={styles.circle} style={newStyle} {...restProps}>
      <p className={styles.percent}><span className={styles.percentNum}>{val}</span>{unit}</p>
      <p className={styles.desc} style={{ backgroundColor: color }}>{desc}</p>
    </div>
  );
}
