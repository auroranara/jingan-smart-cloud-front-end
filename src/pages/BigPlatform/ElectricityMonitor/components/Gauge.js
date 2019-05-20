import React from 'react';

import styles from './Gauge.less';
import { ChartGauge } from '../components/Components';
import { getLineColor1 as getLineColor } from '../utils';

// const COLORS = ['#37a460', '#f9b206', '#f73329'];
const COLORS = ['#37a460', '#f9b206', '#ff4905'];
const RANGES = {
  'A相温度': [0, 150],
  'B相温度': [0, 150],
  'C相温度': [0, 150],
  '零线温度': [0, 150],
  '漏电电流': [0, 1500],
  'A相电流': [0, 750],
  'B相电流': [0, 750],
  'C相电流': [0, 750],
  'A相电压': [0, 500],
  'B相电压': [0, 500],
  'C相电压': [0, 500],
};

export default function Gauge(props) {
  const {
    data: { desc: title, value, unit, limit=[[], []], status },
  } = props;
  console.log(title, limit);
  const [start, end] = RANGES[title];
  const isOutOfContact = +status === -1;
  const axisLineColor = getLineColor(limit, isOutOfContact, end);
  const [[warn1, warn2], [alarm1, alarm2]] = limit
  const min = Math.max(...[start, warn1, alarm1].filter(n => typeof n === 'number'));
  const max = Math.min(...[warn2, alarm2, end].filter(n => typeof n === 'number'));

  return (
    <div className={styles.container}>
      <div className={styles.chart}>
        <ChartGauge
          value={value}
          max={end}
          axisLineColor={axisLineColor}
        />
      </div>
      <div className={styles.desc}>
        <p className={styles.title}>{title}</p>
        <p>
          实时数值：
          <span style={{ color: isOutOfContact ? undefined : COLORS[status] }}>
            {isOutOfContact || value === null || value === undefined ? '--' : `${value}${unit}`}
          </span>
        </p>
        <p>
          参考范围值：
          {/* {isOutOfContact ? '--' : `${start} ~ ${Math.min(end, ...limit.filter(item => item !== null))}${unit}`} */}
          {isOutOfContact ? '--' : `${min} ~ ${max}${unit}`}
        </p>
      </div>
    </div>
  );
}
