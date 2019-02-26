import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { Carousel, Icon } from 'antd';
// 引入样式文件
import styles from './index.less';

// 指示点
const defaultRenderDot = () => <div />;
// 指示点容器
const defaultRenderDots = dots => <ul>{dots}</ul>
// 左箭头
const defaultPrevArrow = <Icon type="left" />
// 右箭头
const defaultNextArrow = <Icon type="right" />

/**
 * 自定义轮播组件，对antd的Carousel组件的再封装
 */
export default class CustomCarousel extends Component {
  state = {
    // 箭头是否显示
    showArrow: false,
  }

  carousel = null;

  componentDidMount() {
    const { carouselProps: { arrows, arrowsAutoHide } = {} } = this.props;
    if (arrows && !arrowsAutoHide) {
      this.setState({ showArrow: true });
    }
  }

  setCarouselReference = (carousel) => {
    const { carouselProps: { ref } = {} } = this.props;
    this.carousel = carousel;
    ref && ref(carousel);
  }

  onMouseEnter = () => {
    this.setState({ showArrow: true });
  }

  onMouseLeave = () => {
    this.setState({ showArrow: false });
  }

  /**
   * 点击左箭头
   */
  handleClickPrevArrow = () => {
    this.carousel.prev();
  }

  /**
   * 点击右箭头
   */
  handleClickNextArrow = () => {
    this.carousel.next();
  }

  render() {
    const {
      // 容器类名
      className,
      // 容器样式
      style,
      // Carousel组件可设置参数对象
      carouselProps: {
        // 引用
        ref,
        // dot容器渲染函数
        appendDots,
        renderDots,
        // dot渲染函数
        customPaging,
        renderDot,
        // 是否显示箭头
        arrows,
        // 左箭头
        prevArrow = defaultPrevArrow,
        // 右箭头
        nextArrow = defaultNextArrow,
        // 箭头是否自动隐藏
        arrowsAutoHide,
        // 移动元素数量
        slidesToScroll=1,
        // 是否自适应高度
        adaptiveHeight,
        // 以下为过滤参数
        fade, // 使用effect替代
        vertical, // 取消垂直显示
        ...carouselProps
      } = {},
      // 子元素
      children,
    } = this.props;
    const { showArrow } = this.state;
    const arrowStyle = showArrow ? { opacity: 1 } : { opacity: 0 };
    return (
      <div
        className={classNames(styles.container, className, adaptiveHeight ? styles.adaptiveContainer : undefined)}
        style={style}
        onMouseEnter={arrows && arrowsAutoHide ? this.onMouseEnter : undefined}
        onMouseLeave={arrows && arrowsAutoHide ? this.onMouseLeave : undefined}
      >
        <Carousel
          ref={this.setCarouselReference}
          appendDots={renderDots || appendDots || defaultRenderDots}
          customPaging={renderDot || customPaging || defaultRenderDot}
          slidesToScroll={slidesToScroll}
          {...carouselProps}
        >
          {children}
        </Carousel>
        {/* 这里的判断条件存在问题，以后再来解决 */}
        {arrows && children.length / slidesToScroll > 1 && (
          <Fragment>
            <div
              className={styles.prevArrow}
              style={arrowStyle}
              onClick={this.handleClickPrevArrow}
            >
              {prevArrow}
            </div>
            <div
              className={styles.nextArrow}
              style={arrowStyle}
              onClick={this.handleClickNextArrow}
            >
              {nextArrow}
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}
