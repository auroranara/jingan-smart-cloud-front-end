import React, { Component } from 'react';
import { Input, InputNumber } from 'antd';

const { TextArea, Search } = Input;

// span和Input互相转换
export default class InputOrSpan extends Component {
  render() {
    const {
      type,
      value,
      ...restProps
    } = this.props;

    if (type !== 'span') {
      const Item = ({ InputNumber, TextArea, Search })[type] || Input;
      return <Item {...restProps} value={value} />
    } else {
      return <span {...restProps}>{value}</span>
    }
  }
}
