import React, { PureComponent } from 'react';
import classnames from 'classnames';
import titleBg from '@/assets/new-section-title-bg.png';
import contentBg from '@/assets/new-section-content-bg.png';

import styles from './index.less';

/**
 * description: 容器
 * author: sunkai
 * date: 2018年12月03日
 */
export default class App extends PureComponent {
  render() {
    const {
      // 容器类名
      className,
      // 容器样式
      style,
      // 显示在右上角的内容
      extra,
      // 标题
      title,
      // 子元素
      children,
      // 标题样式
      titleStyle,
      // 内容样式
      contentStyle,
      // 是否显示滚动条
      isScroll,
    } = this.props;
    // 合并后的类名
    const containerClassName = classnames(styles.container, className);

    return (
      <div className={containerClassName} style={style}>
          <div className={styles.title} style={{ backgroundImage: `url(${titleBg})`, ...titleStyle }}>
            {title}
            {extra && <span className={styles.extra}>{extra}</span>}
          </div>
          <div className={styles.content} style={{ backgroundImage: `url(${contentBg})`, ...contentStyle }}>
            <div className={styles.scroll} style={{ overflow: isScroll ? 'auto' : 'hidden', height: '100%' }}>{children}</div>
          </div>
      </div>
    );
  }
}
