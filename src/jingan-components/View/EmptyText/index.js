import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

export default function EmptyText({ className }) {
  return <div className={classNames(styles.container, className)}>---</div>;
}
