import React from 'react';

import styles from './Solar.less';

const LABELS = ['隐患排查', '安全档案', '动态监测', '安全巡查'];
const LABEL_POSITIONS = [];
const PLANET_COLORS = [];

export default function Solar(props) {
  return (
    <div>
      <div className={styles.circle} />
      <div className={styles.solar} />
    </div>
  );
}
