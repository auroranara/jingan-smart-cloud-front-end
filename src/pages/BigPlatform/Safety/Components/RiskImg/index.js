import React, { PureComponent, Fragment } from 'react';
import debounce from 'lodash/debounce';

// 默认风险四色图
const defaultFourColorImg = 'http://data.jingan-china.cn/v2/big-platform/safety/com/defaultFourColorImg1.png';

/**
 * description: 安全风险四色图
 * author: sunkai
 * date: 2018年11月30日
 */
export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 斜边长度（容器高度）
      skew: 0,
    }
    // 去抖后的resize事件
    this.debouncedHandleResize = debounce(this.getSkew, 300);
  }

  componentDidMount() {
    // 立即获取容器高度
    this.getSkew();
    // 添加resize事件
    window.addEventListener('resize', this.debouncedHandleResize, false);
  }

  componentWillUnmount() {
    // 移除未执行的resize事件
    this.debouncedHandleResize.cancel();
    // 移除resize事件
    window.removeEventListener('resize', this.debouncedHandleResize);
  }

  /**
   * 获取容器高度（当容器存在并且高度不为0时有效）
   */
  getSkew = () => {
    if (this.wrapper && this.wrapper.offsetHeight !== 0) {
      this.setState({ skew: this.wrapper.offsetHeight });
    }
  }

  /**
   * 重置children，将额外的参数包括斜边长度和旋转角度传入（这里未做数组检测，默认children为数组）
   * @param {*} children
   * @param {*} image
   */
  renderChildren(children, image) {
    if (children) {
      return React.Children.map(children, child => {
        if (child) {
            if (child.type) {
                return React.cloneElement(child, {
                  image,
                }, child.type === Fragment ? this.renderChildren(child.props.children, image) : child.props.children);
            }
            else {
                return child;
            }
        }
      });
    }
  }

  render() {
    const {
      wrapperClassName, // 容器类名
      wrapperStyle, // 容器样式
      className, // 四色图类名
      style, // 四色图样式
      src, // 四色图地址
      perspective='30em', // 景深
      rotate='45deg', // 旋转角度
      children,
    } = this.props;
    const { skew } = this.state;

    // 四色图地址是否有效
    const isSrcValid = /^http/.test(src);

    return (
      <div
        className={wrapperClassName}
        style={{
          position: 'relative',
          height: '100%',
          transformStyle: 'preserve-3d',
          transform: `perspective(${perspective})`,
          // 地址无效时显示默认四色图
          background: isSrcValid ? undefined : `url(${defaultFourColorImg}) no-repeat center bottom / 100%`,
          ...wrapperStyle,
        }}
        ref={wrapper => { this.wrapper = wrapper; }}
      >
        {/* 地址有效时显示对应四色图和内容 */
        isSrcValid && (
          <Fragment>
            <div
              className={className}
              style={{
                height: '100%',
                transformOrigin: 'center bottom',
                transform: `rotateX(${rotate})`,
                background: `url(${src}) no-repeat center center / 100% 100%`,
                ...style,
              }}
            />
            {this.renderChildren(children, { skew, rotate: Number.parseFloat(rotate) })}
          </Fragment>
        )}
      </div>
    );
  }
}
