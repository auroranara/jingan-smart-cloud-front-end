import React, { PureComponent } from 'react';
// 引入样式文件
import styles from './index.less';

export default class HistoricalFire extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 挂载后
   */
  componentDidMount() {}

  /**
   * 更新后
   */
  componentDidUpdate() {}

  /**
   * 销毁前
   */
  componentWillUnmount() {}

  /**
   * 渲染
   */
  render() {
    const {
      // 容器类名
      className,
      // 数据源
      data: {
        // 本月历史火警
        fireByMonth = 0,
        // 本季度历史火警
        fireByYear = 0,
        // 本年历史火警
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
          },
          {
            border: '2px solid #04fdff',
            name: '本季',
            value: fireByYear,
          },
          {
            border: '2px solid #04fdff',
            name: '本年',
            value: fireByQuarter,
          },
        ].map(({ border, name, value }) => (
          <div className={styles.item} key={name}>
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
