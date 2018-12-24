import React from 'react';

import styles from './GasStatusLabel.less';

const STATUS_CN = ['失联', '正常', '火警', '全部'];
const COLORS = ['rgb(198, 193, 129)', 'rgb(0, 161, 129)', 'rgb(232, 103, 103)', 'rgb(0, 168, 255)'];

export default function SmokeStatusLabel(props) {
  const { status = 0, num = 0, selected = false, ...restProps } = props;
  return (
    <p className={selected ? styles.labelSelected : styles.label} {...restProps}>
      <span className={styles.status}>{STATUS_CN[status]}</span>(
      <span className={styles.num} style={{ color: selected ? '#FFF' : COLORS[status] }}>
        {num}
      </span>
      )
    </p>
  );
}
