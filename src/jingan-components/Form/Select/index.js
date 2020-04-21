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
const PRESETS = {
  company: {
    fieldNames: {
      key: 'id',
      value: 'name',
    },
    mapper: {
      namespace: 'common',
      list: 'unitList',
      getList: 'getUnitList',
    },
  },
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
    if (
      labelInValue /* labelInValue为true */ ||
      (!value || (multiple && !value.length)) /* value不存在 */ ||
      (data &&
        (multiple
          ? data.length === value.length && value.every((key, index) => data[index].key === key)
          : data.key === value)) /* value和data一一对应 */
    ) {
      getList && getList();
    }
  }, []);
  useEffect(
    () => {
      if (!labelInValue /* labelInValue为false */) {
        if (value && (!multiple || value.length) /* value存在时 */) {
          const callback = (success, list) => {
            const data = (multiple ? value : [value]).map(key => {
              const item = (list || []).find(item => item[k] === key);
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
          };
          if (
            !data ||
            (multiple
              ? data.length !== value.length || value.some((key, index) => data[index].key !== key)
              : data.key !== value) /* data不存在，或者value和data不一一对应时 */
          ) {
            if (
              initialData &&
              (multiple
                ? initialData.length === value.length &&
                  value.every((key, index) => initialData[index].key === key)
                : initialData.key === value) /* value和initialData一一对应时 */
            ) {
              setData(initialData);
              getList && getList();
            } else if (
              list &&
              (multiple ? value : [value]).every(key =>
                list.find(item => item[k] === key)
              ) /* 本地列表中能找到所有选项时 */
            ) {
              callback(true, list);
              getList && getList();
            } else {
              /* 从后台筛选 */
              getList
                ? getList(
                    typeof initializeParams === 'function'
                      ? initializeParams(value)
                      : {
                          [initializeParams || `${k}s`]: multiple ? value.join(',') : value,
                        },
                    callback
                  )
                : callback(true, list);
              getList && getList();
            }
          }
        } else if (data && (!multiple || data.length) /* value不存在但data存在时 */) {
          setData(undefined);
          getList && getList();
        }
      }
    },
    [value]
  );
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
  (state, { mapper, list, loading, preset, fieldNames }) => {
    const { namespace, list: l, getList: gl } = mapper || (PRESETS[preset] || {}).mapper || {};
    return {
      list: namespace && l ? state[namespace][l] : list,
      loading: namespace && gl ? state.loading.effects[`${namespace}/${gl}`] : loading,
      fieldNames: fieldNames || (PRESETS[preset] || {}).fieldNames,
    };
  },
  (dispatch, { mapper, params, getList, callback, preset }) => {
    const { namespace, getList: gl } = mapper || (PRESETS[preset] || {}).mapper || {};
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
    { mapper, params, list, loading, getList, callback, preset, fieldNames, ...ownProps }
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
