import React from 'react';
import moment from 'moment';

import styles from './LossCard.less';

export default function LossCard(props) {
  const { data: { area, location, updateTime, deviceName } } = props;
  return (
    <div className={styles.container}>
      <p className={styles.name}>
        <span className={styles.pondIcon} />
        {deviceName}
      </p>
      <p className={styles.location}>
        <span className={styles.locationIcon} />
        {area}{location}
      </p>
      <p className={styles.time}>
        <span className={styles.lossIcon} />
        {moment(updateTime).format('YYYY-MM-DD HH:mm:ss')}
      </p>
    </div>
  );
}
