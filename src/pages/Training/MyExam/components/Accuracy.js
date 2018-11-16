import React from 'react';

import styles from './Accuracy.less';

const RED = 'rgb(205, 63, 63)';
const GREEN = 'rgb(51, 186, 105)';

export default function Accuracy(props) {
  const { children=0 } = props;
  const style = { color: Number.parseFloat(children) < 60 ? RED : GREEN };

  return (
    <div className={styles.container}>
      正确率：
      <span className={styles.percent} style={style}>{children}%</span>
      <span className={styles.qualified}>合格</span>
      <span className={styles.divider}>/</span>
      <span className={styles.disqualified}>不合格</span>
    </div>
  );
}
