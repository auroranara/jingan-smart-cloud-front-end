import React from 'react';

import styles from './LegendDot.less';

export default function LegendDot(props) {
  const { color } = props;
  return (
    <div className={styles.legendIcon}>
      <div className={styles.legendColor} style={{ backgroundColor: color }} />
    </div>
  );
}
