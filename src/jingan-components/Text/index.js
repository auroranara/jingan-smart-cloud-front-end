import React, { Component } from 'react';

export default class Text extends Component {
  render() {
    const { transform, value, ...restProps } = this.props;

    return <span {...restProps}>{transform ? transform(value) : value}</span>;
  }
}
