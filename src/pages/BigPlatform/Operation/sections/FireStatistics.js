import React, { PureComponent } from 'react';
// 引入样式文件
import styles from './FireStatistics.less';

const DATES = ['本日', '本周', '本月'];

export default class FireStatistics extends PureComponent {
  render() {
    const {
      data: {
        fireByMonth = 0,
        fireByYear = 0,
        fireByQuarter = 0,
      },
      onClick,
    } = this.props;

    return (
      <div className={styles.list}>
        {[fireByMonth, fireByQuarter, fireByYear].map((value, i) => (
          <div key={i} className={styles.item} onClick={() => onClick(i)}>
            <span className={styles.quantity} style={{ border: '2px solid #04fdff' }}>
              {value}
            </span>
            <span className={styles.name}>{DATES[i]}</span>
          </div>
        ))}
      </div>
    );
  }
}
