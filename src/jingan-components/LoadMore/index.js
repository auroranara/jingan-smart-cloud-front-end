import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Tooltip } from 'antd';
import classNames from 'classnames';
// 引入样式文件
import styles from './index.less';

/**
 * 加载更多按钮
 */
export default function LoadMore({ className, style, onClick, children, ...restProps }) {
  return (
    <div className={classNames(styles.container, className)} style={style} {...restProps}>
      <Tooltip title="加载更多">
        <div
          className={styles.button}
          onClick={onClick}
        >
          {children || <LegacyIcon type="double-right" className={styles.buttonIcon} />}
        </div>
      </Tooltip>
    </div>
  );
}
