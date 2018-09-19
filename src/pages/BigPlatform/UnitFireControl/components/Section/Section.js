import React, { PureComponent } from 'react';
import { Icon } from 'antd';
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
      // 是否显示间隔
      isSplitShow: false,
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
        isSplitShow: true,
      });
    }
    else {
      this.setState({
        isPlaceHolderShow: false,
        isSplitShow: false,
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
   * 列表从当前位置过渡到目标位置（默认间隔高度小于子元素高度，其他情况以后考虑）
   */
  transition = () => {
    // 从props中获取间隔元素的高度，（假装children为数组）
    const { splitHeight = 0, children } = this.props;
    // 从state中获取当前列表的首个元素在源数组中的索引
    const { currentIndex, isSplitShow } = this.state;
    // 如果isSplitShow为false，则意味着元素只有一页，不需要滚动
    if (!isSplitShow) {
      return;
    }
    // 计算子元素的高度
    const height = splitHeight !== 0 ? (this.list.scrollHeight / 2 - splitHeight) / (children.length - 1) : this.list.scrollHeight / this.list.childNodes.length;
    // 计算当前列表的首个元素到源数组结尾的剩余数量
    const currentLength = children.length - currentIndex;
    // 获取当前的scrollTop
    const start = this.container.scrollTop;
    // 计算已经滚过的子元素的数量
    let count = Math.floor(start / height);
    // 计算出去已经滚动的子元素数量剩余的高度
    const restHeight = start % height;
    // 计算滚动距离
    let target;
    // 如果滚过数量不等于剩余数量，或者间隔不存在时，则目标滚动参考距离为子元素高度
    if (splitHeight === 0 || count !== currentLength-1) {
      target = height - restHeight;
      count += 1;
    }
    // 如果滚过数量等于剩余数量，并且剩余高度小于间隔高度，则目标滚动参考距离为间隔高度
    else if (restHeight < splitHeight) {
      target = splitHeight - restHeight;
      count += 1;
    }
    // 如果滚过数量等于剩余数量，并且剩余高度大于等于间隔高度，则目标滚动参考距离为间隔高度加子元素高度
    else {
      target = height - restHeight + splitHeight;
      count += 2;
    }
    // 滚动时长
    const duration = 600;
    const callback = (timestamp) => {
      if (!this.startTransitionTimestamp) {
        this.startTransitionTimestamp = timestamp;
      }
      const progress = timestamp - this.startTransitionTimestamp;
      this.container.scrollTop = start + Math.min(progress/duration*target, target)
      if (progress >= duration) {
        this.startTransitionTimestamp = null;
        this.handleTransitionEnd(count);
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
    const { isScroll, isCarousel, closable, title, fixedContent, children, className, style, contentStyle, onClose, splitHeight=0 } = this.props;
    const { isScrollShow, isPlaceHolderShow, isPaddingRightChange, currentIndex, isSplitShow } = this.state;
    const outerClassName = className ? `${styles.outer} ${className}` : styles.outer;
    let overflowY = undefined;
    let paddingRight = undefined;
    let arr = isArray(children) ? (!isSplitShow && splitHeight !== 0 ? children.slice(0, -1) : children) : [children];
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
              {closable && (
                <Icon
                  type="close"
                  style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    fontSize: '20px',
                    cursor: 'pointer',
                  }}
                  onClick={onClose}
                />
              )}
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
              ...contentStyle,
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
