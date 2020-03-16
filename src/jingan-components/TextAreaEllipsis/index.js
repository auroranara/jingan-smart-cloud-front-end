import React, { Component } from 'react';
import { Tooltip } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';

export default class TextAreaEllipsis extends Component {
  render() {
    const { value, length = 11 } = this.props;

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
          style={{ maxWidth: `${Math.min(value.split('\n')[0].length + 1, length)}em` }}
        >
          {value}
        </div>
      </Tooltip>
    ) : null;
  }
}
