import React from 'react';
import moment from 'moment';

import styles from './LossCard.less';
import Ellipsis from '@/components/Ellipsis';

const MAX = 18;

export default function LossCard(props) {
  const { data: { area, location, deviceName, deviceDataList }, ...restProps } = props;
  const { updateTime } = deviceDataList[0] || {};
  const address = `${area ? area : ''}${location ? location : ''}`;
  return (
    <div className={styles.container} {...restProps}>
      <p className={styles.name}>
        <span className={styles.pondIcon} />
        {deviceName && deviceName.length > MAX ? <Ellipsis tooltip lines={1}>{deviceName}</Ellipsis> : deviceName}
      </p>
      <p className={styles.location}>
        <span className={styles.locationIcon} />
        {address.length > MAX ? <Ellipsis tooltip lines={1}>{address}</Ellipsis> : address}
      </p>
      <p className={styles.time}>
        <span className={styles.lossIcon} />
        {updateTime ? moment(updateTime).format('YYYY-MM-DD HH:mm:ss') : '暂无失联时间'}
      </p>
    </div>
  );
}
