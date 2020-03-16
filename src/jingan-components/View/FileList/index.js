import React from 'react';
import EmptyText from '@/jingan-components/View/EmptyText';
import classNames from 'classnames';
import styles from './index.less';

export default function FileList({
  className,
  style,
  value,
  type,
  empty = <EmptyText />,
  ellipsis = true,
}) {
  return value && value.length ? (
    <div className={classNames(styles.container, className)} style={style}>
      {value.map(({ webUrl, fileName }, index) => (
        <div key={index} className={ellipsis ? styles.item : undefined}>
          <a
            className={styles.clickable}
            href={webUrl}
            title={fileName}
            target="_blank"
            rel="noopener noreferrer"
          >
            {fileName}
          </a>
        </div>
      ))}
    </div>
  ) : (
    empty
  );
}
