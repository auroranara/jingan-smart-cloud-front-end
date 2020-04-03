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
  emtpy = <EmptyText />,
  ellipsis = true,
  getList,
  onSearch,
  onChange,
  notFoundContent,
  initializeParams,
  searchParams,
  ...rest
}) => {
  const [data, setData] = useState(undefined);
  const async = showSearch && !filterOption;
  const { key: k, value: v } = { ...FIELDNAMES, ...fieldNames };
  useEffect(() => {
    if (
      !async ||
      labelInValue ||
      !value ||
      ((originalMode === 'multiple' || originalMode === 'tags') && !value.length)
    ) {
      getList && getList();
    }
  }, []);
  useEffect(
    () => {
      // 当开启后台筛选且labelInValue为false时，根据value进行初始化（需要区分模式是多选还是单选）
      if (async && !labelInValue && value) {
        if (originalMode === 'multiple' || originalMode === 'tags') {
          if (
            value.length &&
            (!data || !data.length || value.some(vk => !data.find(({ key }) => key === vk)))
          ) {
            getList
              ? getList(
                  typeof initializeParams === 'function'
                    ? initializeParams(value)
                    : {
                        [initializeParams || k]: value.join(','),
                      },
                  (success, list) => {
                    if (success) {
                      setData(
                        value.map(vk => {
                          const item = list.find(item => item[k] === vk);
                          return item
                            ? {
                                key: item[k],
                                value: item[k],
                                label: item[v],
                              }
                            : {
                                key: vk,
                                value: vk,
                                label: vk,
                              };
                        })
                      );
                    }
                  }
                )
              : setData(
                  value.map(vk => ({
                    key: vk,
                    value: vk,
                    label: vk,
                  }))
                );
            getList && getList();
          }
        } else if (!data || data.key !== value) {
          getList
            ? getList(
                typeof initializeParams === 'function'
                  ? initializeParams(value)
                  : {
                      [initializeParams || k]: value.join(','),
                    },
                (success, list) => {
                  if (success) {
                    const item = list.find(item => item[k] === value);
                    setData(
                      item
                        ? {
                            key: item[k],
                            value: item[k],
                            label: item[v],
                          }
                        : {
                            key: value,
                            value,
                            label: value,
                          }
                    );
                  }
                }
              )
            : setData({
                key: value,
                value,
                label: value,
              });
          getList && getList();
        }
      }
    },
    [value]
  );
  if (mode !== 'detail') {
    const debouncedGetList = getList && debounce(getList, 300);
    // 根据输入值进行后台筛选
    const handleSearch = searchValue => {
      const value = searchValue && searchValue.trim();
      debouncedGetList &&
        debouncedGetList(
          typeof searchParams === 'function'
            ? searchParams(value)
            : {
                [searchParams || v]: value,
              }
        );
      onSearch && onSearch(value);
    };
    // 当开启后台筛选且labelInValue为false时，对选中的源数据进行保存，并对value进行处理（需要区分模式是多选还是单选）
    const handleChange = (nextValue, option) => {
      if (originalMode === 'multiple' || originalMode === 'tags') {
        if (nextValue && nextValue.length) {
          if (nextValue.length > (value || []).length) {
            const vk = nextValue[nextValue.length - 1].key;
            const item = option[option.length - 1].data || { [k]: vk, [v]: vk };
            setData((data = []) => data.concat({ key: item[k], value: item[k], label: item[v] }));
            onChange && onChange(nextValue.map(({ key }) => key), option);
          } else {
            const values = nextValue.map(({ key }) => key);
            setData((data = []) => data.filter(({ key }) => values.includes(key)));
            onChange && onChange(values, option);
          }
        } else {
          setData(undefined);
          onChange && onChange(undefined, option);
        }
      } else {
        if (nextValue) {
          const item = option.data;
          setData({ key: item[k], value: item[k], label: item[v] });
          onChange && onChange(nextValue.key, option);
        } else {
          setData(undefined);
          onChange && onChange(undefined, option);
        }
      }
    };
    return (
      <Select
        className={classNames(styles.container, className)}
        placeholder={placeholder}
        value={async && !labelInValue ? data : value}
        showArrow={showArrow}
        showSearch={showSearch}
        labelInValue={async || labelInValue}
        notFoundContent={loading ? <Spin size="small" /> : notFoundContent}
        optionFilterProp={optionFilterProp}
        filterOption={filterOption}
        onSearch={async ? handleSearch : onSearch}
        onChange={async && !labelInValue ? handleChange : onChange}
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
    let label;
    if (labelInValue) {
      if (originalMode === 'multiple' || originalMode === 'tags') {
        label = value && value.map(({ label }) => label).join(',');
      } else {
        label = value && value.label;
      }
    } else {
      if (originalMode === 'multiple' || originalMode === 'tags') {
        label = data && data.map(({ label }) => label).join(',');
      } else {
        label = ((list || []).find(item => item[k] === value) || {})[v] || value;
      }
    }
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
