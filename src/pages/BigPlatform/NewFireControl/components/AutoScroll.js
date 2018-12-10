import React, { PureComponent } from 'react';

export default class AutoScroll extends PureComponent {
  state = { scrollTop: 0 };

  handleMouseenter() {

  }

  render() {
    const { containerHeight, cardHeight, cardLength, step, style={}, children=null } = this.props;
    const newStyle = { ...style, overflow: 'auto' };
    const innerHeight = cardHeight * cardLength;
    const moreHeight = containerHeight - innerHeight % containerHeight;
    const moreCardNum = Math.ceil(moreHeight / cardHeight)
    const newChildren = [...children, ...children.slice(0, moreCardNum + 1)];
    return (
      <div style={newStyle}>
        {newChildren}
      </div>
    );
  }
}
