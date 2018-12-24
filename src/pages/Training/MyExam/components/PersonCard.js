import React from 'react';

import styles from './PersonCard.less';

const NO_DATA = '暂无信息'

export default function PersonCard(props) {
  const { src='', name=NO_DATA, desc=NO_DATA } = props;
  return (
    <div className={styles.container}>
      <span className={styles.img} style={src ? { backgroundImage: `url(${src})` } : null} />
      <p className={styles.name}>{name}</p>
      <p className={styles.desc}>{desc}</p>
    </div>
  );
}
