import React from 'react';

import GasCircle from './GasCircle';
import styles from './GasCard.less';

const NO_DATA = '暂无信息';
const COLORS = ['rgb(0, 161, 129)', 'rgb(232, 103, 103)', 'rgb(198, 193, 129)'];

const pms = [
  { id: 0, desc: 'LEL', unit: '%', value: 10 },
  { id: 1, desc: 'CUR', unit: 'A', value: 2 },
  { id: 2, desc: 'MAG', unit: 'T', value: 0.2 },
]

export default function GasCard(props) {
  const { status=0, location, time, params, style={}, ...restProps } = props;
  const color = COLORS[status];
  const newStyle = {
    borderLeft: `4px solid ${color}`,
    ...style,
  };

  return (
    <div className={styles.card} style={newStyle} {...restProps}>
      <p className={styles.location}>{location ? location : NO_DATA}</p>
      <p className={styles.time}>{time ? time : NO_DATA}</p>
      <div className={styles.circleContainer}>
        {params.map(({ id, desc, unit, value }) => <GasCircle key={id} color={color} desc={desc} unit={unit} val={value} style={{ marginLeft: 5 }} />)}
        {/* {pms.map(({ id, desc, unit, value }) => <GasCircle key={id} color={color} desc={desc} unit={unit} val={value} style={{ marginLeft: 5 }} />)} */}
      </div>
    </div>
  )
}
