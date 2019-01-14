import React from 'react';

import styles from './Gauge.less';
import { ChartGauge } from '../components/Components';

const COLORS = ['#37a460', '#f9b206', '#f73329'];;

export default function Gauge(props) {
  const { title, value, range=[0, 100], unit } = props;
  const [warn, alarm] = range;
  let colorIndex = 0;
  if (value > alarm)
    colorIndex = 2;
  else if(value > warn)
    colorIndex = 1;


  return (
    <div className={styles.container}>
      <div className={styles.chart}>
        <ChartGauge value={value / range[1]} />
      </div>
      <div className={styles.desc}>
        <p className={styles.title}>{title}</p>
        <p>实时温度值：<span style={{ color: COLORS[colorIndex] }}>{value}{unit}</span></p>
        <p>参考范围值：{warn} ~ {alarm}{unit}</p>
      </div>
    </div>
  );
}
