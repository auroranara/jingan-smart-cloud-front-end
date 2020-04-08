import React from 'react';

import styles from './ProcessBody.less';
import { getDirectionStyle } from '../utils';

export default function Label(props) {
  const { color="white", position=[0, 0], direction="top", children, ...restProps } = props;
  const extraStyle = getDirectionStyle(position, direction);

  return (
    <div style={{ color, ...extraStyle }} className={styles.label} {...restProps}>
      {children}
    </div>
  );
}
