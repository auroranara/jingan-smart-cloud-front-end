import React, { Component } from 'react';
import { Select } from 'antd';

const { Option } = Select;

// span和select互相转换
export default class SelectOrSpan extends Component {
  render() {
    const {
      type,
      value,
      list,
      ...restProps
    } = this.props;

    return type !== 'span' ? (
      <Select {...restProps} value={value}>
        {(list || []).map(item => <Option key={item.key} data={item}>{item.value}</Option>)}
      </Select>
    ) : (
      <span {...restProps}>{((list || []).filter(({ key }) => key === value)[0] || {}).value}</span>
    );
  }
}
