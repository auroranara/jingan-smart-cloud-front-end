import React, { PureComponent } from 'react';

import styles from './AlarmCard.less';
import fireIcon from '../img/fire.png';
import locateIcon  from '../img/locate.png';

export default function AlarmCard(props) {
  const { company, address, time, ...restProps } = props;
  // const delta = Math.floor((Date.now() - time) / 60000);
  // let timeMsg = '刚刚';
  // if (delta >= 1)
  //   timeMsg = `${delta}分钟前`;

  return (
    <div className={styles.container} {...restProps}>
      <p className={styles.company}>{company ? company : '暂无信息'}</p>
      <p className={styles.address}>
        {/* <span className={styles.locateIcon} /> */}
        <span className={styles.locateIcon} style={{ backgroundImage: `url(${locateIcon})` }} />
        {address ? address : '暂无信息'}
      </p>
      {/* <span className={styles.fireIcon} /> */}
      <span className={styles.fireIcon} style={{ backgroundImage: `url(${fireIcon})` }} />
      <span className={styles.time}>{time ? time : '暂无信息'}</span>
    </div>
  );
}
