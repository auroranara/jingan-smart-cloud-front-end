import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class App extends PureComponent {
  static propTypes = {
    position: PropTypes.object.isRequired,
    style: PropTypes.object,
    image: PropTypes.object,
  }

  static defaultProps = {
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
      key,
      position,
      children,
      image,
    } = this.props;

    const { x: positionX, y: positionY } = position;
    const { skew, rotate } = image;
    const deg = Math.PI * rotate / 180;
    const z = -Math.sin(deg) * (skew * (1 - positionY));

    return positionX && positionY ? (
      <div
        className={className}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `translateZ(${z}px)`,
          zIndex: 2,
          ...style,
        }}
        key={key}
      >
        {children}
      </div>
    ) : null;
  }
}
