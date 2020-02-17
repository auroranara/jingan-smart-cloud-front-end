import React, { Component } from 'react';
import { Select } from 'antd';

const { Option } = Select;
const FIELDNAMES = {
  key: 'key',
  value: 'value',
};

// span和select互相转换
export default class SelectOrSpan extends Component {
  render() {
    const { className, style, type, value, list, selectRef, fieldNames, ...restProps } = this.props;
    const { key: k, value: v } = { ...FIELDNAMES, ...fieldNames };

    return type !== 'span' ? (
      <Select {...restProps} className={className} style={style} value={value} ref={selectRef}>
        {(list || []).map(item => (
          <Option key={item[k]} data={item}>
            {item[v]}
          </Option>
        ))}
      </Select>
    ) : (
      <span className={className} style={style}>
        {((list || []).find(item => item[k] === value) || {})[v]}
      </span>
    );
  }
}
