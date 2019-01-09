import React, { PureComponent } from 'react';
import debounce from 'lodash-decorators/debounce';
import Scrollbars from 'react-custom-scrollbars';
import { isArray } from '@/utils/utils';
// 引入样式文件
// import styles from './index.less';

// 默认的周期
const DEFAULT_PERIOD = 5 * 1000;
// 默认的滚动时长
const DEFAULT_DURATION = 0.5 * 1000;

/**
 * description: 自定义滚动条容器
 * author: sunkai
 * date: 2019年01月04日
 */
export default class Scroll extends PureComponent {
  constructor(props) {
	  super(props);
    this.state = {
      // 是否内容超出容器高度（用于开启自动滚动时判断是否需要复制内容）
      isOverflow: true,
      // 是否鼠标移入（用于开启自动滚动且未移入时隐藏滚动条）
      isMouseEnter: false,
      // 鼠标移入时，数组截取的开始索引
      startIndex: 0,
    };
    // resize添加去抖
    this.debouncedResize = debounce(this.resize, 100, { leading: true, trailing: false });
    // 周期定时器
    this.periodTimer = null;
    // 周期定时器起始时间
    this.periodStart = null;
    // 滚动定时器
    this.scrollTimer = null;
    // 滚动起始时间
    this.scrollStart = null;
    // 临时存放的scrollTop
    this.scrollTop = 0;
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const { autoScroll } = this.props;
    // 如果开启了自动滚动
    if (autoScroll) {
      // 初始化（判断当前内容高度是否超出）
      this.resize();
      // 添加resize事件监听
      window.addEventListener('resize', this.debouncedResize, false);
      // 设置定时器
      this.setPeriodTimer();
    }
  }

  /**
   * 更新后
   */
  componentDidUpdate({ children: prevChildren }) {
    const { autoScroll, children } = this.props;
    // 这里需要判断源数据是否发生变化
    if (autoScroll && prevChildren !== children) {
      this.resize();
    }
  }

  /**
   * 销毁前
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedResize, false);
    this.unsetPeriodTimer();
    this.unsetScrollTimer();
  }

  /**
   * 判断是否内容超出容器高度
   */
  resize = () => {
    const { autoScroll } = this.props;
    if (autoScroll) {
      const { isOverflow: prevIsOverflow } = this.state;
      const clientHeight = this.dom.getClientHeight();
      const scrollHeight = this.dom.getScrollHeight();
      const { children } = this.dom.view;
      // 判断是否内容超出容器高度
      const isOverflow = prevIsOverflow ? children[Math.floor(children.length / 2)].offsetTop > clientHeight  : scrollHeight > clientHeight;
      // 修改state
      this.setState({
        isOverflow,
      });
      if (!prevIsOverflow && isOverflow) {
        this.setPeriodTimer();
      }
      else if (prevIsOverflow && !isOverflow) {
        this.unsetPeriodTimer();
        this.unsetScrollTimer();
      }
    }
  }

  /**
   * 设置周期定时器
   */
  setPeriodTimer = () => {
    this.periodTimer = window.requestAnimationFrame(this.periodCallback);
  }

  /**
   * 周期定时器回调函数
   */
  periodCallback = (timestamp) => {
    const { period=DEFAULT_PERIOD } = this.props;
    if (!this.periodStart) {
      this.periodStart = timestamp;
    }
    // 计算已经经过的时间
    const offset = timestamp - this.periodStart;
    // 如果已经经过指定的时间，则开始滚动
    if (offset >= period) {
      const { scrollTop, scrollBy, index } = this.getTargetPosition();
      this.unsetPeriodTimer();
      this.setScrollTimer(scrollTop, scrollBy, index);
    }
    // 否则继续下一次
    else {
      this.setPeriodTimer();
    }
  }

  /**
   * 清除周期定时器
   */
  unsetPeriodTimer = () => {
    window.cancelAnimationFrame(this.periodTimer);
    this.periodStart = null;
  }

  /**
   * 设置滚动定时器
   */
  setScrollTimer = (scrollTop, scrollBy, index) => {
    const callback = (timestamp) => {
      const { duration=DEFAULT_DURATION } = this.props;
      if (!this.scrollStart) {
        this.scrollStart = timestamp;
      }
      // 计算已经经过的时间
      const offset = timestamp - this.scrollStart;
      // 计算目标位置
      const target = scrollTop + Math.min(offset / duration * scrollBy, scrollBy);
      // 如果已经经过对应时长，则清除滚动定时器，并开始下一次计时
      if (offset >= duration) {
        this.dom.scrollTop(target);
        if (Math.floor(this.dom.view.children.length / 2) === index) {
          this.dom.scrollToTop();
        }
        this.unsetScrollTimer();
        this.setPeriodTimer();
      }
      // 否则开始滚动
      else {
        this.dom.scrollTop(target);
        this.setScrollTimer(scrollTop, scrollBy, index);
      }
    }
    this.scrollTimer = window.requestAnimationFrame(callback);
  }

