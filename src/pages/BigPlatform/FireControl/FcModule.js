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
      transform: isRotated ? 'rotateY(180deg)': 'rotateY(0)',
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
