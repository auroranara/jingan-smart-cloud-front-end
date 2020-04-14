import React, { useEffect, useState } from 'react';
import { TreeSelect, Spin } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import EmptyText from '@/jingan-components/View/EmptyText';
import { connect } from 'dva';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
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

const FormTreeSelect = ({
  className,
  value,
  onChange,
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
  data: initialData,
  multiple: originalMultiple,
  treeCheckable,
  showCheckedStrategy,
  onSearch,
  initializeParams,
  searchParams,
  separator = ',',
  ...rest
}) => {
  const [hackKey, setHackKey] = useState(1);
  const [data, setData] = useState(initialData);
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
  const multiple = originalMultiple || treeCheckable || false;
  useEffect(() => {
    if (!labelInValue && value && (!multiple || value.length) && !data) {
      const callback = (success, list) => {
        if (success) {
          const getItemByKey = (list, key) => {
            const length = (list && list.length) || 0;
            for (let i = 0; i < length; i++) {
              if (list[i][k] === key) {
                return list[i];
              } else {
                const item = getItemByKey(list[i][c], key);
                if (item) {
                  return item;
                }
              }
            }
            return;
          };
          const data = (multiple ? value : [value]).map(key => {
            const item = getItemByKey(list, key);
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
      async && getList && getList();
    } else {
      getList && getList();
    }
  }, []);
  useEffect(
    () => {
      // 这样写是有问题的，以后改
      if (list) {
        setHackKey(hackKey => hackKey + 1);
      }
    },
    [list]
  );
  if (mode !== 'detail') {
    const handleChange = (value, label, extra) => {
      setData(value);
      onChange &&
        onChange(value && (multiple ? value.map(({ key }) => key) : value.key), label, extra);
    };
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
        value={!labelInValue ? data : value}
        labelInValue
        notFoundContent={loading ? <Spin size="small" /> : notFoundContent}
        treeNodeFilterProp={treeNodeFilterProp}
        filterTreeNode={filterTreeNode}
        allowClear={allowClear}
        showArrow={showArrow}
        showSearch={showSearch}
        loadData={loadData ? handleLoadData : undefined}
        onChange={!labelInValue ? handleChange : onChange}
        onSearch={async ? handleSearch : onSearch}
        showCheckedStrategy={TreeSelect[showCheckedStrategy]}
        {...rest}
      >
        {renderTreeNodes(!loading && list ? list : [])}
      </TreeSelect>
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

FormTreeSelect.getRules = ({ label, labelInValue, multiple: originalMultiple, treeCheckable }) => {
  const multiple = originalMultiple || treeCheckable || false;
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
