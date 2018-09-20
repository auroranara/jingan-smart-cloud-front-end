import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import isArray from '@/utils/utils.js';
import styles from './Section.less';

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
    // 轮播定时器（当开启轮播且内容超出时添加）
    this.carouselTimer = null;
    // 过渡动画定时器
    this.transitionTimer = null;
    // 过渡起始时间戳
    this.startTransitionTimestamp = null;
  }

  /**
   * 组件挂载
   */
  componentDidMount() {
    // 初始化（判断当前内容高度是否超出）
    this.resize();
    // 添加resize事件监听
    window.addEventListener('resize', this.resize, false);
  }

  /**
   * 组件更新
   */
  componentDidUpdate() {

  }

  /**
   * 组件销毁
   */
  componentWillUnmount() {
    // 清除事件监听
    window.removeEventListener('resize', this.resize, false);
    // 清除轮播定时器
    clearTimeout(this.carouselTimer);
  }

  /**
   * 判断是否内容超出容器高度
   */
  resize = () => {
    const { isCarousel } = this.props;
    // 清除轮播定时器
    clearTimeout(this.carouselTimer);
    // 如果内容超出，则修改state，并添加轮播定时器
    if (this.container.scrollHeight > this.container.offsetHeight) {
      // 如果内容超出则添加定时器
      if (isCarousel) {

      }
      this.setState({
        isOverflow: true,
      });
    }
    else {
      this.setState({
        isOverflow: false,
      });
    }
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
        return children.concat(split, copyChildren).slice(startIndex, startIndex-children.length);
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
   * 开启轮播时鼠标移入
   */
  handleMouseEnter = () => {
    // 当鼠标移入时获取当前的scrollTop计算需要截取的索引，并重置scrollTop
    // 修改state变量
    this.setState({
      isMouseEnter: true,
    });
  }

  /**
   * 开启轮播时鼠标移出
   */
  handleMouseLeave = () => {
    // 修改state变量
    this.setState({
      isMouseEnter: false,
    });
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
      // 标题栏
      title,
      // 标题栏下方的固定区域，比如统计等
      fixedContent,
      // 主要内容
      children,
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
              <div className={styles.title}>
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
              <div className={styles.fixedContent}>{fixedContent}</div>
            )
          }
          <div
            className={styles.scroll}
            style={scrollStyle}
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
