import React from 'react';
import { Spin } from 'antd';
import classNames from 'classnames';
import { Scroll } from 'react-transform-components';
// 引入样式文件
import styles from './index.less';

const renderThumbHorizontal = ({ style }) => <div style={{ ...style, display: 'none' }} />;
const renderTrackHorizontal = ({ style }) => <div style={{ ...style, display: 'none' }} />;
const thumbStyle = { backgroundColor: 'rgb(0, 87, 169)' };

/**
 * description: 容器
 * author: sunkai
 * date: 2018年01月09日
 */
export default function Section ({
  // 容器类名
  className,
  // 容器样式
  style,
  // 标题样式
  titleStyle,
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
  // 滚动条相关设置属性，请查看Scroll组件
  scrollProps: {
    className: scrollClassName,
    ...scrollProps
  }={},
  // 点击事件
  onClick,
  // 子元素
  children,
  // scroll的引用
  refScroll,
  // spin组件相关参数
  spinProps: {
    // 是否在加载中
    loading,
    // 类名
    wrapperClassName: spinClassName,
    ...spinProps
  }={},
}) {
  return (
    <div className={classNames(styles.container, className)} style={style} onClick={onClick}>
      {title && (
        <div className={styles.titleWrapper} style={titleStyle}>
          <div className={styles.title}>
            <div className={styles.titleIcon} />
            {title}
            {action && <div className={styles.action}>{action}</div>}
          </div>
        </div>
      )}
      <div style={{ height: title ? undefined : '100%', ...contentStyle }} className={styles.content}>
        {fixedContent}
        <Spin wrapperClassName={classNames(styles.spin, spinClassName)} spinning={!!loading} {...spinProps}>
          <Scroll
            ref={refScroll}
            className={classNames(styles.scroll, scrollClassName)}
            thumbStyle={thumbStyle}
            renderThumbHorizontal={renderThumbHorizontal}
            renderTrackHorizontal={renderTrackHorizontal}
            {...scrollProps}
          >
            {children}
          </Scroll>
        </Spin>
      </div>
      {extra}
    </div>
  );
}
