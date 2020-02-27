import React, { Component } from 'react';
import { Input, InputNumber } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

const { TextArea, Search, Password } = Input;

// span和Input互相转换
export default class InputOrSpan extends Component {
  render() {
    const { className, style, type, value, ...restProps } = this.props;

    if (type !== 'span') {
      const Item = { InputNumber, TextArea, Search, Password }[type] || Input;
      return <Item className={className} style={style} value={value} {...restProps} />;
    } else {
      return (
        <span className={classNames(styles.span, className)} style={style}>
          {value}
        </span>
      );
    }
  }
}
