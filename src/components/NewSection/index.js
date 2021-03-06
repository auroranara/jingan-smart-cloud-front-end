import React from 'react';
import Scroll from '../Scroll';
// 标题背景
import titleBg from '@/assets/new-section-title-bg.png';
import titleBg2 from '@/assets/new-section-title-bg-2.png';
// 引入样式文件
import styles from './index.less';

/**
 * description: 容器
 * author: sunkai
 * date: 2018年01月09日
 */
export default function NewSection({
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
  extra,
  // 子元素
  children,
  // 滚动条相关设置属性，请查看Scroll组件
  scroll,
  // 不属于内容的内容
  other,
  // 点击事件
  onClick,
  // 是否使用第二种头部背景
  planB,
}) {
  return (
    <div
      className={className ? `${styles.container} ${className}` : styles.container}
      style={style}
      onClick={onClick}
    >
      <div
        className={styles.title}
        style={{
          ...(planB
            ? { backgroundImage: `url(${titleBg})`, backgroundSize: '100% 100%' }
            : { backgroundImage: `url(${titleBg2})` }),
          ...titleStyle,
        }}
      >
        {title}
        {extra && <span className={styles.extra}>{extra}</span>}
      </div>
      <div
        className={styles.content}
        style={{
          ...(planB ? { backgroundColor: 'rgba(17, 58, 112, 0.502)' } : {}),
          ...contentStyle,
        }}
      >
        {scroll ? <Scroll {...scroll}>{children}</Scroll> : children}
      </div>
      {other}
    </div>
  );
}
