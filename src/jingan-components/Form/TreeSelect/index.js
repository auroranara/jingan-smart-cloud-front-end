import React, { useEffect, useState } from 'react';
import { TreeSelect, Spin } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import EmptyText from '@/jingan-components/View/EmptyText';
import { connect } from 'dva';
import classNames from 'classnames';
import { debounce, isEqual } from 'lodash';
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
  gridTreeByUser: {
    fieldNames: {
      key: 'grid_id',
      value: 'grid_name',
    },
    mapper: {
      namespace: 'common',
      list: 'gridTreeByUser',
      getList: 'getGridTreeByUser',
    },
    initializeParams: 'ids',
  },
  // 根据企业获取部门树（陈涛）
  departmentTreeByCompany: {
    fieldNames: {
      key: 'id',
      value: 'name',
    },
    mapper: {
      namespace: 'common',
      list: 'departmentTreeByCompany',
      getList: 'getDepartmentTreeByCompany',
    },
  },
};

const FormTreeSelect = ({
  className,
  value,
  onChange,
  mode = 'add',
  fieldNames,
  list,
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
  separator = '，',
  params,
  ...rest
}) => {
  const [hackKey, setHackKey] = useState(1);
  const [data, setData] = useState(initialData);
  const [prevParams, setPrevParams] = useState(params);
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
    if (
      labelInValue /* labelInValue为true */ ||
      !value ||
      (multiple && !value.length) /* value不存在 */ ||
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
          const callback = (success, list) => {
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
                getItemByKey(list, key)
              ) /* 本地列表中能找到所有选项时 */
            ) {
              callback(true, list);
              getList && getList();
            } else {
              /* 从后台筛选 */
              getList
                ? getList(
                    {
                      ...(typeof initializeParams === 'function'
                        ? initializeParams(value)
                        : {
                            [initializeParams || `${k}s`]: multiple ? value.join(',') : value,
                          }),
                      pageSize: multiple ? value.length : 1,
                    },
                    callback,
                    true
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
  useEffect(
    () => {
      // 这样写是有问题的，以后改
      if (list) {
        setHackKey(hackKey => hackKey + 1);
      }
    },
    [list]
  );
  useEffect(
    () => {
      if (!isEqual(params, prevParams)) {
        setPrevParams(params);
        getList && getList();
      }
    },
    [params]
  );
  if (mode !== 'detail') {
    const handleChange = (value, label, extra) => {
      const values =
        value &&
        (multiple
          ? value.map(item => ({
              ...item,
              key: item.key || item.value,
              value: item.key || item.value,
            }))
          : {
              ...value,
              key: value.key || value.value,
              value: value.key || value.value,
            });
      if (labelInValue) {
        onChange && onChange(values, label, extra);
      } else {
        setData(values);
        onChange &&
          onChange(values && (multiple ? values.map(({ key }) => key) : values.key), label, extra);
      }
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
        onChange={handleChange}
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
  (state, { mapper, list, loading, preset, fieldNames, params }) => {
    const { mapper: presetMapper, fieldNames: presetFieldNames, ...rest } = PRESETS[preset] || {};
    const { namespace, list: l, getList: gl } = mapper || presetMapper || {};
    return {
      list:
        !params || Object.values(params).some(v => v)
          ? namespace && l
            ? state[namespace][l]
            : list
          : undefined,
      loading: namespace && gl ? state.loading.effects[`${namespace}/${gl}`] : loading,
      fieldNames: fieldNames || presetFieldNames,
      ...rest,
    };
  },
  (dispatch, { mapper, params, getList, callback, preset }) => {
    const { namespace, getList: gl } = mapper || (PRESETS[preset] || {}).mapper || {};
    return {
      getList:
        !params || Object.values(params).some(v => v)
          ? namespace && gl
            ? (payload, cb, ignoreParams) => {
                dispatch({
                  type: `${namespace}/${gl}`,
                  payload: {
                    ...(!ignoreParams && params),
                    ...payload,
                  },
                  callback(...args) {
                    cb && cb(...args);
                    callback && callback(...args);
                  },
                });
              }
            : getList
          : undefined,
    };
  },
  (
    stateProps,
    dispatchProps,
    { mapper, list, loading, getList, callback, preset, fieldNames, ...ownProps }
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
        props.mode === nextProps.mode &&
        isEqual(props.params, nextProps.params)
      );
    },
  }
)(FormTreeSelect);
