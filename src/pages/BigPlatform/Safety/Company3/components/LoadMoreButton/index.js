import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import styles from './index.less';

/**
 * 加载更多按钮
 */
export default function LoadMoreButton({ onClick }) {
  return (
    <div className={styles.button} onClick={onClick}>
      <span className={styles.buttonLabel}>加载更多</span><LegacyIcon type="double-right" className={styles.buttonIcon} />
    </div>
  );
}
