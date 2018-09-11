import React from 'react';

import GasCircle from './GasCircle';
import styles from './GasCard.less';

const NO_DATA = '暂无信息';
const COLORS = ['rgb(0, 161, 129)', 'rgb(232, 103, 103)', 'rgb(198, 193, 129)'];

export default function GasCard(props) {
  const { status=0, desc, time, percent, style={}, ...restProps } = props;
  const color = COLORS[status];
  const newStyle = {
    borderLeft: `4px solid ${color}`,
    ...style,
  };
  const circleStyle = { position: 'absolute', top: '50%', right: 20, transform: 'translateY(-50%)' };

  return (
    <div className={styles.card} style={newStyle} {...restProps}>
      <p className={styles.desc}>{desc ? desc : NO_DATA}</p>
      <p className={styles.time}>{time ? time : NO_DATA}</p>
      <GasCircle color={color} percent={percent} style={circleStyle} />
    </div>
  )
}
