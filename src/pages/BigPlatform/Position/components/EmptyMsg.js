import React from 'react';

import styles from './EmptyMsg.less';

const DEFAULT = '暂无报警信息';

export default function EmptyMsg(props) {
  const { name=DEFAULT, ...restProps } = props;
  return (
    <div className={styles.container} {...restProps}>
      <p className={styles.name}>{name}</p>
    </div>
  );
};
