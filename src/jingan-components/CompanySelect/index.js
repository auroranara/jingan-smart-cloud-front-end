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

  getCompanyList = name => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/fetchCompanyList',
      payload: {
        pageNum: 1,
        pageSize: 10,
        name: name && name.trim(),
      },
    });
  };

  clearCompanyList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/save',
      payload: {
        companyList: {},
      },
    });
  };

  handleSearch = value => {
    this.clearCompanyList();
    this.getCompanyList(value);
  };

  handleBlur = company => {
    if (company) {
      const { key, label } = company;
      if (key === label) {
        const { onChange } = this.props;
        onChange && onChange();
      }
    }
  };

  render() {
    const {
      common: {
        companyList: { list = [] },
      },
      className,
      style,
      loading,
      value,
      onChange,
      disabled,
      placeholder = '请选择单位名称',
      type,
    } = this.props;

    console.log(value);

    return type !== 'span' ? (
      <AutoComplete
        className={className}
        style={style}
        mode="combobox"
        labelInValue
        value={value}
        onChange={onChange}
        optionLabelProp="children"
        placeholder={placeholder}
        defaultActiveFirstOption={false}
        filterOption={false}
        onSearch={this.debouncedHandleSearch}
        onBlur={this.handleBlur}
        notFoundContent={loading ? <Spin size="small" /> : '未找到数据'}
        disabled={disabled}
      >
        {list.map(({ id, name }) => (
          <Option key={id}>{name}</Option>
        ))}
      </AutoComplete>
    ) : (
      <span>{value && value.label}</span>
    );
  }
}
