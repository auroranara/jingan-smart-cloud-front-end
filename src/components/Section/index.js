import React, { PureComponent } from 'react';
import debounce from 'lodash/debounce';
import { Icon } from 'antd';
import { isArray } from '@/utils/utils.js';
import styles from './index.less';

/* 默认的关闭按钮内容 */
const defaultCloseContent = (
  <Icon type="close" style={{ fontSize: 20, verticalAlign: 'top' }} />
);
// 默认滚动样式
const defaultScollStyle = {
  overflow: 'auto',
  paddingRight: 8,
};

/**
 * 大屏各模块容器
 */
export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 是否内容超出容器高度
      isOverflow: false,
      // 是否鼠标移入
      isMouseEnter: false,
      // 鼠标移入时，数组截取的开始索引
      startIndex: 0,
    };
    // resize添加去抖
    this.debouncedResize = debounce(this.resize, 100, { leading: true, trailing: false });
    // 轮播定时器（当开启轮播且内容超出时添加）
    this.carouselTimer = null;
    // 轮播定时器起始时间
    this.startTimestamp = null;
    // 过渡动画定时器
    this.transitionTimer = null;
    // 过渡起始时间戳
    this.startTransitionTimestamp = null;
    // 子元素高度
    this.itemHeight = 0;
    // 列表加上间隔的高度
    this.listHeight = 0;
  }

  /**
   * 组件挂载
   */
  componentDidMount() {
    // 初始化（判断当前内容高度是否超出）
    this.resize();
    // 添加resize事件监听
    window.addEventListener('resize', this.debouncedResize, false);
  }

  /**
   * 组件更新
   */
  componentDidUpdate({ children: prevChildren, hackHeight: prevHackHeight }) {
    const { children, hackHeight } = this.props;
    // 当内容发生变化时，重新计算内容高度是否超出容器以显示或隐藏滚动条，由于技术所限，暂时通过length判断
    if (prevChildren.length !== children.length || this.getChildrenLength(children) !== this.getChildrenLength(prevChildren)) {
      this.resize();
    }
    else if (hackHeight !== prevHackHeight) {
      this.setState({
        isOverflow: hackHeight > this.container.offsetHeight,
      });
    }
  }

  /**
   * 组件销毁
   */
  componentWillUnmount() {
    // 清除事件监听
    window.removeEventListener('resize', this.debouncedResize, false);
    // 清除轮播定时器
    this.clearCarousel()
    // 清除过渡定时器
    this.clearTransition();
  }

  /**
   * 获取children的实际长度
   */
  getChildrenLength(children) {
    return children.length && children.reduce((total, cur) => {
      total += (cur && cur.length) ? cur.length : 0;
      return total;
    }, 0);
  }

  /**
   * 判断是否内容超出容器高度
   */
  resize = () => {
    const { splitHeight=0, isCarousel } = this.props;
    const { isOverflow } = this.state;
    // 判断是否内容超出容器高度
    const nextIsOverflow = isOverflow && isCarousel ? (this.container.scrollHeight - splitHeight) / 2 > this.container.offsetHeight  : this.container.scrollHeight > this.container.offsetHeight;
    // 修改state
    this.setState({
      isOverflow: nextIsOverflow,
    });
    // 重置轮播定时器
    this.resetCarousel(nextIsOverflow);
  }

  /**
   * 重置轮播定时器（注：只有在开启轮播且内容超出时有效，否则会清除定时器）
   */
  resetCarousel = (isOverflow=this.state.isOverflow) => {
    // 由于每次在添加定时器时需要先检测是否开启轮播及内容超出，所以将检测放到这里
    const { isCarousel } = this.props;
    // 清除轮播定时器
    this.clearCarousel();
    // 当开启轮播且内容超出时添加定时器
    if (isCarousel && isOverflow) {
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
   * 过渡动画（）
   */
  transition = () => {
    // 从props中获取间隔元素的高度
    const { splitHeight = 0 } = this.props;
    let {
      length,
      scrollTop,
      itemHeight,
      count,
      restHeight,
    } = this.getScrollParams();
    // 计算需要滚动的距离
    let target;
    // 如果滚过数量不等于剩余数量，或者间隔不存在时，则目标滚动参考距离为子元素高度
    if (splitHeight === 0 || count !== length) {
      target = itemHeight - restHeight;
      count += 1;
    }
    // 如果滚过数量等于剩余数量，并且剩余高度小于间隔高度，则目标滚动参考距离为间隔高度
    else if (restHeight < splitHeight) {
      target = splitHeight - restHeight;
      count += 1;
    }
    // 如果滚过数量等于剩余数量，并且剩余高度大于等于间隔高度，则目标滚动参考距离为间隔高度加子元素高度
    else {
      target = itemHeight - restHeight + splitHeight;
      count += 2;
    }
    // 是否滚过一半列表
    const flag = splitHeight === 0 ? (count === length) : (count === length + 1);
    // 滚动时长
    const duration = 600;
    // 动画回调
    const callback = (timestamp) => {
      if (!this.startTransitionTimestamp) {
        this.startTransitionTimestamp = timestamp;
      }
      const progress = timestamp - this.startTransitionTimestamp;
      this.container.scrollTop = scrollTop + Math.min(progress/duration*target, target)
      if (progress >= duration) {
        this.startTransitionTimestamp = null;
        // 当列表滚动正好经过间隔时
        if (flag) {
          this.container.scrollTop = 0;
        }
      }
      else {
        this.transitionTimer = window.requestAnimationFrame(callback);
      }
    };
    // 立即执行
    this.transitionTimer = window.requestAnimationFrame(callback);
  }

  /**
   * 获取列表相关数据
   */
  getScrollParams = () => {
    // 从props中获取间隔元素的高度，（假装children为数组）
    const { splitHeight = 0, children } = this.props;
    // 获取children长度
    const length = children.length;
    // 获取容器的scrollHeight
    const scrollHeight = this.list.scrollHeight;
    // 获取容器的scrollTop
    const scrollTop = this.container.scrollTop;
    // 单份children的高度
    const listHeight = (scrollHeight - splitHeight) / 2;
    // 获取子元素高度
    const itemHeight = listHeight / length;
    // 计算已经滚过的子元素的数量
    let count = Math.floor(scrollTop / itemHeight);
    // 计算除去已经滚动的子元素数量剩余的高度
    const restHeight = scrollTop % itemHeight;
    return {
      length,
      listHeight: listHeight + (+splitHeight),
      scrollTop,
      itemHeight,
      count,
      restHeight,
    };
  }

  /**
   * 获取滚动条相关样式
   */
  getScrollStyle = () => {
    // 当滚动条显示时，修改paddingRight以使内容不移动（问题来了，滚动条什么时候会显示）
    // 1.前提设置了isScroll为true
    // 2.当开启轮播时，只有鼠标移入且内容超出时才显示
    // 3.当没有开启轮播时，内容超出时就显示
    const { isScroll, isCarousel } = this.props;
    const { isOverflow, isMouseEnter } = this.state;
    if (isScroll) {
      if (isCarousel) {
        if (isMouseEnter && isOverflow) {
          return defaultScollStyle;
        }
      }
      else if (isOverflow){
        return defaultScollStyle;
      }
    }
  }

  /**
   * 获取开启轮播时的内容列表
   */
  getScrollList = () => {
    // 首先明确一点，这个方法只在开启轮播时调用，同时间隔额外传入，不与children合并
    // 当内容超出时，就复制一份children然后和children以及间隔合并组成新的列表放入容器中，以实现无缝轮播
    // 当内容超出且鼠标移入时，加入间隔，且对两份列表进行截取以只显示一份完整的列表
    // 当内容没有超出时，原样返回
    let { children, split } = this.props;
    const { isOverflow, isMouseEnter, startIndex } = this.state;
    // 判断children是否为数组
    if (!isArray(children)) {
      children = [children];
    }
    // 内容超出时
    if (isOverflow) {
      const copyChildren = children.map(item => ({
        ...item,
        key: item.key + '_cpy',
      }));
      // 鼠标移入时
      if (isMouseEnter) {
        return children.slice(startIndex).concat(split, copyChildren.slice(0, startIndex));
      }
      else {
        return children.concat(split, copyChildren);
      }
    }
    // 内容没有超出时
    else {
      return children;
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
   * 清除过渡定时器
   */
  clearTransition = () => {
    window.cancelAnimationFrame(this.transitionTimer);
    this.startTransitionTimestamp = null;
  }

  /**
   * 开启轮播时鼠标移入（注：只在开启轮播且内容超出时有效）
   */
  handleMouseEnter = () => {
    const { isOverflow } = this.state;
    if (isOverflow) {
      const {
        // 列表高度
        listHeight,
        // 子元素高度
        itemHeight,
        // 计算已经滚过的子元素数量作为起始索引
        count,
        // 计算剩余的高度作为新的scrollTop
        restHeight,
      } = this.getScrollParams();
      // 保存子元素高度，鼠标移出时使用
      this.itemHeight = itemHeight;
      this.listHeight = listHeight;
      // 停止动画
      this.clearTransition();
      // 清除轮播定时器
      this.clearCarousel();
      // 修改state变量
      this.setState({
        isMouseEnter: true,
        startIndex: count,
      }, () => {
        // 重置scrollTop
        this.container.scrollTop = restHeight;
      });
    }
  }

  /**
   * 开启轮播时鼠标移出（注：只在开启轮播且内容超出时有效）
   */
  handleMouseLeave = () => {
    const { startIndex, isOverflow } = this.state;
    if (isOverflow) {
      // 重置轮播定时器
      this.resetCarousel();
      // 计算目标scrollTop
      const scrollTop = (startIndex*this.itemHeight + this.container.scrollTop) % this.listHeight;
      // 修改state变量
      this.setState({
        isMouseEnter: false,
        startIndex: 0,
      }, () => {
        // 重置当前的scrollTop
        this.container.scrollTop = scrollTop;
      });
    }
  }

  render() {
    // 从props中获取传参
    const {
      // 外部容器类名
      className,
      // 外部容器样式
      style,
      // 是否开启自动循环
      isCarousel,
      // 是否显示关闭按钮
      closable,
      // 关闭按钮内容
      closeContent=defaultCloseContent,
      // 关闭按钮点击事件
      onClose,
      // 内容样式
      contentStyle,
      // 标题栏
      title,
      // 标题栏下方的固定区域，比如统计等
      fixedContent,
      // 主要内容
      children,
      // 固定内容样式
      fixedContentStyle,
      // 标题栏样式
      titleStyle,
    } = this.props;
    // 外部容器类名
    const outerClassName = className ? `${styles.outer} ${className}` : styles.outer;
    // 获取滚动条相关样式
    const scrollStyle = this.getScrollStyle();

    return (
      <section className={outerClassName} style={style}>
        <div className={styles.inner}>
          {/* 标题栏 */
            title && (
              <div className={styles.title} style={titleStyle}>
                <div className={styles.titleIcon}></div>
                <div className={styles.titleContent}>{title}</div>
                {/* 关闭按钮 */
                  closable && (
                    <div className={styles.closeButton} onClick={onClose}>{closeContent}</div>
                  )
                }
              </div>
            )
          }
          {/* 标题栏下方的固定区域，比如统计等 */
            fixedContent && (
              <div className={styles.fixedContent} style={fixedContentStyle}>{fixedContent}</div>
            )
          }
          <div
            className={styles.scroll}
            style={{
              ...contentStyle,
              ...scrollStyle,
            }}
            onMouseEnter={isCarousel?this.handleMouseEnter:undefined}
            onMouseLeave={isCarousel?this.handleMouseLeave:undefined}
            ref={container=>this.container=container}
          >
            {/* 主要内容区域 */
              isCarousel ? (
                <div
                  className={styles.scrollList}
                  ref={list=>this.list=list}
                >
                  {this.getScrollList()}
                </div>
              ) : children
            }
          </div>
        </div>
      </section>
    );
  }
}
