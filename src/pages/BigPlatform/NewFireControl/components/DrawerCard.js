import React from 'react';

import styles from './DrawerCard.less';
import locationIcon from '../img/cardLocation.png';
import personIcon from '../img/cardPerson.png';

export default function DrawerCard(props) {
  const { name, location, person, phone, status, statusLabels, info, infoStyle, more, hover, clickName, cornerLabel, ...restProps } = props;
  // 0 -> 正常  1 -> 不正常
  const isNormal = !status;

  return (
    <div className={styles.outer}>
      <div className={hover ? styles.container : styles.containerNoHover} {...restProps}>
        <p>
          <span className={clickName ? styles.company : null} onClick={() => clickName ? clickName() : null}>{name}</span>
        </p>
        <p className={styles.location}>
          <span className={styles.locationIcon} style={{ backgroundImage: `url(${locationIcon})` }} />
          {location}
        </p>
        <p className={styles.person}>
          <span className={styles.personIcon} style={{ backgroundImage: `url(${personIcon})` }} />
          <span className={styles.ps}>{person}</span>
          {phone}
        </p>
        {status !== undefined && <span className={isNormal ? styles.normal : styles.abnormal}>{isNormal ? statusLabels[0] : statusLabels[1]}</span>}
        {cornerLabel && <div className={styles.corner}>{cornerLabel}</div>}
        {info && <p className={styles.info} style={infoStyle}>{info}</p>}
        {more}
      </div>
    </div>
  );
}
