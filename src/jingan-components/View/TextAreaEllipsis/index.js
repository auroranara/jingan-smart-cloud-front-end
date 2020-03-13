import React from 'react';
import { Tooltip } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';

export default function TextAreaEllipsis({ value, length }) {
  return value ? (
    <Tooltip
      title={
        <Scrollbars className={styles.tooltipContent}>
          <div className={styles.preWrapText}>{value}</div>
        </Scrollbars>
      }
    >
      <div className={styles.ellipsis} style={{ maxWidth: length ? `${length + 1}em` : undefined }}>
        {value}
      </div>
    </Tooltip>
  ) : null;
}
