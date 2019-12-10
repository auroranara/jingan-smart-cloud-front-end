import React, { Component } from 'react';
import { Input, InputNumber } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

const { TextArea, Search } = Input;

// span和Input互相转换
export default class InputOrSpan extends Component {
  render() {
    const {
      className,
      type,
      value,
      ...restProps
    } = this.props;

    if (type !== 'span') {
      const Item = ({ InputNumber, TextArea, Search })[type] || Input;
      return <Item className={className} value={value} {...restProps} />
    } else {
      return <div className={classNames(styles.span, className)} {...restProps}>{value}</div>
    }
  }
}
