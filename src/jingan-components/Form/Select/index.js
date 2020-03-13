import React, { Component } from 'react';
import { Select, Spin } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import EmptyText from '@/jingan-components/View/EmptyText';
import { connect } from 'dva';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import styles from './index.less';
const { Option } = Select;

const FIELDNAMES = {
  key: 'key',
  value: 'value',
};

@connect(
  (state, { mapper }) => {
    const { namespace, list, getList } = mapper || {};
    return {
      list: namespace && list ? state[namespace][list] : [],
      loading: namespace && getList ? state.loading.effects[`${namespace}/${getList}`] : false,
    };
  },
  null,
  (stateProps, { dispatch }, { mapper, params, async, ...ownProps }) => {
    const { namespace, getList } = mapper || {};
    return {
      ...stateProps,
      ...ownProps,
      async,
      getList:
        namespace && getList
          ? (payload, callback) => {
              dispatch({
                type: `${namespace}/${getList}`,
                payload: {
                  ...(async && {
                    pageNum: 1,
                    pageSize: 10,
                  }),
                  ...params,
                  ...payload,
                },
                callback,
              });
            }
          : undefined,
    };
  }
)
export default class FormSelect extends Component {
  constructor(props) {
    super(props);
    this.debouncedHandleSearch = debounce(this.handleSearch, 300);
  }

  componentDidMount() {
    const { getList } = this.props;
    getList && getList();
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.value !== this.props.value ||
      nextProps.list !== this.props.list ||
      nextProps.loading !== this.props.loading ||
      nextProps.mode !== this.props.mode
    );
  }

  handleSearch = value => {
    const { async, fieldNames, getList } = this.props;
    const { value: v, [v]: name = v } = { ...FIELDNAMES, ...fieldNames };
    async &&
      getList &&
      getList({
        [name]: value && value.trim(),
      });
  };

  render() {
    const {
      className,
      value,
      originalMode,
      mode = 'add',
      fieldNames,
      list = [],
      loading = false,
      placeholder = '请选择',
      showArrow = true,
      showSearch = false,
      labelInValue = false,
      async = false,
      optionFilterProp = 'children',
      filterOption = true,
      emtpy = <EmptyText />,
      ellipsis = true,
      ...restProps
    } = this.props;
    const { key: k, value: v } = { ...FIELDNAMES, ...fieldNames };
    const selectedValue = typeof value === 'number' ? `${value}` : value || undefined;

    if (mode !== 'detail') {
      return (
        <Select
          className={classNames(styles.container, className)}
          placeholder={placeholder}
          value={selectedValue}
          showArrow={showArrow}
          showSearch={async || showSearch}
          labelInValue={async || labelInValue}
          notFoundContent={loading ? <Spin size="small" /> : undefined}
          optionFilterProp={optionFilterProp}
          filterOption={async ? false : filterOption}
          onSearch={this.debouncedHandleSearch}
          mode={originalMode}
          {...restProps}
        >
          {(!loading && list ? list : []).map(item => (
            <Option key={item[k]} value={item[k]} title={item[v]} data={item}>
              {item[v]}
            </Option>
          ))}
        </Select>
      );
    } else {
      const label =
        async || labelInValue
          ? value && value.label
          : list && list.length
            ? (list.find(item => item[k] === value) || {})[v]
            : value;
      return label ? (
        ellipsis ? (
          <Ellipsis lines={1} tooltip {...ellipsis}>
            {label}
          </Ellipsis>
        ) : (
          <span>{label}</span>
        )
      ) : (
        emtpy
      );
    }
  }
}
