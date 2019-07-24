import React from 'react';

import styles from './GasEmpty.less';

const DEFAULT_SRC = 'http://data.jingan-china.cn/v2/big-platform/monitor/com/waterBg1.png';

export default function GasEmpty(props) {
  const { src=DEFAULT_SRC, children } = props;
  return (
    <div className={styles.container} style={{ backgroundImage: `url(${src})` }}>
      {children}
    </div>
  );
}
