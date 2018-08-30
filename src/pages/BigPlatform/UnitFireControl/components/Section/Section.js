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
      // 是否重置paddingRight
      isPaddingRightChange: false,
      // 当前截取的索引
      currentIndex: 0,
    };
    // 轮播定时器
    this.carouselTimer = null;
    // 过渡定时器
    this.transitionTimer = null;
  }

  /**
   * 组件挂载
   */
  componentDidMount() {
    // 初始化
    this.resetList();
    // 添加resize事件监听
    window.addEventListener('resize', this.resetList, false);
    // 添加轮播
    this.addCarousel();
  }

  /**
   * 组件销毁
   */
  componentWillUnmount() {
    // 清除事件监听
    window.removeEventListener('resize', this.resetList, false);
    // 清除轮播
    this.clearCarousel();
  }

  /**
   * 重置列表内容
   */
  resetList = () => {
    if (this.container.offsetHeight < this.container.scrollHeight) {
      this.showPlaceHolder();
      this.resetPaddingRight(true);
    }
    else {
      this.hidePlaceHolder();
      this.resetPaddingRight(false);
    }
  }

  /**
   * 添加轮播定时器
   */
  addCarousel = () => {
    const { isCarousel } = this.props;
    if (isCarousel) {
      this.carouselTimer = setInterval(() => {
        this.transition();
      },5000);
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
   * 设置是否改变paddingRight
   */
  resetPaddingRight = (isPaddingRightChange) => {
    this.setState({
      isPaddingRightChange,
    });
  }

  /**
   * 列表从当前位置过渡到目标位置
   */
  transition = () => {
    const height = this.list.scrollHeight / this.list.childNodes.length;
    const start = this.container.scrollTop;
    const target = height - start % height;
    const end = start + target;
    const duration = 500;
    const delay = duration / target;
    this.transitionTimer = setInterval(() => {
      this.container.scrollTop += 1;
      if (this.container.scrollTop >= end) {
        clearInterval(this.transitionTimer);
        this.handleTransitionEnd(Math.round(this.container.scrollTop / height));
      }
    }, delay)
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
    this.hidePlaceHolder();
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
    this.showPlaceHolder();
  }

  /**
   * 过渡结束事件
   */
  handleTransitionEnd = (step=1) => {
    const { children } = this.props;
    this.container.scrollTop = 0;
    // 重置索引
    this.setState(({ currentIndex }) => ({
      currentIndex: (currentIndex+step) >= children.length ? ((currentIndex+step)%children.length) : (currentIndex+step),
    }));
  }

  /**
   * 渲染函数
   */
  render() {
    const { isScroll, isCarousel, title, fixedContent, children, className, style } = this.props;
    const { isScrollShow, isPlaceHolderShow, isPaddingRightChange, currentIndex } = this.state;
    const outerClassName = className ? `${styles.outer} ${className}` : styles.outer;
    let overflowY = undefined;
    let paddingRight = undefined;
    if (isScroll) {
      if (isCarousel) {
        if (isScrollShow) {
          overflowY = 'auto';
          if (isPaddingRightChange) {
            paddingRight = 8;
          }
        }
      }
      else {
        overflowY = 'auto';
        if (isPaddingRightChange) {
          paddingRight = 8;
        }
      }
    }
    const placeHolder =  isCarousel && isPlaceHolderShow ? children.map(child=>({
      ...child,
      key: child.key+'_cpy',
    })) : [];

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
              overflowY,
              paddingRight,
            }}
            onMouseEnter={isCarousel ? this.handleMouseEnter : undefined}
            onMouseLeave={isCarousel ? this.handleMouseLeave : undefined}
            ref={container=>this.container=container}
          >
            {isCarousel ? (
              <div
                className={styles.scrollList}
                ref={list=>this.list=list}
              >
                {[...children.slice(currentIndex), ...placeHolder, ...children.slice(0,currentIndex)]}
              </div>
            ) : children}
          </div>
        </div>
      </section>
    );
  }
}
