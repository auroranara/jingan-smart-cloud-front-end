import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import styles from './Section.less';

/**
 * 是否是数组
 */
const isArray = function(value) {
  return Object.prototype.toString.call(value) === '[object Array]';
};

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
    // 起始时间戳
    this.startTimestamp = null;
    // 过渡起始时间戳
    this.startTransitionTimestamp = null;
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
   * 组件更新
   */
  componentDidUpdate({ children: prevChildren }) {
    const { children } = this.props;
    const { isScrollShow } = this.state;
    if (children !== prevChildren && !isScrollShow) {
      this.resetList();
    }
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
    this.showPlaceHolder();
    this.resetPaddingRight();
  }

  /**
   * 添加轮播定时器
   */
  addCarousel = () => {
    const { isCarousel } = this.props;
    if (isCarousel) {
      const callback = (timestamp) => {
        if (!this.startTimestamp) {
          this.startTimestamp = timestamp;
        }
        const progress = timestamp - this.startTimestamp;
        if (progress >= 5000) {
          this.startTimestamp = null;
          this.transition();
        }
        this.carouselTimer = window.requestAnimationFrame(callback);
      }
      // 立即执行
      this.carouselTimer = window.requestAnimationFrame(callback);
    }
  }

  /**
   * 清除轮播定时器
   */
  clearCarousel = () => {
    window.cancelAnimationFrame(this.carouselTimer);
    this.startTimestamp = null;
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
    if (this.container.offsetHeight < this.container.scrollHeight) {
      this.setState({
        isPlaceHolderShow: true,
      });
    }
    else {
      this.setState({
        isPlaceHolderShow: false,
      });
    }
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
  resetPaddingRight = () => {
    if (this.container.offsetHeight < this.container.scrollHeight) {
      this.setState({
        isPaddingRightChange: true,
      });
    }
    else {
      this.setState({
        isPaddingRightChange: false,
      });
    }
  }

  /**
   * 列表从当前位置过渡到目标位置
   */
  transition = () => {
    // 子元素的高度
    const height = this.list.scrollHeight / this.list.childNodes.length;
    // 当前的scrollTop
    const start = this.container.scrollTop;
    // 计算要滚动的距离
    const target = height - start % height;
    const duration = 600;
    const callback = (timestamp) => {
      if (!this.startTransitionTimestamp) {
        this.startTransitionTimestamp = timestamp;
      }
      const progress = timestamp - this.startTransitionTimestamp;
      const scrollTop = start + Math.min(progress/duration*target, target)
      this.container.scrollTop = scrollTop;
      if (progress >= duration) {
        this.startTransitionTimestamp = null;
        this.handleTransitionEnd(Math.round(scrollTop / height));
      }
      else {
        this.transitionTimer = window.requestAnimationFrame(callback);
      }
    };
    this.transitionTimer = window.requestAnimationFrame(callback);

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
    this.resetList();
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
    let arr = isArray(children) ? children : [children];
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
    const placeHolder =  isCarousel && isPlaceHolderShow ? arr.map(child=>({
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
                {[...arr.slice(currentIndex), ...placeHolder, ...arr.slice(0,currentIndex)]}
              </div>
            ) : arr}
          </div>
        </div>
      </section>
    );
  }
}
