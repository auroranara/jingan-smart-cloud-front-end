import React, { PureComponent } from 'react';
import styles from './Section.less';

/**
 * 大屏块
 */
export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 是否显示滚动条
      isScrollShow: false,
      // 是否显示占位内容
      isPlaceHolderShow: false,
    };
    // 轮播定时器
    this.carouselTimer = null;
  }

  /**
   * 组件挂载
   */
  componentDidMount() {
    // 添加轮播
    this.addCarousel();
  }

  /**
   * 组件销毁
   */
  componentWillUnmount() {
    // 清除轮播
    this.clearCarousel();
  }

  /**
   * 添加轮播定时器
   */
  addCarousel = () => {
    const { isCarousel } = this.props;
    if (isCarousel) {
      this.carouselTimer = setInterval(() => {
        const scrollTop = this.list.scrollTop;
        const scrollHeight = this.list.scrollHeight;
        const offsetHeight = this.list.offsetHeight;
        if (offsetHeight < scrollHeight) {
          if (scrollTop < scrollHeight / 2) {
            this.list.scrollTop = scrollTop + 1;
          }
          else {
            this.list.scrollTop = scrollTop - scrollHeight / 2;
          }
        }
      }, 25);
      if (this.list.offsetHeight < this.list.scrollHeight) {
        this.showPlaceHolder();
      }
    }
  }

  /**
   * 清除轮播定时器
   */
  clearCarousel = () => {
    clearInterval(this.carouselTimer);
  }

  /**
   * 显示滚动条
   */
  showScroll = () => {
    this.setState({
      isScrollShow: true,
    });
  }

  /**
   * 隐藏滚动条
   */
  hideScroll = () => {
    this.setState({
      isScrollShow: false,
    });
  }

  /**
   * 显示占位内容
   */
  showPlaceHolder = () => {
    this.setState({
      isPlaceHolderShow: true,
    });
  }

  /**
   * 隐藏占位内容
   */
  hidePlaceHolder = () => {
    this.setState({
      isPlaceHolderShow: false,
    });
  }

  /**
   * 鼠标移入事件
   */
  handleMouseEnter = () => {
    // 清除轮播
    this.clearCarousel();
    // 显示滚动条
    this.showScroll();
    // 隐藏占位内容
    // this.hidePlaceHolder();
  }

  /**
   * 鼠标移出事件
   */
  handleMouseLeave = () => {
    // 添加轮播
    this.addCarousel();
    // 隐藏滚动条
    this.hideScroll();
    // 显示占位内容
    // this.showPlaceHolder();
  }

  /**
   * 渲染函数
   */
  render() {
    const { isScroll, isCarousel, title, fixedContent, children, className, style } = this.props;
    const { isScrollShow, isPlaceHolderShow } = this.state;
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
          <div
            className={styles.scroll}
            style={{
              overflowY: isScroll ? (isCarousel ? (isScrollShow ? 'auto' : undefined) : 'auto') : undefined,
            }}
            onMouseEnter={isCarousel ? this.handleMouseEnter : undefined}
            onMouseLeave={isCarousel ? this.handleMouseLeave : undefined}
            ref={list=>this.list=list}
          >
            {children}
            {isScroll && isCarousel && isPlaceHolderShow && children}
          </div>
        </div>
      </section>
    );
  }
}
