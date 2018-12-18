import React, { PureComponent } from 'react';

/**
 * description: 安全风险四色图定位点
 * author: sunkai
 * date: 2018年11月30日
 */
export default class App extends PureComponent {
  render() {
    const {
      // 容器类名
      className,
      // 容器样式
      style,
      // 定位位置
      position: {
        x=0,
        y=0,
      } = { x: 0, y: 0 }, // 风险点位置
      // 额外的参数
      image: {
        skew=0,
        rotate=45,
      } = { skew: 0, rotate: 45 },
      // 子元素
      children,
    } = this.props;
    // 计算角度
    const deg = Math.PI * rotate / 180;
    // 计算底部距离
    const bottom = Math.cos(deg) * skew * (1 - y);
    // 计算深入距离
    const z = -Math.sin(deg) * skew * (1 - y);

    return (
      <div
        className={className}
        style={{
          position: 'absolute',
          left: `${x * 100}%`,
          bottom: `${bottom}px`,
          width: 0,
          height: 0,
          transformOrigin: `center bottom`,
          transform: `translateZ(${z}px)`,
          ...style,
        }}
      >
        {children}
      </div>
    );
  }
}
