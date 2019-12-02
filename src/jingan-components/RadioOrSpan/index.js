import React, { Component } from 'react';
import { Radio } from 'antd';

// radio和span互相转换
export default class RadioOrSpan extends Component {
  render() {
    const {
      type,
      value,
      list,
      ...restProps
    } = this.props;

    return type !== 'span' ? (
      <Radio.Group {...restProps} value={value}>
        {(list || []).map(item => <Radio key={item.key} value={item.key} data={item}>{item.value}</Radio>)}
      </Radio.Group>
    ) : (
      <span {...restProps}>{((list || []).filter(({ key }) => key === value)[0] || {}).value}</span>
    );
  }
}
