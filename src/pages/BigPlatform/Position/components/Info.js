import React from 'react';

import styles from './Info.less';
import infoBg from '../imgs/information.png';

function InfoItem(props) {
  const { time, person, phone, position } = props;

  return (
    <div>
      <p className={styles.time}>{time}</p>
      <p>【{person} {phone}】到达{position}</p>
    </div>
  );
}

export default function Info(props) {
  return (
    <div className={styles.container} style={{ backgroundImage: `url(${infoBg})` }}>
      <InfoItem time="今日 14:03:00" person="老王" phone="13288888888" position="餐厅" />
      <InfoItem time="今日 14:10:00" person="老张" phone="13288888888" position="活动室" />
    </div>
  );
}
