import React from 'react';

import styles from './CheckLabel.less';

const STATUS_CN = ['', '正常', '异常', '待检查', '超时未查'];

export default function CheckLabel(props) {
  const { status = 0, num = 0, selected = false, ...restProps } = props;
  return (
    <p className={selected ? styles.labelSelected : styles.label} {...restProps}>
      <span className={styles.status}>{STATUS_CN[status]}</span>:
      <span className={styles.num}>{num}</span>
    </p>
  );
}
