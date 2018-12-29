import React from 'react';
import moment from 'moment';

import styles from './Info.less';
// import infoBg from '../imgs/information.png';

function InfoItem(props) {
  const { time, person, phone, desc } = props;

  return (
    <div>
      <p className={styles.time}>今日 {moment(time).format('HH:mm:ss')}</p>
      <p>【{person}】{desc}</p>
    </div>
  );
}

export default function Info(props) {
  const { data } = props;

  return (
    // <div className={styles.container} style={{ backgroundImage: `url(${infoBg})` }}>
    <div className={styles.container}>
      {data.map(({ name, time, desc }, i) => (
        <InfoItem
          key={i}
          person={name}
          time={time}
          desc={desc}
        />
      ))}
    </div>
  );
}
