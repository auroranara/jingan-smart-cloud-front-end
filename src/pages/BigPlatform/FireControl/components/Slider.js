import React from 'react';

import styles from './Slider.less';

export default function Slider(props) {
  // const { index, length, childWidth, style = {}, children } = props;
  const { index, size = 3, length, style = {}, children } = props;
  const newStyle = {
    // width: length * childWidth,
    width: `${(100 / size) * length}%`,
    // transform: `translateX(${-index * childWidth}px)`,
    transform: `translateX(${(-index * 100) / length}%)`,
    ...style,
  };

  // console.log(children);

  return (
    <div className={styles.container} style={newStyle}>
      {children}
    </div>
  );
}
