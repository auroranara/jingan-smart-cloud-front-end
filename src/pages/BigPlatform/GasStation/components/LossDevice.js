import React from 'react';

import styles from './LossDevice.less';
import { lossDevice } from '../imgs/links';
import { formatTime } from '../utils';

export default function LossDevice(props) {
  const { time } = props;
  return (
    <div className={styles.container}>
      <img width="94" height="81" src={lossDevice} alt="loss" />
      {time && <p className={styles.desc}><span className={styles.time}>{formatTime(time)}</span>设备失联！</p>}
    </div>
  );
}
