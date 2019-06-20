import React from 'react';

import styles from './DeviceBar.less';
import { companyIcon, companyIcon1, hostIcon, hostIcon1, smokeIcon, smokeIcon1 } from '../imgs/links';

const LABELS = ['服务单位', '消防主机', '独立烟感'];
const ICONS = [companyIcon, hostIcon, smokeIcon];
const ICONS1 = [companyIcon1, hostIcon1, smokeIcon1];

export default function DeviceBar(props) {
  const { type, handleClick } = props;

  return (
    <div className={styles.container}>
      {LABELS.map((label, i) => {
        const selected = i === type;
        return (
          <span className={styles[`item${selected ? 1 : ''}`]} key={label} onClick={e => handleClick(i)}>
            <span className={styles.icon} style={{ backgroundImage: `url(${selected ? ICONS1[i] : ICONS[i]})` }} />
            {label}
          </span>
        );
      })}
    </div>
  )
}
