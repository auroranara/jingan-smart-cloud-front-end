import React from 'react';
import { WaterWave } from '../Charts';
import styles from './index.less';

/**
 * 监测球
 */
export default function MonitorBall({
  // 容器样式
  style,
  // 容器类名
  className,
  // 容器文本
  title,
  // 容器百分比
  percent,
  // 容器高度
  height,
  // 容器颜色
  color,
  // 容器点击事件
  onClick,
  // 百分比样式
  percentStyle,
  // 文本样式
  titleStyle,
}) {
  return (
    <div
      className={className?`${styles.container} ${className}`:styles.container}
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
        <div className={styles.percent} style={percentStyle}>{percent}</div>
        <div className={styles.title} style={titleStyle}>{title}</div>
      </div>
    </div>
  );
}
