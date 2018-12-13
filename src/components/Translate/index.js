import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isArray } from '@/utils/utils';
import styles from './index.less';

/**
 * 滑动组件
 */
export default class App extends PureComponent {
  getPositionStyle = function(direction, isInner, left=0, right=0, top=0, bottom=0) {
    switch(direction) {
      case 'left':
      return {
        top,
        left: isInner ? left : `calc(100% + ${left+right}px)`,
      };
      case 'top':
      return {
        top: isInner ? top : `calc(100% + ${top+bottom}px)`,
        left,
      };
      case 'bottom':
      return {
        bottom: isInner ? bottom : `calc(100% + ${top+bottom}px)`,
        left,
      };
      default:
      return {
        top,
        right: isInner ? right : `calc(100% + ${left+right}px)`,
      };
    }
  }

  render() {
    const {
      className,
      style,
      direction="right",
      duration=0.5,
      queue=[],
      offset: { left=0, right=0, top=0, bottom=0 }={},
      children,
    } = this.props;
    const containerClassName = classnames(styles.container, className);

    return (
      <div className={containerClassName}  style={{
        top: -top,
        left: -left,
        padding: `${top}px ${right}px ${bottom}px ${left}px`,
        width: `calc(100% + ${left + right}px)`,
        height: `calc(100% + ${top + bottom}px)`,
        ...style,
      }}>
        {/* 如果children是数组，则遍历，否则原样返回 */
          isArray(children) ? children.map((item, i) => {
            const index = queue.indexOf(i);
            // 是否为容器内元素
            const isInner = index !== -1;
            // 是否为最顶层的元素
            const isTop = index === queue.length - 1;
            return (
              <div
                key={i}
                className={styles.child}
                style={{
                  ...this.getPositionStyle(direction, isInner, left, right, top, bottom),
                  width: `calc(100% - ${left + right}px)`,
                  height: `calc(100% - ${top + bottom}px)`,
                  opacity: isInner && !isTop ? '0' : '1',
                  transition: `opacity ${duration}s, ${direction} ${duration}s`,
                  zIndex: `${index+1}`,
                }}>
                {item}
              </div>
            );
          }) : children
        }
      </div>
    );
  }
}
