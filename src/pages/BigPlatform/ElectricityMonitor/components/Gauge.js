import React from 'react';

import styles from './Gauge.less';
import { ChartGauge } from '../components/Components';

const COLORS = ['#37a460', '#f9b206', '#f73329'];

export default function Gauge(props) {
  const { title, value, range: [start, end]=[0, 100], unit, limit, status } = props;
  const [{ status: statu1, limitValue: limitValue1 }={}, { status: status2, limitValue: limitValue2 }={}] = limit;
  const axisLineColor = [];
  if (limitValue1 !== undefined) {
    axisLineColor.push([ limitValue1/end, COLORS[0] ]);
    if (limitValue2 !== undefined) {
      axisLineColor.push([ limitValue2/end, COLORS[1] ]);
      axisLineColor.push([ 1, COLORS[2] ]);
    }
    else {
      axisLineColor.push([ 1, COLORS[1] ]);
    }
  }
  else {
    if (limitValue2 !== undefined) {
      axisLineColor.push([ limitValue2/end, COLORS[0] ]);
      axisLineColor.push([ 1, COLORS[2] ]);
    }
    else {
      axisLineColor.push([ 1, COLORS[0] ]);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.chart}>
        <ChartGauge value={value / end * 100} axisLineColor={axisLineColor} />
      </div>
      <div className={styles.desc}>
        <p className={styles.title}>{title}</p>
        <p>实时温度值：<span style={{ color: COLORS[status] }}>{value}{unit}</span></p>
        <p>参考范围值：{start} ~ {Math.min(...limit.filter(item => item).map(({ limitValue }) => limitValue))}{unit}</p>
      </div>
    </div>
  );
}
