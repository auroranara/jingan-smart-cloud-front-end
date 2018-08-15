import React, { PureComponent } from 'react';

import styles from './AlarmCard.less';
import fireIcon from './fire.png';
import locateIcon  from './locate.png';

function AlarmCard(props) {
  return (
    <div className={styles.container}>
      <p className={styles.company}>无锡晶安科技有限公司</p>
      <p className={styles.address}><span className={styles.locateIcon} style={{ background: `url(${locateIcon})`, backgroundSize: 'cover' }} />无锡市新吴区汉江路5号</p>
      <span className={styles.fireIcon} style={{ background: `url(${fireIcon})`, backgroundSize: 'cover' }} />
      <span className={styles.time}>刚刚</span>
    </div>
  );
}

export default AlarmCard;
