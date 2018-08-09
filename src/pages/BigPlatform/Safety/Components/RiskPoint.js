import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const defaultWidth = '21px';
const defaultHeight = '35px';

export default class App extends PureComponent {
  static propTypes = {
    src: PropTypes.string.isRequired,
    position: PropTypes.object,
    offset: PropTypes.object,
    style: PropTypes.object,
  }

  static defaultProps = {
    position: {
      x: 0,
      y: 0,
    },
    offset: {
      x: 0,
      y: 0,
    },
    style: {},
  }

  handleClick = (e) => {
    const { onClick } = this.props;
    if (onClick) {
      onClick(this.point, e);
    }
  }

  render() {
    const {
      className, // 四色图类名
      style, // 四色图样式
      src, // 风险点图片地址
      position, // 风险点位置
      offset, // 偏移
    } = this.props;

    let { x: positionX, y: positionY } = position;
    let { x: offsetX, y: offsetY } = offset;
    offsetX = Number.parseInt(offsetX, 10);
    offsetY = Number.parseInt(offsetY, 10);
    const width = (style && style.width) || defaultWidth;
    return positionX && positionY ? (
      <div
        className={className}
        style={{
          position: 'absolute',
          left: `calc(${positionX * 100}% - ${Math.floor(Number.parseInt(width, 10) / 2) - offsetX}px)`,
          bottom: `calc(${(1 - positionY) * 100}% - ${offsetY}px)`,
          display: 'inline-block',
          transition: 'bottom 0.5s, height 0.5s',
          width: defaultWidth,
          height: defaultHeight,
          ...style,
        }}
        onClick={this.handleClick}
        ref={ele => { this.point = ele; }}
      >
        <img
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
          }}
          src={src}
          alt="风险点"
        />
      </div>
    ) : null;
  }
}
