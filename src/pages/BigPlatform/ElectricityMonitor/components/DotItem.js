import React from 'react';

import styles from './DotItem.less';

export default function DotItem(props) {
  const { title, color, quantity, onClick, showLink, ...restProps } = props;
  return (
    <span
      className={styles[showLink && quantity ? 'container1' : 'container']}
      onClick={quantity ? onClick : null}
      {...restProps}
    >
      <span style={{ backgroundColor: color }} className={styles.dot} />
      {title}
      <span className={styles.quantity}>{quantity}</span>
    </span>
  );
}
