import React, { Component } from 'react';
import { DatePicker } from 'antd';

// span和DatePicker互相转换
export default class DatePickerOrSpan extends Component {
  render() {
    const {
      type,
      value,
      format='YYYY-MM-DD',
      unknown,
      separator,
      ...restProps
    } = this.props;


    if (type !== 'span') {
      const Item = DatePicker[type] || DatePicker;
      return <Item {...restProps} value={value} format={format} separator={separator} />
    } else {
      return <span {...restProps}>{(Array.isArray(value) ? value : [value]).map(v => v ? v.format(format) : unknown).join(separator)}</span>;
    }
  }
}
