import React, { useEffect, useState } from 'react';
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

const FormSelect = ({
  className,
  value,
  originalMode,
  mode,
  fieldNames,
  list,
  loading = false,
  placeholder = '请选择',
  showArrow = true,
  showSearch = false,
  labelInValue = false,
  optionFilterProp = 'children',
  filterOption = true,
  empty = <EmptyText />,
  ellipsis = true,
  getList,
  onSearch,
  onChange,
  notFoundContent,
  initializeParams,
  searchParams,
  separator = ',',
  data: initialData,
  ...rest
}) => {
  const [data, setData] = useState(initialData);
  const { key: k, value: v } = { ...FIELDNAMES, ...fieldNames };
  const async = showSearch && !filterOption;
  const multiple = originalMode === 'multiple' || originalMode === 'tags';
  useEffect(() => {
    if (!labelInValue && value && (!multiple || value.length) && !data) {
      const callback = (success, list) => {
        if (success) {
          const data = (multiple ? value : [value]).map(key => {
            const item = list.find(item => item[k] === key);
            return item
              ? {
                  key,
                  value: key,
                  label: item[v],
                }
              : {
                  key,
                  value: key,
                  label: key,
                };
          });
          setData(multiple ? data : data[0]);
        }
      };
      getList
        ? getList(
            async &&
              (typeof initializeParams === 'function'
                ? initializeParams(value)
                : {
                    [initializeParams || `${k}s`]: multiple ? value.join(',') : value,
                  }),
            callback
          )
        : callback(true, list || []);
      // 这里是否需要再调用一次是个问题
      async && getList && getList();
    } else {
      getList && getList();
    }
  }, []);
  if (mode !== 'detail') {
    // 根据输入值进行后台筛选
    const handleSearch = debounce(searchValue => {
      const value = searchValue && searchValue.trim();
      getList &&
        getList(
          typeof searchParams === 'function'
            ? searchParams(value)
            : {
                [searchParams || v]: value,
              }
        );
      onSearch && onSearch(value);
    }, 300);
    // 当labelInValue为false时，对选中的源数据进行保存，并对value进行处理（需要区分模式是多选还是单选）
    const handleChange = (value, option) => {
      setData(value);
      onChange && onChange(value && (multiple ? value.map(({ key }) => key) : value.key), option);
    };
    return (
      <Select
        className={classNames(styles.container, className)}
        placeholder={placeholder}
        value={!labelInValue ? data : value}
        showArrow={showArrow}
        showSearch={showSearch}
        labelInValue
        notFoundContent={loading ? <Spin size="small" /> : notFoundContent}
        optionFilterProp={optionFilterProp}
        filterOption={filterOption}
        onSearch={async ? handleSearch : onSearch}
        onChange={!labelInValue ? handleChange : onChange}
        mode={originalMode}
        {...rest}
      >
        {(!loading && list ? list : []).map(item => (
          <Option key={item[k]} value={item[k]} title={item[v]} data={item}>
            {item[v]}
          </Option>
        ))}
      </Select>
    );
  } else {
    const values = labelInValue ? value : data;
    const label =
      values && (multiple ? values.map(({ label }) => label).join(separator) : values.label);
    return label ? (
      ellipsis ? (
        <Ellipsis lines={1} tooltip {...ellipsis}>
          {label}
        </Ellipsis>
      ) : (
        <span>{label}</span>
      )
    ) : (
      empty
    );
  }
};

FormSelect.getRules = ({ label, labelInValue, originalMode }) => {
  const multiple = originalMode === 'multiple' || originalMode === 'tags';
  return [
    {
      type: multiple ? 'array' : labelInValue ? 'object' : 'string',
      min: multiple ? 1 : undefined,
      required: true,
      message: `${label || ''}不能为空`,
    },
  ];
};

export default connect(
  (state, { mapper, list, loading }) => {
    const { namespace, list: l, getList: gl } = mapper || {};
    return {
      list: namespace && l ? state[namespace][l] : list,
      loading: namespace && gl ? state.loading.effects[`${namespace}/${gl}`] : loading,
    };
  },
  (dispatch, { mapper, params, getList, callback }) => {
    const { namespace, getList: gl } = mapper || {};
    return {
      getList:
        namespace && gl
          ? (payload, cb) => {
              dispatch({
                type: `${namespace}/${gl}`,
                payload: {
                  pageNum: 1,
                  pageSize: 10,
                  ...params,
                  ...payload,
                },
                callback(...args) {
                  cb && cb(...args);
                  callback && callback(...args);
                },
              });
            }
          : getList,
    };
  },
  (
    stateProps,
    dispatchProps,
    { mapper, params, list, loading, getList, callback, ...ownProps }
  ) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
  }),
  {
    areStatesEqual: () => false,
    areOwnPropsEqual: () => false,
    areStatePropsEqual: () => false,
    areMergedPropsEqual: (props, nextProps) => {
      return (
        props.value === nextProps.value &&
        props.list === nextProps.list &&
        props.loading === nextProps.loading &&
        props.mode === nextProps.mode
      );
    },
  }
)(FormSelect);