  /**
   * 清除滚动定时器
   */
  unsetScrollTimer = () => {
    window.cancelAnimationFrame(this.scrollTimer);
    this.scrollStart = null;
  }

  /**
   * 计算需要移动到的目标位置
   */
  getTargetPosition = () => {
    const { children } = this.dom.view;
    const currentScrollTop = this.dom.getScrollTop();
    const scrollHeight = this.dom.getScrollHeight();
    const averageHeight = scrollHeight / children.length;
    let index = Math.floor(currentScrollTop / averageHeight);
    while(true) {
      if (children[index].offsetTop > currentScrollTop) {
        if (children[index-1].offsetTop > currentScrollTop) {
          index -= 1;
        }
        else {
          return {
            // 经过的最后一个元素索引
            index: index - 1,
            scrollTop: currentScrollTop,
            scrollBy: children[index].offsetTop - currentScrollTop,
            scrollSlice: currentScrollTop - children[index-1].offsetTop,
          };
        }
      }
      else {
        index += 1;
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
    let { children } = this.props;
    const { split } = this.props;
    const { isOverflow, isMouseEnter, startIndex } = this.state;
    // 判断children是否为数组
    if (!isArray(children)) {
      children = [children];
    }
    // 内容超出时
    if (isOverflow) {
      const copyChildren = children.map(item => ({
        ...item,
        key: `${item.key}_cpy`,
      }));
      // 鼠标移入时
      if (isMouseEnter) {
        return children.slice(startIndex).concat(split, copyChildren.slice(0, startIndex));
      }
      return children.concat(split, copyChildren);
    }
    return children;
  }

  /**
   * 鼠标移入
   */
  handleMouseEnter = (e) => {
    const { onMouseEnter, autoScroll } = this.props;
    // 如果开启自动滚动，则清空定时器
    if (autoScroll) {
      const { index, scrollTop, scrollSlice } = this.getTargetPosition();
      this.scrollTop = scrollTop - scrollSlice;
      this.setState({ isMouseEnter: true, startIndex: index }, () => {
        this.dom.scrollTop(scrollSlice);
      });
      this.unsetPeriodTimer();
      this.unsetScrollTimer();
    }
    if (onMouseEnter) {
      onMouseEnter(e);
    }
  }

  /**
   * 鼠标移出
   */
  handleMouseLeave = (e) => {
    const { onMouseLeave, autoScroll } = this.props;
    // 如果开启自动滚动，则设置定时器
    if (autoScroll) {
      const currentScrollTop = this.dom.getScrollTop();
      this.setState({ isMouseEnter: false, startIndex: 0 }, () => {
        this.dom.scrollTop(this.scrollTop+currentScrollTop);
      });
      this.setPeriodTimer();
    }
    if (onMouseLeave) {
      onMouseLeave(e);
    }
  }

  /**
   * 修改滚动条样式
   */
  renderThumb = ({ style }) => {
    const { thumbStyle={ backgroundColor: `rgba(9, 103, 211, 0.5)` }, autoScroll } = this.props;
    const { isMouseEnter } = this.state;
    return <div style={{ ...style, display: autoScroll && !isMouseEnter ? 'none' : undefined, borderRadius: '10px', ...thumbStyle }} />;
  }

  /**
   * 渲染
   */
  render() {
    const {
      // 容器类名
      className,
      // 容器样式
      style,
      // 是否自动隐藏滚动条
      autoHide,
      // 是否自动滚动
      autoScroll,
      // 自动滚动的时间间隔，默认5s
      period,
      // 自动滚动的时长，默认0.5s
      duration,
      // 开启自动滚动后可能存在的分隔元素
      split,
      // 内容
      children,
      // 滚动条样式
      thumbStyle,
      // 鼠标移入
      onMouseEnter,
      // 鼠标移出
      onMouseLeave,
      // 剩余的参数,详见react-custom-scrollbars组件可设置参数
      ...restProps
    } = this.props;

    return (
      <Scrollbars
        className={className}
        style={style}
        renderThumbHorizontal={this.renderThumb}
        renderThumbVertical={this.renderThumb}
        autoHide={autoHide}
        ref={dom => {this.dom=dom;}}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        {...restProps}
      >
        {autoScroll ? this.getScrollList() : children}
      </Scrollbars>
    );
  }
}
