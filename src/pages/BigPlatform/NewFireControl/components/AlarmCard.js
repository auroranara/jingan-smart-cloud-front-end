import React from 'react';

import styles from './AlarmCard.less';
import fireIcon from '../img/fire.png';
import firedIcon from '../img/fired.png';
import locateIcon  from '../img/locate.png';
import clockIcon from '../img/cardClock.png';

const NO_DATA = '暂无信息';

const STATUS = ['处理中', '已处理', '待处理'];
const STATUS_CLASS = ['handling', 'handled', 'handle'];

// function isTimeShort(time='') {
//   return time.includes('今日') || time.includes('分钟') || time.includes('刚刚');
// }

export default function AlarmCard(props) {
  const {
    // status 0 处理中 1 处理完 2 待处理
    data: { name: company, searchArea: address, saveTime: time, status },
    ...restProps
  } = props;

  return (
    <div className={styles.container} {...restProps}>
      <p className={styles.company}>
        {company ? company : NO_DATA}
      </p>
      <p className={styles.clock}>
        <span className={styles.clockIcon} style={{ backgroundImage: `url(${clockIcon})` }} />
        {time ? time : '暂无信息'}
      </p>
      <p className={styles.address}>
        {/* <span className={styles.locateIcon} /> */}
        <span className={styles.locateIcon} style={{ backgroundImage: `url(${locateIcon})` }} />
        {address ? address : NO_DATA}
      </p>
      {/* <span className={styles.fireIcon} /> */}
      <span className={styles.fireIcon} style={{ backgroundImage: `url(${status === '0' || status === '2' ? fireIcon : firedIcon})` }} />
      {/* <span className={isTimeShort(time) ? styles.timeShort : styles.timeLong}>{time ? time : '暂无信息'}</span> */}
      <span className={styles[STATUS_CLASS[status]]}>{STATUS[status]}</span>
    </div>
  );
}
