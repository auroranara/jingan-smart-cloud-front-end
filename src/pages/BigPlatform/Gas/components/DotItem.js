import React, { Fragment } from 'react';

import styles from './DotItem.less';

export default function DotItem(props) {
  const { title, color, quantity, className, onClick } = props;
  return (
    <Fragment>
      <span className={className} onClick={onClick}>
        <span style={{ backgroundColor: color }} className={styles.dot} />
        {title}
        <span className={styles.quantity}>{quantity}</span>
      </span>
    </Fragment>
  );
}
