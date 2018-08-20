import React from 'react';

import styles from './OvUnit.less';

export default function OvUnit(props) {
  const { url, title, num } = props;
  return (
    <div className={styles.unit}>
      <span style={{ background: `url(${url})`, backgroundSize: 'cover' }} className={styles.icon} />
      <p className={styles.title}>{title}</p>
      <p className={styles.num}>{num}</p>
    </div>
  );
}
