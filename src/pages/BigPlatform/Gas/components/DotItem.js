import React, { Fragment } from 'react';

import styles from './DotItem.less';

export default function DotItem(props) {
  const { title, color, quantity } = props;
  return (
    <Fragment>
      <span style={{ backgroundColor: color }} className={styles.dot} />
      {title}
      <span className={styles.quantity}>{quantity}</span>
    </Fragment>
  );
}
