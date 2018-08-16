import React, { PureComponent } from 'react';

import styles from './AlarmCard.less';
import fireIcon from './fire.png';
import locateIcon  from './locate.png';

export default function AlarmCard(props) {
  const { company, address, time } = props;
  const delta = Math.floor((Date.now() - time) / 60000);
  let timeMsg = '刚刚';
  if (delta >= 1)
    timeMsg = `${delta}分钟前`;

  return (
    <div className={styles.container}>
      <p className={styles.company}>{company}</p>
      <p className={styles.address}><span className={styles.locateIcon} style={{ background: `url(${locateIcon})`, backgroundSize: 'cover' }} />{address}</p>
      <span className={styles.fireIcon} style={{ background: `url(${fireIcon})`, backgroundSize: 'cover' }} />
      <span className={styles.time}>{timeMsg}</span>
    </div>
  );
}
