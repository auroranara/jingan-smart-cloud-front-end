import React, { Component } from 'react';
import { AutoComplete, Spin } from 'antd';
import { connect } from 'dva';
import debounce from 'lodash/debounce';

const { Option } = AutoComplete;

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
    const { getList } = this.props;
    console.log(this.props);
    getList();
  }

  handleSearch = value => {
    const { getList, setList, mapper } = this.props;
    const { name } = mapper;
    setList();
    getList({
      [name || 'name']: value && value.trim(),
    });
  };

  handleBlur = value => {
    if (value) {
      const { key, label } = value;
      if (key === label) {
        const { onChange } = this.props;
        onChange && onChange();
      }
    }
  };

  render() {
    const {
      list: { list = [] } = {},
      className,
      style,
      loading,
      value,
      onChange,
      disabled,
      placeholder = '请选择',
      type,
      mapper,
    } = this.props;
    const { id, name } = mapper;

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
        {list.map(({ [id || 'id']: key, [name || 'name']: label }) => (
          <Option key={key}>{label}</Option>
        ))}
      </AutoComplete>
    ) : (
      <span>{value && value.label}</span>
    );
  }
}
