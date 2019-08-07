import React from 'react';

import styles from './AlarmCount.less';
import { alarmIcon, faultIcon, lossIcon } from '../imgs/links';

export default function AlarmCount(props) {
  const { alarm, fault, loss, handles=[] } = props;
  const items = [
    { icon: alarmIcon, name: '报警', count: alarm, more: <span className={styles.more}>(待处理 {handles[0]}, 处理中 {handles[1]}, 已处理 {handles[2]})</span> },
    { icon: faultIcon, name: '报警', count: fault },
    { icon: lossIcon, name: '报警', count: loss },
  ];

  return (
    <div className={styles.container}>
      {items.map(({ icon, name, count, more }) => (
        <div className={styles.item}>
          <div className={styles.icon} style={{ backgroundImage: `url(${icon})` }} />
          <p className={styles.p}>
            {name}
            <span className={styles.count}>{count}</span>
            {more}
          </p>
        </div>
      ))}
    </div>
  );
}
