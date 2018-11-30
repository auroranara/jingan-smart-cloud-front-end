import React, { PureComponent } from 'react';
import styles from './index.less';

/**
 * description: 风险点饼图图例
 * author: sunkai
 * date: 2018年11月28日
 */
export default class App extends PureComponent {
  render() {
    const {
      // 容器类名
      className,
      // 容器样式
      style,
      // 数据源
      data=[],
    } = this.props;

    return (
      <div className={className} style={style}>
        {data.map(({ label, color, value }) => {
          return (
            <div key={label} className={styles.legendItem} style={{ overflow: 'hidden' }}>
              <div className={styles.icon} style={{ backgroundColor: color }}></div>
              <div className={styles.label}>{label}</div>
              <div className={styles.value}>{value}</div>
            </div>
          );
        })}
      </div>
    );
  }
}
