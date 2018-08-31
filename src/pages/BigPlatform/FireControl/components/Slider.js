import React from 'react';

import styles from './Slider.less';

export default function Slider(props) {
  const { index, length, childWidth, style = {}, children } = props;
  const newStyle = {
    width: length * childWidth,
    transform: `translateX(${-index * childWidth}px)`,
    ...style,
  };

  return (
    <div className={styles.container} style={newStyle}>
      {children}
    </div>
  );
}
