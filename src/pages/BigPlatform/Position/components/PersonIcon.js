import React from 'react';

import styles from './PersonIcon.less';
import personIcon from '../imgs/person.png';
import personRedIcon from '../imgs/personRed.png';
import msgIcon from '../imgs/msg.png';

export default function PersonIcon(props) {
  const { x=0, y=0, isSOS } = props;

  return (
    <div
      className={styles.person}
      style={{
        left: Number.parseFloat(x),
        bottom: Number.parseFloat(y),
        backgroundImage: `url(${isSOS ? personRedIcon : personIcon})`,
      }}
    >
      {isSOS && (
        <div className={styles.msg} style={{ backgroundImage: `url(${msgIcon})` }}>
          SOS求救
        </div>
      )}
    </div>
  );
}
