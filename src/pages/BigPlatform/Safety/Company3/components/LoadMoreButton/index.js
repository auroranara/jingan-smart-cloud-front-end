import React from 'react';
import { Icon } from 'antd';
import styles from './index.less';

/**
 * 加载更多按钮
 */
export default function LoadMoreButton({ onClick }) {
  return (
    <div className={styles.button} onClick={onClick}>
      <span className={styles.buttonLabel}>加载更多</span><Icon type="double-right" className={styles.buttonIcon} />
    </div>
  );
}
