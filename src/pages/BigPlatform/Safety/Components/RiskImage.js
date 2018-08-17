import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

/**
 * 判断是否为Number类型
 * @param {Any} value 判断对象
 * @return true是Number类型，false不是Number类型
 */
const isNumber = (value) => {
  return Object.prototype.toString.call(value) === '[object Number]';
};

// 默认高度
const defaultHeight = '600px';

export default class App extends PureComponent {
  static propTypes = {
    src: PropTypes.string.isRequired,
    wrapperStyle: PropTypes.object,
    style: PropTypes.object,
    perspective: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    rotate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }

  static defaultProps = {
    wrapperStyle: {},
    style: {},
    perspective: '30em',
    rotate: '45deg',
  }

  constructor(props) {
    super(props);
    this.state = {
      skew: 0,
    }
    this.myTimer = null;
    this.handleResize = debounce(this.handleResize, 300);
  }

  componentDidMount() {
    // 初始化
    this.handleResize();
    // 添加resize事件
    window.addEventListener('resize', this.handleResize, false);
  }

  componentWillUnmount() {
    // 销毁时移出事件
    window.removeEventListener('resize', this.handleResize);
    clearInterval(this.myTimer);
  }

  // resize重新获取容器高度
  handleResize = () => {
    this.myTimer = setInterval(() => {
      if (this.wrapper && this.wrapper.offsetHeight !== 0) {
        clearInterval(this.myTimer);
        this.myTimer = null;
        this.setState({
          skew: this.wrapper.offsetHeight,
        });
      }
    }, 2);
  }

  renderChildren(children, image) {
    if (children) {
      return React.Children.map(children, child => {
          if (child) {
              if (child.type) {
                  return React.cloneElement(child, {
                    image,
                  }, this.renderChildren(child.props.children, image));
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
      perspective, // 景深
      rotate, // 旋转角度
      children,
    } = this.props;
    const { skew } = this.state;

    const isSrcValid = /^http/.test(src);

    return isSrcValid ? (
      <div
        className={wrapperClassName}
        style={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `perspective(${isNumber(perspective) ? `${perspective}px` : perspective})`,
          height: defaultHeight,
          ...wrapperStyle,
        }}
        ref={wrapper => { this.wrapper = wrapper; }}
      >
        <div
          className={className}
          style={{
            height: '100%',
            transformOrigin: 'center bottom',
            transform: `rotateX(${isNumber(rotate) ? `${rotate}deg` : rotate})`,
            ...style,
          }}
        >
          <img
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
            }}
            src={src}
            alt="安全风险四色图"
          />
        </div>
        {this.renderChildren(children, { skew, rotate: Number.parseFloat(rotate) })}
      </div>
    ) : (
      <div className={wrapperClassName} style={{ textAlign: 'center', ...wrapperStyle }}>暂未上传安全四色图</div>
    );
  }
}
