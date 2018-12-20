import React from 'react';

import styles from './Tooltip.less';

export default function Tooltip(props) {
  const { title, visible, position=[0, 0], offset=[0, 0], style={}, ...restProps } = props;

  return (
    <span
      className={styles.tooltip}
      style={{
        ...style,
        left: position[0] + offset[0],
        top: position[1] + offset[1],
        display: visible ? 'block' : 'none',
      }}
      {...restProps}
    >
      {title}
    </span>
  );
}
