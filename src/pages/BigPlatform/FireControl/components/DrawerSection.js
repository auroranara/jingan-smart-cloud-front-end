import React from 'react';

import styles from './DrawerSection.less';

export default function DrawerSection(props) {
  const { title, children, extra, ...restProps } = props;
  return (
    <div className={styles.container} {...restProps}>
      {title && <h4 className={styles.title}>{title}{extra}</h4>}
      {children}
    </div>
  );
}
