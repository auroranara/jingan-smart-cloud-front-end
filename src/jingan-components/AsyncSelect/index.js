import React, { Component } from 'react';
import { AutoComplete, Spin, Select } from 'antd';
import { connect } from 'dva';
import debounce from 'lodash/debounce';

const { Option } = AutoComplete;
const FIELDNAMES = {
  key: 'key',
  value: 'value',
};

@connect(
  (state, { mapper }) => {
    const { namespace: n, list: l, getList: gl } = mapper;
    const {
      [n]: { [l || 'list']: list },
      loading: {
        effects: { [`${n}/${gl || 'getList'}`]: loading },
      },
    } = state;
    return {
      list,
      loading,
    };
  },
  (dispatch, { mapper }) => {
    const { namespace: n, list: l, getList: gl, save: s } = mapper;
    return {
      getList(payload, callback) {
        dispatch({
          type: `${n}/${gl || 'getList'}`,
          payload: {
            pageNum: 1,
            pageSize: 10,
            ...payload,
          },
          callback,
        });
      },
      setList() {
        dispatch({
          type: `${n}/${s || 'save'}`,
          payload: {
            [l || 'list']: {},
          },
        });
      },
    };
  }
)
export default class AsyncSelect extends Component {
  constructor(props) {
    super(props);
    this.debouncedHandleSearch = debounce(this.handleSearch, 300);
  }

  componentDidMount() {
    const { getList, params } = this.props;
    getList(params);
  }

  handleChange = value => {
    const {
      list: { list },
      onChange,
      onSelect,
      fieldNames,
    } = this.props;
    const { key: k } = { ...FIELDNAMES, ...fieldNames };
    const { key, label } = value || {};
    onChange && onChange(value);
    if (key !== label) {
      onSelect && onSelect(list.find(item => item[k] === key));
    }
  };

  handleSearch = value => {
    const { getList, setList, fieldNames, params } = this.props;
    const { value: v, [v]: name = v } = { ...FIELDNAMES, ...fieldNames };
    setList();
    getList({
      [name]: value && value.trim(),
      ...params,
    });
  };

  // handleBlur = value => {
  //   if (value) {
  //     const { key, label } = value;
  //     if (key === label) {
  //       const { onChange, getList, params } = this.props;
  //       onChange && onChange();
  //       getList(params);
  //     }
  //   }
  // };

  render() {
    const {
      list: { list = [] } = {},
      className,
      style,
      loading,
      value,
      disabled,
      placeholder = '请选择',
      type,
      fieldNames,
    } = this.props;
    const { key: k, value: v } = { ...FIELDNAMES, ...fieldNames };

    return type !== 'span' ? (
      // <AutoComplete
      //   className={className}
      //   style={style}
      //   mode="combobox"
      //   labelInValue
      //   value={value}
      //   onChange={this.handleChange}
      //   optionLabelProp="children"
      //   placeholder={placeholder}
      //   defaultActiveFirstOption={false}
      //   filterOption={false}
      //   onSearch={this.debouncedHandleSearch}
      //   onBlur={this.handleBlur}
      //   notFoundContent={loading ? <Spin size="small" /> : '未找到数据'}
      //   disabled={disabled}
      // >
      //   {list.map(({ [k]: key, [v]: value }) => (
      //     <Option key={key}>{value}</Option>
      //   ))}
      // </AutoComplete>
    <Select
      allowClear
      labelInValue
      showSearch
      showArrow={false}
      value={value}
      style={style}
      className={className}
      onChange={this.handleChange}
      // optionLabelProp="children"
      placeholder={placeholder}
      defaultActiveFirstOption={false}
      // filterOption={false}
      onSearch={this.debouncedHandleSearch}
      onBlur={this.handleBlur}
      notFoundContent={loading ? <Spin size="small" /> : '未找到数据'}
      disabled={disabled}
    >
      {list.map(({ [k]: key, [v]: value }) => (
        <Option key={key}>{value}</Option>
      ))}
    </Select>
    ) : (
      <span>{value && value.label}</span>
    );
  }
}
