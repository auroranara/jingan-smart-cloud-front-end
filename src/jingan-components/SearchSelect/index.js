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
    setList && setList({});
    getList && getList(value);
  }

  handleBlur = (value) => {
    const { fieldNames, list, onChange } = this.props;
    const { key } = { ...FIELDNAMES, ...fieldNames };
    if (list.filter(({ [key]: k }) => k === value).length === 0) {
      onChange && onChange();
    }
  }

  render() {
    const {
      list,
      loading,
      fieldNames,
      getList,
      setList,
      notFoundContent='未找到数据',
      ...restProps
    } = this.props;
    const { key, value } = { ...FIELDNAMES, ...fieldNames };
    // console.log({ key, value });

    return (
      <AutoComplete
        placeholder="请选择"
        defaultActiveFirstOption={false}
        filterOption={false}
        onSearch={this.debouncedHandleSearch}
        onBlur={this.handleBlur}
        notFoundContent={loading ? <Spin size="small" /> : notFoundContent}
        {...restProps}
      >
        {list && list.map(({ [key]: k, [value]: v }) => (
          <Option key={k}>{v}</Option>
        ))}
      </AutoComplete>
    );
  }
}
