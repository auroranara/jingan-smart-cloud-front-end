import React, { Component } from 'react';
import { AutoComplete, Spin } from 'antd';
import debounce from 'lodash/debounce';

const { Option } = AutoComplete;
const FIELDNAMES = {
  key: 'key',
  value: 'value',
};

export default class SearchSelect extends Component {
  constructor(props) {
    super(props);
    this.debouncedHandleSearch = debounce(this.handleSearch, 300);
  }

  componentDidMount() {
    const { getList } = this.props;
    getList && getList();
  }

  handleSearch = (value) => {
    const { setList, getList } = this.props;
    setList({});
    getList(value);
  }

  handleBlur = ({ key, label }={}) => {
    if (key && key === label) {
      const { onChange } = this.props;
      onChange && onChange();
    }
  }

  render() {
    const {
      list=[],
      loading,
      fieldNames,
      getList,
      setList,
      ...restProps
    } = this.props;
    const { key, value } = {  ...FIELDNAMES, ...fieldNames };

    return (
      <AutoComplete
        mode="combobox"
        labelInValue
        optionLabelProp="children"
        placeholder="请选择"
        defaultActiveFirstOption={false}
        filterOption={false}
        onSearch={this.debouncedHandleSearch}
        onBlur={this.handleBlur}
        notFoundContent={loading ? <Spin size="small" /> : '未找到数据'}
        {...restProps}
      >
        {list.map(({ [key]: k, [value]: v }) => (
          <Option key={k}>{v}</Option>
        ))}
      </AutoComplete>
    );
  }
}
