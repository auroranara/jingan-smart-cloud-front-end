import React, { PureComponent } from 'react';
// 引入样式文件
import styles from './index.less';

export default class HistoricalFire extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 渲染
   */
  render() {
    const {
      // 容器类名
      // className,
      // 数据源
      data: {
        // 本月历史火警
        fireByMonth = 0,
        // 本年历史火警
        fireByYear = 0,
        // 本季度历史火警
        fireByQuarter = 0,
      },
      // 点击事件
      onClick,
    } = this.props;

    return (
      <div className={styles.list}>
        {[
          {
            border: '2px solid #04fdff',
            name: '本月',
            value: fireByMonth,
            type: 1,
          },
          {
            border: '2px solid #04fdff',
            name: '本季',
            value: fireByQuarter,
            type: 2,
          },
          {
            border: '2px solid #04fdff',
            name: '本年',
            value: fireByYear,
            type: 3,
          },
        ].map(({ border, name, value, type }) => (
          <div key={name} className={styles.item} onClick={() => onClick(type)}>
            <span className={styles.quantity} style={{ border: border }}>
              {value}
            </span>
            <span className={styles.name}>{name}</span>
          </div>
        ))}
      </div>
    );
  }
}
