import React, { PureComponent } from 'react';
import { WaterWave } from 'components/Charts';
import styles from './index.less';

/**
 * 监测球
 */
export default class App extends PureComponent {
  render() {
    const {
      style,
      className,
      title,
      percent,
      height,
      color,
      onClick,
    } = this.props;
    const containerClassName = className?`${styles.container} ${className}`:styles.container;

    return (
      <div
        className={containerClassName}
        style={style}
        onClick={onClick}
      >
        <WaterWave
          height={height}
          title={title}
          percent={percent}
          color={color}
        />
        <div className={styles.textContainer}>
          <div className={styles.percent}>{percent}</div>
          <div className={styles.title}>{title}</div>
        </div>
      </div>
    );
  }
}
