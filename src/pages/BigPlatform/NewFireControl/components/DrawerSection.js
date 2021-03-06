import React from 'react';

import styles from './DrawerSection.less';

export default function DrawerSection(props) {
  const { title, titleInfo, children, extra, ...restProps } = props;
  return (
    <div className={styles.container} {...restProps}>
      {title && (
        <h4 className={styles.title}>
          {title}
          {titleInfo && <span className={styles.info}>({titleInfo})</span>}
          <div className={styles.extra}>{extra}</div>
        </h4>
      )}
      {children}
    </div>
  );
}
