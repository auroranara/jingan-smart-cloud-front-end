import React, { PureComponent } from 'react';
import styles from './Rotate.less';

/**
 * 可自动旋转的组件
 */
export default class App extends PureComponent {
  state={
    // 当前显示的是否是正面
    isFront: true,
    // 背面的元素索引
    backIndex: 0,
  }

  componentDidUpdate({ frontIndex: prevFrontIndex }) {
    const { frontIndex } = this.props;
    if (frontIndex !== prevFrontIndex) {
      this.setState(({ isFront }) => ({
        isFront: !isFront,
        backIndex: prevFrontIndex,
      }));
    }
  }

  render() {
    // 从props中获取传参
    const { children, style, className, duration, frontIndex=0 } = this.props;
    // 从state中获取变量
    const { isFront, backIndex } = this.state;
    // 设置容器的类名
    const containerClassName = className ? `${styles.container} ${className}` : styles.container;

    return (
      <div
        className={containerClassName}
        style={{
          ...style,
          transform: `rotateY(${isFront ? 0 : 180}deg)`,
          transition: `transform ${duration || 1}s`,
        }}
      >
        <div className={styles.front}>{isFront ? children[frontIndex] : children[backIndex]}</div>
        <div className={styles.back}>{isFront ? children[backIndex] : children[frontIndex]}</div>
      </div>
    );
  }
}
