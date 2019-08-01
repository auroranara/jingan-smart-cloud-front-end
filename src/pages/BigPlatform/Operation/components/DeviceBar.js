import React from 'react';

import styles from './DeviceBar.less';
import { TYPE_DESCES } from '../utils';
// import { companyIcon, companyIcon1, hostIcon, hostIcon1, smokeIcon, smokeIcon1 } from '../imgs/links';

// const ICONS = [companyIcon, hostIcon, smokeIcon];
// const ICONS1 = [companyIcon1, hostIcon1, smokeIcon1];

export default function DeviceBar(props) {
  const { type, handleClick, nums, ignore } = props;
  const desces = TYPE_DESCES.map((label, i) => ({
    index: i,
    label,
    selected: i === +type,
    num: nums[i],
  })).filter(({ index }) => ignore ? !ignore.includes(index) : true);

  return (
    <div className={styles.container}>
      {desces.map(({ index, label, selected, num }, i) => {
        return (
          <div
            key={label}
            className={styles[`item${selected ? 1 : ''}`]}
            style={i === desces.length - 1 ? { marginRight: 0 } : null}
            onClick={e => handleClick(index)}
          >
            <p className={styles.num}>{num}</p>
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
