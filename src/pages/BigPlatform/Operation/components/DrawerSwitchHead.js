import React from 'react';

import styles from './DrawerSwitchHead.less';

const CHOICES = ['数据监测', '问题分析'];

export default function DrawerSwitchHead(props) {
  const { index, handleClick } = props;
  return (
    <div className={styles.container}>
      <div className={styles.spans}>
        {CHOICES.map((c, i) => (
          <span
            className={i === index ? styles.selected : undefined}
            onClick={e => handleClick(i)}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}
