import React from 'react';

import styles from './OvUnit.less';

export default function OvUnit(props) {
  const { url, title, num=0, style={}, iconStyle={} } = props;
  return (
    <div className={styles.unit} style={style}>
      <span style={{ backgroundImage: `url(${url})`, ...iconStyle }} className={styles.icon} />
      <p className={styles.title}>{title}</p>
      <p className={styles.num}>{num}</p>
    </div>
  );
}
