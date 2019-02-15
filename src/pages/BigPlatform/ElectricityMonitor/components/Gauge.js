import React from 'react';

import styles from './Gauge.less';
import { ChartGauge } from '../components/Components';

const COLORS = ['#37a460', '#f9b206', '#f73329'];
const RANGES = {
  'A相温度': [0, 150],
  'B相温度': [0, 150],
  'C相温度': [0, 150],
  '零线温度': [0, 150],
  '漏电电流': [0, 1500],
};

export default function Gauge(props) {
  const {
    labelFontSize,
    data: { desc: title, value, unit, limit, status },
  } = props;
  const [start, end] = RANGES[title];
  const [value1, value2] = limit;
  const axisLineColor = [];
  const isOutOfContact = +status === -1;
  if (isOutOfContact) {
    axisLineColor.push([1, '#ccc']);
  }
  else {
    if (value1 !== null) {
      axisLineColor.push([ value1/end, COLORS[0] ]);
      if (value2 !== null) {
        axisLineColor.push([ value2/end, COLORS[1] ]);
        axisLineColor.push([ 1, COLORS[2] ]);
      }
      else {
        axisLineColor.push([ 1, COLORS[1] ]);
      }
    }
    else {
      if (value2 !== null) {
        axisLineColor.push([ value2/end, COLORS[0] ]);
        axisLineColor.push([ 1, COLORS[2] ]);
      }
      else {
        axisLineColor.push([ 1, COLORS[0] ]);
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.chart}>
        <ChartGauge value={value} max={end} axisLineColor={axisLineColor} labelFontSize={labelFontSize} />
      </div>
      <div className={styles.desc}>
        <p className={styles.title}>{title}</p>
        <p>
          参数实时值：
          <span style={{ color: isOutOfContact?undefined:COLORS[status] }}>
            {isOutOfContact || value === null || value === undefined ? '--' : `${value}${unit}`}
          </span>
        </p>
        <p>
          参考范围值：
          {isOutOfContact ? '--' : `${start} ~ ${Math.min(end, ...limit.filter(item => item !== null))}${unit}`}
        </p>
      </div>
    </div>
  );
}
