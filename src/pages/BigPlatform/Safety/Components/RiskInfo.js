import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';

/* 图片地址前缀 */
const iconPrefix = 'http://data.jingan-china.cn/v2/big-platform/safety/com/';
/* 图片 */
const borderImage = `${iconPrefix}border.png`

// 字段名
const defaultFieldNames = {
  icon: 'icon',
  title: 'title',
  render: 'render',
};

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

    const { icon, title, render } = { ...defaultFieldNames, ...fieldNames };
    const { x: positionX, y: positionY } = position;
    let { x: offsetX, y: offsetY } = offset;
    offsetX = Number.parseInt(offsetX, 10);
    offsetY = Number.parseInt(offsetY, 10);
    const scale = 2 - positionY;
    const { skew, rotate } = image;
    const deg = Math.PI * rotate / 180;
    const bottom = Math.cos(deg) * (skew * (1 - positionY)) - scale * offsetY;

    return positionX && positionY ? (
      <div
        className={className}
        style={{
          position: 'absolute',
          left: positionX < 0.5 ? `calc(${positionX * 100}% + ${scale * offsetX}px)` : `calc(${positionX * 100}% - ${scale * (240 + offsetX)}px)`,
          bottom: `${bottom}px`,
          width: '240px',
          padding: '20px',
          background: `url(${borderImage}) no-repeat center / 100% 100%`,
          transition: 'opacity 0.5s',
          transformOrigin: 'left bottom',
          transform: `scale(${scale})`,
          whiteSpace: 'no-wrap',
          zIndex: 9,
          ...style,
        }}
      >
        <div style={{ background: `url(${background}) no-repeat center / 100% 100%` }}>
          <div style={{ padding: '10px', background: 'rgba(6, 38, 78, 0.55)' }}>
            {data.map(item => {
              return (
                <div style={{ display: 'flex', flexWrap: 'nowrap', fontSize: 0 }} key={item[icon]}>
                  <Avatar src={item[icon]} size="small" style={{ verticalAlign: 'top' }} />
                  <div style={{ flex: 1, display: 'inline-block', marginLeft: '8px', verticalAlign: 'top', lineHeight: '24px', fontSize: "14px", color: '#fff' }}>{item[render] ? item[render](item[title]) : item[title]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ) : null;
  };
}
