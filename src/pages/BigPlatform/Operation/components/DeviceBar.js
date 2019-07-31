import React from 'react';

import styles from './DeviceBar.less';
import { TYPE_DESCES } from '../utils';
import { companyIcon, companyIcon1, hostIcon, hostIcon1, smokeIcon, smokeIcon1 } from '../imgs/links';

const ICONS = [companyIcon, hostIcon, smokeIcon];
const ICONS1 = [companyIcon1, hostIcon1, smokeIcon1];

export default function DeviceBar(props) {
  const { type, handleClick } = props;

  return (
    <div className={styles.container}>
      {TYPE_DESCES.map((label, i) => {
        const selected = i === type;
        return (
          <div className={styles[`item${selected ? 1 : ''}`]} key={label} onClick={e => handleClick(i)}>
            <p className={styles.num}>10</p>
            <p className={styles.desc}>{label}</p>
          </div>
        );
        // return (
        //   <span className={styles[`item${selected ? 1 : ''}`]} key={label} onClick={e => handleClick(i)}>
        //     <span className={styles.icon} style={{ backgroundImage: `url(${selected ? ICONS1[i] : ICONS[i]})` }} />
        //     {label}
        //   </span>
        // );
      })}
    </div>
  )
}
