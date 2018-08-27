import React, { PureComponent } from 'react';
import styles from './Section.less';

/**
 * 大屏块
 */
export default class App extends PureComponent {

  /**
   * 渲染函数
   */
  render() {
    const { isScroll, title, fixedContent, children, className, style } = this.props;
    const scrollClassName = isScroll ? `${styles.wrapper} ${styles.scroll}` : styles.wrapper;
    const outerClassName = className ? `${styles.outer} ${className}` : styles.outer;

    return (
      <section className={outerClassName} style={style}>
        <div className={styles.inner}>
          {title && (
            <div className={styles.title}>
              <div className={styles.titleIcon}></div>
              {title}
            </div>
          )}
          {fixedContent && (
            <div className={styles.fixedContent}>
              {fixedContent}
            </div>
          )}
          <div className={scrollClassName}>
            {children}
          </div>
        </div>
      </section>
    );
  }
}
