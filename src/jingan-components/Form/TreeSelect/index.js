import React, { useEffect, useState } from 'react';
import { TreeSelect, Spin } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import EmptyText from '@/jingan-components/View/EmptyText';
import { connect } from 'dva';
import classNames from 'classnames';
import styles from './index.less';
const { TreeNode } = TreeSelect;

const FIELDNAMES = {
  key: 'key',
  value: 'value',
  children: 'children',
  disabled: 'disabled',
  disableCheckbox: 'disableCheckbox',
  selectable: 'selectable',
  checkable: 'checkable',
  isLeaf: 'isLeaf',
};

/**
 * 多选
 * labelInValue
 * 异步加载
 */

const FormTreeSelect = ({
  className,
  value,
  mode = 'add',
  fieldNames,
  list = [],
  loading = false,
  placeholder = '请选择',
  treeNodeFilterProp = 'children',
  filterTreeNode = true,
  allowClear = false,
  showArrow = true,
  empty = <EmptyText />,
  ellipsis = true,
  getList,
  notFoundContent,
  showSearch = false,
  loadData,
  loadParams,
  labelInValue,
  ...rest
}) => {
  const [hackKey, setHackKey] = useState(1);
  const [data, setData] = useState(undefined);
  const {
    key: k,
    value: v,
    children: c,
    isLeaf,
    disabled,
    disableCheckbox,
    selectable,
    checkable,
  } = { ...FIELDNAMES, ...fieldNames };
  const async = showSearch && !filterTreeNode;
  useEffect(() => {
    getList && getList();
  }, []);
  useEffect(
    () => {
      setHackKey(hackKey => hackKey + 1);
    },
    [list]
  );
  if (mode !== 'detail') {
    const handleLoadData = node => {
      return new Promise((resolve, reject) => {
        getList &&
          getList(
            typeof loadParams === 'function'
              ? loadParams(node.data)
              : {
                  [loadParams || k]: node.data[loadParams || k],
                },
            success => {
              if (success) {
                resolve();
              } else {
                reject();
              }
            }
          );
        typeof loadData === 'function' && loadData(node, resolve, reject);
      });
    };
    const renderTreeNodes = list => {
      return list && list.length
        ? list.map(item => (
            <TreeNode
              key={item[k]}
              value={item[k]}
              title={item[v]}
              children={renderTreeNodes(item[c])}
              isLeaf={typeof isLeaf === 'function' ? isLeaf(item) : item[isLeaf]}
              disabled={typeof disabled === 'function' ? disabled(item) : item[disabled]}
              disableCheckbox={
                typeof disableCheckbox === 'function'
                  ? disableCheckbox(item)
                  : item[disableCheckbox]
              }
              selectable={typeof selectable === 'function' ? selectable(item) : item[selectable]}
              checkable={typeof checkable === 'function' ? checkable(item) : item[checkable]}
              data={item}
            />
          ))
        : undefined;
    };
    return (
      <TreeSelect
        key={hackKey}
        className={classNames(styles.container, className)}
        placeholder={placeholder}
        value={async && !labelInValue ? data : value}
        labelInValue={async || labelInValue}
        notFoundContent={loading ? <Spin size="small" /> : notFoundContent}
        treeNodeFilterProp={treeNodeFilterProp}
        filterTreeNode={filterTreeNode}
        allowClear={allowClear}
        showArrow={showArrow}
        showSearch={showSearch}
        loadData={loadData ? handleLoadData : undefined}
        {...rest}
      >
        {renderTreeNodes(list)}
      </TreeSelect>
    );
  } else {
    const getValueByKey = (list, key) => {
      const length = (list && list.length) || 0;
      for (let i = 0; i < length; i++) {
        if (list[i][k] === key) {
          return list[i][v];
        } else {
          const value = getValueByKey(list[i][c], key);
          if (value) {
            return value;
          }
        }
      }
      return;
    };
    const label = getValueByKey(list, value);
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

FormTreeSelect.getRules = ({ label, labelInValue }) => [
  {
    type: labelInValue ? 'object' : 'string',
    required: true,
    message: `${label || ''}不能为空`,
  },
];

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
)(FormTreeSelect);
