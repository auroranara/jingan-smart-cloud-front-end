import React from 'react';
import { Row, Col } from 'antd';

import styles from './OvCard.less';

export default function OvCard(props) {
  const { title, num, zeroLength = 2, titleStyle={}, titleContainerStyle={}, numContainerStyle={}, numStyle={}, style={} } = props;
  const newStyle = { width: '100%', height: '100%', ...style };
  const zeros = Array(zeroLength).fill(0).join('');
  const n = `${zeros.slice(0, Math.max(zeroLength - num.toString().length, 0))}${num.toString()}`;

  return (
    <div style={newStyle} className={styles.card}>
      <div className={styles.titleContainer} style={titleContainerStyle}>
        <p className={styles.title} style={titleStyle}>{title}</p>
      </div>
      <div className={styles.numContainer} style={numContainerStyle}>
        <p className={styles.num} style={numStyle}>{n}</p>
      </div>
    </div>
  );
}
