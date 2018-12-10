import React, { PureComponent } from 'react';

// import styles from './FcModule.less';

export default class FcModule extends PureComponent {
  render() {
    let newChildren = null;

    const { children = null, isRotated = false, style = {}, ...restProps } = this.props;
    const newStyle = {
      // overflow: 'hidden',
      transition: '1s transform ease',
      transformStyle: 'preserve-3d',
      transform: isRotated ? 'rotateY(180deg)': 'rotateY(0deg)',
      // background: 'rgba(9,103,211,0.1)',
      ...style,
    };

    if (children)
      newChildren = [children[1], children[0]];

    return (
      <div style={newStyle} {...restProps}>
         {newChildren}
      </div>
    );
  }
}
