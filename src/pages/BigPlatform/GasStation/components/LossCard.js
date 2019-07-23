import React from 'react';
import moment from 'moment';

import styles from './LossCard.less';
import Ellipsis from '@/components/Ellipsis';
import { pondIcon1 as pondIcon, sprayIcon, hydrantIcon } from '../imgs/links';

const MAX = 18;
const ICONS = [hydrantIcon, sprayIcon, pondIcon];

export default function LossCard(props) {
  const { data: { area, location, deviceName, deviceDataList }, iconIndex=0, onClick, style, ...restProps } = props;
  const { updateTime } = deviceDataList[0] || {};
  const address = `${area ? area : ''}${location ? location : ''}`;
  const newStyle = { ...style, cursor: onClick ? 'pointer' : 'auto' };
  return (
    <div className={styles.container} onClick={onClick} style={newStyle} {...restProps}>
      <p className={styles.name}>
        <span className={styles.pondIcon} style={{ backgroundImage: `url(${ICONS[iconIndex]})` }} />
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
