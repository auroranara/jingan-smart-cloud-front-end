import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import classNames from 'classnames';
// 引入样式文件
import styles from './index.less';

/**
 * 加载更多按钮
 */
export default function LoadMore({ className, style, onClick, children, ...restProps }) {
  return (
    <div
      className={classNames(styles.button, className)}
      style={{ ...style }}
      onClick={onClick}
      {...restProps}
    >
      {children || <LegacyIcon type="double-right" className={styles.buttonIcon} />}
    </div>
  );
}
