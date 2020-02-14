import React, { Component } from 'react';
import { Switch } from 'antd';

// Switch和span互相转换
export default class SwitchOrSpan extends Component {
  handleChange = checked => {
    const { list, onChange } = this.props;
    onChange && onChange(list[+!checked].key);
  };

  render() {
    const { type, value, list, onChange, ...restProps } = this.props;
    const [{ value: checkedChildren = '开' }, { key, value: unCheckedChildren = '关' }] = list;
    const checked = value !== key; // 默认选中

    return type !== 'span' ? (
      <Switch
        unCheckedChildren={unCheckedChildren}
        checkedChildren={checkedChildren}
        checked={checked}
        onChange={this.handleChange}
        {...restProps}
      />
    ) : (
      <span {...restProps}>{((list || []).filter(({ key }) => key === value)[0] || {}).value}</span>
    );
  }
}
