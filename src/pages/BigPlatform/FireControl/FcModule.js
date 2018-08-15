import React, { PureComponent } from 'react';

// import styles from './FcModule.less';

export default class FcModule extends PureComponent {
  state = { rotate: false };

  // componentDidMount() {
  //   setInterval(() => {
  //     this.setState(({ rotate }) => ({ rotate: !rotate }));
  //   }, 5000);
  // }

  render() {
    let newChildren = null;

    const { children = null, style = {}, ...restProps } = this.props;
    const newStyle = {
      // overflow: 'hidden',
      transition: '2s transform ease',
      transformStyle: 'preserve-3d',
      transform: this.state.rotate ? 'rotateY(180deg)': 'rotateY(0)',
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
