import React from 'react';

import styles from './Rect.less';

export default function Rect(props) {
  const { color='#0FF', width=20, ...restProps } = props;
  return (
    <span
      className={styles.rect}
      style={{ width, height: width, backgroundColor: color }}
      {...restProps}
    />
  );
}
