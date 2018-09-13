import React from 'react';

import styles from './GasStatusLabel.less';

const STATUS_CN = ['正常', '异常', '失联'];
const COLORS = ['rgb(0, 161, 129)', 'rgb(232, 103, 103)', 'rgb(198, 193, 129)'];

export default function GasStatusLabel(props) {
  const { status=0, num=0, selected=false, ...restProps } = props;

  return (
    <p className={selected ? styles.labelSelected : styles.label} {...restProps}>
      <span className={styles.status}>{STATUS_CN[status]}</span>
      (<span className={styles.num} style={{ color: selected ? '#FFF' : COLORS[status]}}>{num}</span>)
    </p>
  );
}