import React, { Component } from 'react';
import { AutoComplete, Spin } from 'antd';
import { connect } from 'dva';
import debounce from 'lodash/debounce';

const { Option } = AutoComplete;

@connect(({ common, loading }) => ({
  common,
  loading: loading.effects['common/fetchCompanyList'],
}))
export default class CompanySelect extends Component {
  constructor(props) {
    super(props);
    this.debouncedHandleSearch = debounce(this.handleSearch, 300);
  }

  componentDidMount() {
    this.getCompanyList();
  }

  getCompanyList = (name) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/fetchCompanyList',
      payload: {
        pageNum: 1,
        pageSize: 10,
        name: name && name.trim(),
      },
    });
  }

  clearCompanyList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/save',
      payload: {
        companyList: {},
      },
    });
  }

  handleSearch = (value) => {
    this.clearCompanyList();
    this.getCompanyList(value);
  }

  handleBlur = ({ key, label }={}) => {
    if (key && key === label) {
      const { onChange } = this.props;
      onChange && onChange();
    }
  }

  render() {
    const {
      common: {
        companyList: {
          list=[],
        },
      },
      className,
      style,
      loading,
      value,
      onChange,
    } = this.props;

    return (
      <AutoComplete
        className={className}
        style={style}
        mode="combobox"
        labelInValue
        value={value}
        onChange={onChange}
        optionLabelProp="children"
        placeholder="请选择单位名称"
        defaultActiveFirstOption={false}
        filterOption={false}
        onSearch={this.debouncedHandleSearch}
        onBlur={this.handleBlur}
        notFoundContent={loading ? <Spin size="small" /> : '未找到数据'}
      >
        {list.map(({ id, name }) => (
          <Option key={id}>{name}</Option>
        ))}
      </AutoComplete>
    );
  }
}
