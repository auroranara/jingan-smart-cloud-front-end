import React, { useEffect, useState, useMemo } from 'react';
import { Spin, Tree } from 'antd';
import EmptyText from '@/jingan-components/View/EmptyText';
import { connect } from 'dva';
import classNames from 'classnames';
import { isEqual } from 'lodash';
import styles from './index.less';

// 预置键值映射
const FIELDNAMES = {
  key: 'key',
  value: 'value',
  children: 'children',
  checkable: 'checkable',
  disabled: 'disabled',
  disableCheckbox: 'disableCheckbox',
  selectable: 'selectable',
  isLeaf: 'isLeaf',
};

// 预置配置
const PRESETS = {
  department: {
    fieldNames: {
      key: 'id',
      value: 'name',
    },
    mapper: {
      namespace: 'common',
      list: 'departmentList',
      getList: 'getDepartmentList',
    },
  },
  grid: {
    fieldNames: {
      key: 'grid_id',
      value: 'grid_name',
    },
    mapper: {
      namespace: 'common',
      list: 'gridList',
      getList: 'getGridList',
    },
    initializeParams: 'ids',
  },
  gridWithCount: {
    fieldNames: {
      key: 'grid_id',
      value({ grid_name, personCount }) {
        return `${grid_name}（共计${personCount}人）`;
      },
    },
    mapper: {
      namespace: 'common',
      list: 'gridListWithCount',
      getList: 'getGridListWithCount',
    },
    initializeParams: 'ids',
  },
};

// 树
const FormTree = ({
  className,
  mode,
  value,
  onChange,
  list,
  loading,
  getList,
  fieldNames,
  params,
  initializeParams,
  treeData: disabledTreeData, // 禁用treeData，改用list
  checkedKeys: disabledCheckedKeys, // 禁用checkedKeys，改用value
  onCheck: disabledOnCheck, // 禁用onCheck，改用onChange
  empty = <EmptyText />,
  ...rest
}) => {
  const {
    key: k,
    value: v,
    children: c,
    checkable,
    disabled,
    disableCheckbox,
    selectable,
    isLeaf,
  } = { ...FIELDNAMES, ...fieldNames };
  const [prevParams, setPrevParams] = useState(params);
  const isDetail = mode === 'detail';
  const hasValue = !!(value && value.length);
  // const getTreeByValue = () => {
  //   const initialValue = value.join(',');
  //   getList &&
  //     getList(
  //       typeof initializeParams === 'function'
  //         ? initializeParams(initialValue)
  //         : {
  //             [initializeParams || `${k}s`]: initialValue,
  //           }
  //     );
  // };
  // 当mode不为detail时初始化获取全部的树
  useEffect(() => {
    // if (!isDetail) {
    //   getList && getList();
    // }
    getList && getList();
  }, []);
  // // 当mode为detail且value有值时初始化获取value对应的树
  // useEffect(
  //   () => {
  //     if (isDetail && hasValue) {
  //       getTreeByValue();
  //     }
  //   },
  //   [value] // 不依赖mode的话也许会有问题，以后再说
  // );
  // params发生变化时重新初始化（实际使用时请确保params和value同步或params比value早设置）
  useEffect(
    () => {
      if (!isEqual(params, prevParams)) {
        setPrevParams(params);
        if (!isDetail) {
          getList && getList();
          if (hasValue) {
            onChange && onChange();
          }
        } /*  else if (hasValue) {
          getTreeByValue();
        } */
      }
    },
    [params]
  );
  const { treeData, checkedKeys } = (function callback(list, value) {
    return list && list.length
      ? list.reduce(
          (result, item) => {
            const included = (value || []).includes(item[k]);
            const { treeData, checkedKeys } = callback(
              item[c],
              included ? value.concat((item[c] || []).map(item => item[k])) : value
            );
            result.treeData.push({
              key: item[k],
              value: item[k],
              title: typeof v === 'function' ? v(item) : item[v],
              children: treeData,
              checkable: typeof checkable === 'function' ? checkable(item) : item[checkable],
              disabled: typeof disabled === 'function' ? disabled(item) : item[disabled],
              disableCheckbox:
                typeof disableCheckbox === 'function'
                  ? disableCheckbox(item)
                  : item[disableCheckbox],
              selectable: typeof selectable === 'function' ? selectable(item) : item[selectable],
              isLeaf: typeof isLeaf === 'function' ? isLeaf(item) : item[isLeaf],
              data: item,
            });
            if (included) {
              result.checkedKeys.push(item[k]);
            }
            if (checkedKeys && checkedKeys.length) {
              result.checkedKeys = result.checkedKeys.concat(checkedKeys);
            }
            return result;
          },
          {
            treeData: [],
            checkedKeys: [],
          }
        )
      : {};
  })(list, value);
  return !loading ? (
    treeData && treeData.length ? (
      <Tree
        className={classNames(styles.container, className)}
        treeData={treeData}
        checkedKeys={checkedKeys}
        onCheck={
          !isDetail
            ? (checkedKeys, e) => {
                const getValue = list =>
                  list && list.length
                    ? list.reduce((result, item) => {
                        const children = getValue(item[c]);
                        if (checkedKeys.includes(item[k])) {
                          result.push(item[k]);
                        } else if (children && children.length) {
                          result = result.concat(children);
                        }
                        return result;
                      }, [])
                    : undefined;
                const value = getValue(list);
                onChange && onChange(value, e);
              }
            : undefined
        }
        checkable
        selectable={false}
        {...rest}
      />
    ) : (
      empty
    )
  ) : (
    <Spin size="small" />
  );
};

// 预置规则
FormTree.getRules = ({ label }) => [
  {
    type: 'array',
    min: '1',
    required: true,
    message: `${label || ''}不能为空`,
  },
];

// 绑定model
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
)(FormTree);
