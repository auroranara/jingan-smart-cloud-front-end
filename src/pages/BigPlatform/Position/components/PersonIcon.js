import React from 'react';

import styles from './PersonIcon.less';
import personIcon from '../imgs/person.png';
import personRedIcon from '../imgs/personRed.png';
import msgIcon from '../imgs/msg.png';

function getValue(val) {
  const type = typeof val;

  if (type === 'number' || type === 'string' && val.includes('%'))
    return val;

  const n = Number.parseFloat(val);

  if (n)
    return;

  return 0;
}

export default function PersonIcon(props) {
  const { x=0, y=0, isSOS, style, ...restProps } = props;
  const left = getValue(x);
  const bottom = getValue(y);

  const newStyle = {
    left,
    bottom,
    backgroundImage: `url(${isSOS ? personRedIcon : personIcon})`,
    ...style,
  };

  return (
    <div
      className={styles.person}
      style={newStyle}
      {...restProps}
    >
      {isSOS && (
        <div className={styles.msg} style={{ backgroundImage: `url(${msgIcon})` }}>
          SOS求救
        </div>
      )}
    </div>
  );
}
