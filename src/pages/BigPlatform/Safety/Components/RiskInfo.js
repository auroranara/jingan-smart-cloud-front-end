import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';
import Ellipsis from '../../../../components/Ellipsis';

/* 图片地址前缀 */
const iconPrefix = 'http://data.jingan-china.cn/v2/big-platform/safety/com/';
/* 图片 */
const infoBg = `${iconPrefix}info_border.png`;
// 字段名
const defaultFieldNames = {
  icon: 'icon',
  title: 'title',
  render: 'render',
  content: 'content',
};
// 容器宽度
const defaultWidth = 322;
// 容器高度
const defaultHeight = 216;

export default class App extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    fieldNames: PropTypes.object,
    position: PropTypes.object,
    offset: PropTypes.object,
    style: PropTypes.object,
    image: PropTypes.object,
  }

  static defaultProps = {
    fieldNames: {},
    position: {
      x: 0,
      y: 0,
    },
    offset: {
      x: 0,
      y: 0,
    },
    style: {},
    image: {
      skew: 0,
      rotate: 0,
    },
  }

  handleClick = (e) => {
    const { onClick } = this.props;
    if (onClick) {
      onClick(e);
    }
  }

  render() {
    const {
      className,
      style,
      data,
      position,
      offset,
      fieldNames,
      background,
      image,
    } = this.props;
    const { icon, title, render, content } = { ...defaultFieldNames, ...fieldNames };
    const { x: positionX, y: positionY } = position;
    let { x: offsetX, y: offsetY } = offset;
    offsetX = Number.parseInt(offsetX, 10);
    offsetY = Number.parseInt(offsetY, 10);
    const { skew, rotate } = image;
    const deg = Math.PI * rotate / 180;
    // 放大倍数
    // const scale = 1 + Math.sin(deg) * (1 - positionY);
    const bottom = Math.cos(deg) * (skew * (1 - positionY)) - /* scale *  */(offsetY + defaultHeight) ;
    const z = -Math.sin(deg) * (skew * (1 - positionY));

    return positionX && positionY ? (
      <div
        className={className}
        style={{
          position: 'absolute',
          left: positionX < 0.5 ? `calc(${positionX * 100}% + ${/* scale *  */offsetX}px)` : `calc(${positionX * 100}% - ${/* scale *  */(defaultWidth + offsetX)}px)`,
          bottom: `${bottom}px`,
          width: `${defaultWidth}px`,
          height: `${defaultHeight}px`,
          border: '30px solid transparent',
          borderWidth: '6px 10px',
          borderImageSource: `url(${infoBg})`,
          borderImageSlice: '12 21',
          transition: 'opacity 0.5s',
          transformOrigin: 'left bottom',
          transform: `translateZ(${z}px)`,
          whiteSpace: 'no-wrap',
          zIndex: 9,
          ...style,
        }}
        onClick={this.handleClick}
      >
        <div style={{ display: 'flex', width: '100%', height: '100%', background: `url(${background}) no-repeat center / 100% 100%` }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: '10px 20px', background: 'rgba(8, 60, 120, 0.8)', textShadow: '2px 2px 2px #333' }}>
            {data.map(item => {
              return (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'nowrap' }} key={item[icon]}>
                  <Avatar src={item[icon]} size="small" style={{ flex: 'none', marginRight: '10px' }} title={item[title]} />
                  <Ellipsis lines={1} style={{ flex: 1, lineHeight: '24px', fontSize: "18px", color: '#fff' }}>{item[render] ? item[render](item[content]) : item[content]}</Ellipsis>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ) : null;
  };
}
