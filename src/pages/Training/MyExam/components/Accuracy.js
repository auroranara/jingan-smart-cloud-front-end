import React from 'react';

import styles from './Accuracy.less';

const RED = 'rgb(205, 63, 63)';
const GREEN = 'rgb(51, 186, 105)';
const STATUS_MAP = { '-1': '弃考', 0: '不合格', 1: '合格' };

export default function Accuracy(props) {
  const { children=0, status=0 } = props;
  const style = { color: status === 1 ? GREEN : RED };

  return (
    <div className={styles.container}>
      正确率：
      <span className={styles.percent} style={style}>{children}%</span>
      <span className={styles.qualified} style={style}>{status === 1 ? '合格' : '不合格'}</span>
    </div>
  );
}
