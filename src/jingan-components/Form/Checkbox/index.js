import React, { useEffect, useState, useMemo } from 'react';
import { Spin, Checkbox } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import { EmptyText } from '@/jingan-components/View';
import { connect } from 'dva';
import { isEqual } from 'lodash';
// import styles from './index.less';

const FIELDNAMES = {
  key: 'key',
  value: 'value',
  disabled: 'disabled',
};
const PRESETS = {
  receivingUnitType: {
    list: [
      { key: '1', value: '政府机构' },
      { key: '2', value: '社会单位' },
      { key: '3', value: '安全服务机构' },
    ],
  },
};

const FormCheckbox = ({
  mode,
  value,
  onChange,
  list,
  loading,
  getList,
  fieldNames,
  params,
  initializeParams,
  separator = '，',
  options: disabledOptions, // 禁用options改用list
  empty = <EmptyText />,
  ellipsis = true,
  ...rest
}) => {
  const { key: k, value: v, disabled: d } = { ...FIELDNAMES, ...fieldNames };
  const [prevParams, setPrevParams] = useState(params);
  const isDetail = mode === 'detail';
  const hasValue = !!(value && value.length);
  const getTreeByValue = () => {
    const initialValue = value.join(',');
    getList &&
      getList(
        typeof initializeParams === 'function'
          ? initializeParams(initialValue)
          : {
              [initializeParams || `${k}s`]: initialValue,
            },
        undefined,
        true
      );
  };
  // 当mode不为detail时初始化获取全部数据
  useEffect(() => {
    if (!isDetail) {
      getList && getList();
    }
  }, []);
  // 当mode为detail且value有值时初始化获取value对应的数据
  useEffect(
    () => {
      if (isDetail && hasValue) {
        getTreeByValue();
      }
    },
    [value] // 不依赖mode的话也许会有问题，以后再说
  );
  // 当params发生变化时重新初始化
  useEffect(
    () => {
      if (!isEqual(params, prevParams)) {
        setPrevParams(params);
        if (!isDetail) {
          getList && getList();
          if (hasValue) {
            onChange && onChange();
          }
        } /* else if (hasValue) {
          getTreeByValue();
        } */
      }
    },
    [params]
  );
  if (loading) {
    return <Spin size="small" />;
  }
  if (!isDetail) {
    const options = useMemo(
      () => {
        return (list || []).map(item => ({
          value: item[k],
          label: item[v],
          disabled: item[d],
        }));
      },
      [list]
    );
    return <Checkbox.Group value={value} onChange={onChange} options={options} {...rest} />;
  } else {
    const label = (list || [])
      .filter(item => (value || []).includes(item[k]))
      .map(item => item[v])
      .join(separator);
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

FormCheckbox.getRules = ({ label }) => [
  {
    type: 'array',
    min: '1',
    required: true,
    message: `${label || ''}不能为空`,
  },
];

export default connect(
  state => state,
  null,
  (stateProps, { dispatch }, { list, loading, getList, params, mapper, preset, ...ownProps }) => {
    const { list: presetList, mapper: presetMapper, ...rest } = PRESETS[preset] || {};
    const { namespace: n, list: l, getList: gl } = mapper || presetMapper || {};
    const valid = !params || Object.values(params).some(v => v);
    const type = `${n}/${gl}`;
    return {
      ...rest,
      ...ownProps,
      params,
      list: list || presetList || (valid && stateProps[n] && stateProps[n][l]) || undefined,
      loading: loading || stateProps.loading.effects[type] || false,
      getList:
        getList ||
        (valid &&
          n &&
          gl &&
          ((payload, callback) => {
            dispatch({
              type,
              payload: {
                ...params,
                ...payload,
              },
              callback,
            });
          })) ||
        undefined,
    };
  },
  {
    areStatesEqual: () => false,
    areOwnPropsEqual: () => false,
    areStatePropsEqual: () => false,
    areMergedPropsEqual: (props, nextProps) => {
      return (
        props.value === nextProps.value &&
        props.list === nextProps.list &&
        props.loading === nextProps.loading &&
        props.mode === nextProps.mode &&
        isEqual(props.params, nextProps.params)
      );
    },
  }
)(FormCheckbox);
