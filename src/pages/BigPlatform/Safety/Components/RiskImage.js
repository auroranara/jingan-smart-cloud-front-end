import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// /**
//  * 判断是否为Number类型
//  * @param {Any} value 判断对象
//  * @return true是Number类型，false不是Number类型
//  */
// const isNumber = (value) => {
//   return Object.prototype.toString.call(value) === '[object Number]';
// };

// 默认高度
const defaultHeight = '600px';

export default class App extends PureComponent {
  static propTypes = {
    src: PropTypes.string.isRequired,
    wrapperStyle: PropTypes.object,
    style: PropTypes.object,
  }

  static defaultProps = {
    wrapperStyle: {},
    style: {},
  }

  state = {
    image: null,
  }

  componentDidMount() {
    const { src } = this.props;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      this.setState({
        image: {
          width: img.width,
          height: img.height,
        },
      });
    };
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
      children,
    } = this.props;
    const { image } = this.state;

    return (
      <div
        className={wrapperClassName}
        style={{
          position: 'relative',
          height: defaultHeight,
          ...wrapperStyle,
        }}
      >
        <div
          className={className}
          style={{
            height: '100%',
            ...style,
          }}
        >
          {/^http/.test(src) ? (
            <img
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
              }}
              src={src}
              alt="安全风险四色图"
            />
          ) : (<div style={{ textAlign: 'center' }}>暂无四色图</div>)}
        </div>
        {this.renderChildren(children, image)}
      </div>
    );
  }
}
