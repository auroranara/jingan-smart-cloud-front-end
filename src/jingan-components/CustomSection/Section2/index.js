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

/**
 * 容器
 */
export function CustomSection2 ({
  // 容器类名
  className,
  // 容器样式
  style,
  // 标题
  title,
  // 显示在右上角的内容
  action,
  // 不属于内容的内容
  extra,
  // 固定元素
  fixedContent,
  // 子元素
  children,
  // 滚动条相关设置属性，请查看Scroll组件
  scrollProps: {
    className: scrollClassName,
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
    <div className={classNames('section2-container', className)} style={style} {...restProps}>
      {/* <div className={styles.title} style={{ ...(planB?{ backgroundImage: `url(${titleBg})`, backgroundSize: '100% 100%' }:{ backgroundImage: `url(${titleBg2})` }), ...titleStyle }}>
        {title}
        {extra && <span className={styles.extra}>{extra}</span>}
      </div>
      <div className={styles.content} style={{ ...(planB?{ backgroundColor: 'rgba(17, 58, 112, 0.502)' }:{}), ...contentStyle  }}>
        {scroll ? (
          <Scroll {...scroll}>
            {children}
          </Scroll>
        ) : children}
      </div>
      {title && (
        <div className={classNames(styles.titleContainer, titleClassName)} style={titleStyle}>
          <div className={styles.titleIcon} />
          <div className={styles.titleLabel}>{title}</div>
          {action && <div className={styles.action}>{action}</div>}
        </div>
      )}
      <div className={classNames(styles.content, contentClassName)} style={contentStyle}>
        {fixedContent}
        <Spin wrapperClassName={classNames(styles.spin, spinClassName)} spinning={!!loading} {...spinProps}>
          <Scroll
            className={classNames(styles.scroll, scrollClassName)}
            thumbStyle={thumbStyle}
            renderThumbHorizontal={renderHorizontal}
            renderTrackHorizontal={renderHorizontal}
            {...scrollProps}
          >
            {children}
          </Scroll>
        </Spin>
      </div> */}
      {extra}
    </div>
  );
}
