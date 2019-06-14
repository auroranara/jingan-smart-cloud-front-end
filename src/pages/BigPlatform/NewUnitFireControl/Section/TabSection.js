import React, { PureComponent } from 'react';
import classnames from 'classnames';
import titleBg from '../imgs/title-bg.png';
import titleBgActive from '../imgs/title-bg-active.png';
// import contentBg from '@/assets/new-section-content-bg.png';

import styles from './TabSection.less';

/**
 * description: 容器
 * author: zkg
 * date: 2019年5月15日
 */
export default class TabSection extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
    };
  }
  render() {
    const {
      // 容器类名
      className,
      // 容器样式
      style,
      // 显示在右上角的内容
      extra,
      //标签
      tabs = [],
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
    const { active } = this.state;

    return (
      <div className={containerClassName} style={style}>
        <div className={styles.tabs}>
          {tabs.map((item, index) => {
            const { title, onClick } = item;
            const img = index === active ? titleBgActive : titleBg;
            return (
              <div
                className={styles.title}
                style={{
                  backgroundImage: `url(${img})`,
                  zIndex: index === active ? 66 : -index,
                  ...titleStyle,
                }}
                onClick={() => {
                  this.setState({ active: index });
                  onClick && onClick();
                }}
                key={index}
              >
                {title}
              </div>
            );
          })}
          {extra && <span className={styles.extra}>{extra}</span>}
        </div>

        <div
          className={styles.content}
          style={{
            // backgroundImage: `url(${contentBg})`,
            ...contentStyle,
          }}
        >
          <div
            className={styles.scroll}
            style={{ overflow: isScroll ? 'auto' : 'hidden', height: '100%' }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
}
