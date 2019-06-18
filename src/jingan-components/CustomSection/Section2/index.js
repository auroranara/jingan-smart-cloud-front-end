import React from 'react';
import { Spin } from 'antd';
import classNames from 'classnames';
import { Scroll } from 'react-transform-components';
// 引入图片文件
import titleBackground from './section-title.png';
// 引入样式文件
import './index.less';

const renderHorizontal = ({ style }) => <div style={{ ...style, display: 'none' }} />;
const thumbStyle = { backgroundColor: 'rgb(0, 87, 169)' };
const backgroundStyle = { backgroundImage: `url(${titleBackground})` };

/**
 * 容器
 */
export default function CustomSection2 ({
  // 容器类名
  className,
  // 容器样式
  style,
  // 标题
  title,
  // 显示在右上角的内容
  action,
  // 子元素
  children,
  // 滚动条相关设置属性，请查看Scroll组件
  scrollProps: {
    className: scrollClassName,
    ref: setScrollReference,
    ...scrollProps
  }={},
  // spin组件相关参数
  spinProps: {
    // 是否在加载中
    loading,
    // 类名
    wrapperClassName: spinClassName,
    ...spinProps
  }={},
  ...restProps
}) {
  return (
    <div className={classNames('custom-section2-container', className)} style={style} {...restProps}>
      {title && (
        <div className="custom-section2-title-container" style={backgroundStyle}>
          <div className="custom-section2-title-wrapper">{title}</div>
          {action && <div className="custom-section2-action-wrapper">{action}</div>}
        </div>
      )}
      <div className="custom-section2-content-container">
        <Spin
          wrapperClassName={classNames('custom-section2-spin', spinClassName)}
          spinning={!!loading}
          {...spinProps}
        >
          <Scroll
            ref={scroll => setScrollReference && setScrollReference(scroll && scroll.dom)}
            className={classNames('custom-section2-scroll', scrollClassName)}
            thumbStyle={thumbStyle}
            renderThumbHorizontal={renderHorizontal}
            renderTrackHorizontal={renderHorizontal}
            {...scrollProps}
          >
            {children}
          </Scroll>
        </Spin>
      </div>
    </div>
  );
}
