import React from 'react';
import { Tooltip } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';

export default function TextAreaEllipsis({ value, length, emtpy = null }) {
  return value ? (
    <Tooltip
      title={
        <Scrollbars className={styles.tooltipContent}>
          <div className={styles.preWrapText}>{value}</div>
        </Scrollbars>
      }
    >
      <div
        className={styles.ellipsis}
        style={{ maxWidth: length ? `${length + 1}em` : `${value.length + 1}em` }}
      >
        {value}
      </div>
    </Tooltip>
  ) : (
    emtpy
  );
}
