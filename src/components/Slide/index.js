import React, { PureComponent } from 'react';
import styles from './index.less';

/**
 * 获取定位样式
 */
const getPositionStyle = function(direction, left=0, right=0, top=0, bottom=0, showExtra) {
  switch(direction) {
    case 'left':
    return {
      top,
      left: showExtra?left:`calc(100% + ${left+right}px)`,
    };
    case 'top':
    return {
      top: showExtra?top:`calc(100% + ${top+bottom}px)`,
      left,
    };
    case 'bottom':
    return {
      bottom: showExtra?bottom:`calc(100% + ${top+bottom}px)`,
      left,
    };
    default:
    return {
      top,
      right: showExtra?right:`calc(100% + ${left+right}px)`,
    };
  }
};

/**
 * 滑动组件
 */
export default class App extends PureComponent {
  render() {
    const {
      extra,
      showExtra=false,
      direction="right",
      duration=0.5,
      offset: { left=0, right=0, top=0, bottom=0 }={},
      className,
      style,
      children,
    } = this.props;
    const containerClassName = className? `${styles.container} ${className}` : styles.container;
    const positionStyle = getPositionStyle(direction, left, right, top, bottom, showExtra);

    return (
      <div className={containerClassName} style={{
        margin: `-${top}px -${right}px -${bottom}px -${left}px`,
        padding: `${top}px ${right}px ${bottom}px ${left}px`,
        ...style,
      }}>
        <div
          className={styles.first}
          style={{
            opacity: showExtra?'0':'1',
            transition: `opacity ${duration}s`,
          }}
        >
          {children}
        </div>
        <div
          className={styles.second}
          style={{
            ...positionStyle,
            transition: `${direction} ${duration}s`,
          }}
        >
          {extra}
        </div>
      </div>
    );
  }
}
