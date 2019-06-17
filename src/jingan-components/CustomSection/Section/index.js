import React from 'react';
import { Spin } from 'antd';
import classNames from 'classnames';
import { Scroll } from 'react-transform-components';
// 引入样式文件
import styles from './index.less';

const renderHorizontal = ({ style }) => <div style={{ ...style, display: 'none' }} />;
const thumbStyle = { backgroundColor: 'rgb(0, 87, 169)' };

/**
 * description: 容器
 */
export default function CustomSection ({
  // 容器类名
  className,
  // 容器样式
  style,
  // 标题类名
  titleClassName,
  // 标题样式
  titleStyle,
  // 内容类名
  contentClassName,
  // 内容样式
  contentStyle,
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
  // 是否显示第二个滚动条
  mode="single",
  // 子元素
  children2,
  // 滚动条相关设置属性，请查看Scroll组件
  scrollProps2: {
    className: scrollClassName2,
    ...scrollProps2
  }={},
  // spin组件相关参数
  spinProps2: {
    // 是否在加载中
    loading: loading2,
    // 类名
    wrapperClassName: spinClassName2,
    ...spinProps2
  }={},
  ...restProps
}) {
  return (
    <div className={classNames(styles.container, className)} style={style} {...restProps}>
      {title && (
        <div className={classNames(styles.title, titleClassName)} style={titleStyle}>
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
        {mode !== 'single' && (
          <Spin wrapperClassName={classNames(styles.spin, spinClassName2)} spinning={!!loading2} {...spinProps2}>
            <Scroll
              className={classNames(styles.scroll, scrollClassName2)}
              thumbStyle={thumbStyle}
              renderThumbHorizontal={renderHorizontal}
              renderTrackHorizontal={renderHorizontal}
              {...scrollProps2}
            >
              {children2}
            </Scroll>
          </Spin>
        )}
      </div>
      {extra}
    </div>
  );
}
