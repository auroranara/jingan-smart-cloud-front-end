import React from 'react';

import styles from './Solar.less';

const LABELS = ['隐患排查', '安全档案', '动态监测', '安全巡查'];
const LABEL_STYLES = [
  { top: 0, left: '50%', transform: 'translateX(-50%)' },
  { top: '50%', right: 0, transform: 'translateY(-50%)' },
  { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
  { left: 0, top: '50%', transform: 'translateY(-50%)' },
];
const PLANET_STYLES = [
  { top: 0, left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgb(233,102,108)' },
  { top: '50%', right: 0, transform: 'translate(50%, -50%)', backgroundColor: 'rgb(2,252,250)' },
  { bottom: 0, left: '50%', transform: 'translate(-50%, 50%)', backgroundColor: 'rgb(244,185,85)' },
  { left: 0, top: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgb(85,134,244)' },
];

export default function Solar(props) {
  const { index } = props;
  const idx = index || 0;

  return (
    <div className={styles.container}>
      <div className={styles.circle}>
        <div className={index > 80 ? styles.solar : styles.solar1}>
          <p className={styles.index}>{idx}</p>
          <p className={styles.safe}>安全指数</p>
        </div>
        {PLANET_STYLES.map(s => <span key={s.backgroundColor} className={styles.planet} style={s} />)}
      </div>
      {LABELS.map((label, i) => (
        <span
          key={label}
          className={styles.label}
          style={LABEL_STYLES[i]}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
