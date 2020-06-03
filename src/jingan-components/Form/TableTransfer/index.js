import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Transfer, Button } from 'antd';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import Input from '@/jingan-components/Form/Input';
import Table from '@/jingan-components/View/Table';
import EmptyText from '@/jingan-components/View/EmptyText';
import { connect } from 'dva';
import { isEqual } from 'lodash';
import classNames from 'classnames';
import styles from './index.less';

const PRESETS = {
  gridCompany: {
    mapper: {
      namespace: 'common',
      list: 'gridCompanyList',
      getList: 'getGridCompanyList',
    },
    columns: [
      {
        dataIndex: 'companyName',
        title: '单位名称',
        render: value => <div style={{ minWidth: 56 }}>{value || <EmptyText />}</div>,
      },
      {
        dataIndex: 'address',
        title: '地址',
        render: value => <div style={{ minWidth: 28 }}>{value || <EmptyText />}</div>,
      },
    ],
    rowKey: 'company_id',
  },
  gridCompanyByUser: {
    mapper: {
      namespace: 'common',
      list: 'gridCompanyListByUser',
      getList: 'getGridCompanyListByUser',
    },
    columns: [
      {
        dataIndex: 'companyName',
        title: '单位名称',
        render: value => <div style={{ minWidth: 56 }}>{value || <EmptyText />}</div>,
      },
      {
        dataIndex: 'address',
        title: '地址',
        render: value => <div style={{ minWidth: 28 }}>{value || <EmptyText />}</div>,
      },
    ],
    rowKey: 'companyId',
  },
  checkedCompany: {
    mapper: {
      namespace: 'common',
      list: 'checkedCompanyList',
      getList: 'getCheckedCompanyList',
    },
    columns: [
      {
        dataIndex: 'companyName',
        title: '单位名称',
        render: value => <div style={{ minWidth: 56 }}>{value || <EmptyText />}</div>,
      },
      {
        dataIndex: 'address',
        title: '地址',
        render: value => <div style={{ minWidth: 28 }}>{value || <EmptyText />}</div>,
      },
    ],
    rowKey: 'companyId',
  },
  safetyServiceWithCount: {
    mapper: {
      namespace: 'common',
      list: 'safetyServiceListWithCount',
      getList: 'getSafetyServiceListWithCount',
    },
    columns: [
      {
        dataIndex: 'companyName',
        title: '单位名称',
        render: (value, { count }) => `${value}（${count || 0}人）`,
      },
      {
        dataIndex: 'address',
        title: '地址',
        render: value => <div style={{ minWidth: 28 }}>{value || <EmptyText />}</div>,
      },
    ],
    rowKey: 'companyId',
  },
};
const PAGE_SIZE = 5;
const STATE = {
  data: [],
  filteredData: {},
  leftSelectedList: [],
  rightSelectedList: [],
  length: 0,
  leftFilter: {},
  rightFilter: {},
};
const FILTER_DATA = (data, rightFilter) => {
  const rightFilterEntries = Object.entries(rightFilter || {});
  let list = data || [];
  if (rightFilterEntries.length) {
    list = list.filter(item =>
      rightFilterEntries.every(([key, value]) => !value || (item[key] && item[key].includes(value)))
    );
  }
  return {
    list,
    pagination: {
      total: list.length,
      pageNum: 1,
      pageSize: PAGE_SIZE,
    },
  };
};
const PAGINATION = {
  showTotal: false,
  showQuickJumper: false,
  showSizeChanger: false,
};

const TableTransfer = ({
  className,
  mode,
  value,
  onChange,
  columns: COLUMNS,
  rowKey,
  list: array,
  list: { list } = {},
  loading,
  getList,
  params,
  initializeParams,
  data: initialData,
  empty = <EmptyText />,
  ...rest
}) => {
  const [state, setState] = useState({
    ...STATE,
    data: initialData,
  });
  const [prevParams, setPrevParams] = useState(params);
  const inputRef = useRef(null);
  const {
    data, // 右边的数据列表
    filteredData, // 筛选以后的右边数据列表（包含分页）
    leftSelectedList, // 左边选中的数据列表（不含固定的右边数据）
    rightSelectedList, // 右边选中的数据列表
    length, // 总数
    leftFilter, // 左边的筛选参数
    rightFilter, // 右边的筛选参数
  } = state;
  // 左边选中的键值列表（含固定的右边键值） => 设给左边的table
  const leftSelectedRowKeys = useMemo(
    () => {
      return (leftSelectedList || []).concat(data || []).map(item => item[rowKey]);
    },
    [leftSelectedList, data]
  );
  // 右边选中的键值列表 => 设给右边的table
  const rightSelectedRowKeys = useMemo(
    () => {
      return (rightSelectedList || []).map(item => item[rowKey]);
    },
    [rightSelectedList]
  );
  // 根据总数虚拟的源数据 => 设给transfer
  const dataSource = useMemo(
    () => {
      return (leftSelectedList || []).concat(data || []).concat(
        [...Array(Math.max(0, (length || 0) - leftSelectedRowKeys.length)).keys()].map(key => ({
          [rowKey]: `${key}`,
        }))
      );
    },
    [leftSelectedRowKeys, length]
  );
  // 被选中的transfer所有键值列表 => 设给transfer
  const selectedKeys = useMemo(
    () => {
      return (leftSelectedList || []).concat(rightSelectedList || []).map(item => item[rowKey]);
    },
    [leftSelectedList, rightSelectedList]
  );
  // 被选中的transfer右边键值列表 => 设给transfer
  const targetKeys = useMemo(
    () => {
      return (data || []).map(item => item[rowKey]);
    },
    [data]
  );
  // 格式化后的左边筛选参数对象
  const leftFilterParams = useMemo(
    () => {
      return Object.entries(leftFilter || {}).reduce(
        (result, [key, { value } = {}]) => ({
          ...result,
          [key]: value && value.trim(),
        }),
        {}
      );
    },
    [leftFilter]
  );
  // 格式化后的右边筛选参数对象
  const rightFilterParams = useMemo(
    () => {
      return Object.entries(rightFilter || {}).reduce(
        (result, [key, { value } = {}]) => ({
          ...result,
          [key]: value && value.trim(),
        }),
        {}
      );
    },
    [rightFilter]
  );
  // console.log({
  //   state,
  //   leftSelectedRowKeys,
  //   rightSelectedRowKeys,
  //   dataSource,
  //   selectedKeys,
  //   targetKeys,
  // });
  // 设置总数的回调
  const setLength = useCallback((success, list) => {
    if (success) {
      const {
        pagination: { total },
      } = list;
      setState(state => ({
        ...state,
        length: total,
      }));
    }
  }, []);
  const isDetail = mode === 'detail';
  const isEdit = mode === 'edit';
  const isAdd = !isDetail && !isEdit;
  const hasValue = !!(value && value.length);
  // 当mode不为detail时初始化获取全部数据
  useEffect(() => {
    if (!isDetail) {
      getList && getList(undefined, setLength);
    }
  }, []);
  // 当mode不为add且value有值时初始化获取value对应数据
  useEffect(
    () => {
      if (!isAdd && hasValue) {
        if (
          !data ||
          data.length !== value.length ||
          value.some(
            (key, index) => data[index][rowKey] !== key
          ) /* data不存在，或者value和data不一一对应时 */
        ) {
          const callback = (success, array) => {
            const list = array && array.list;
            const data = value.map(key => {
              const item = (list || []).find(item => item[rowKey] === key);
              return (
                item || {
                  [rowKey]: key,
                }
              );
            });
            setState(state => ({
              ...state,
              data,
              filteredData: FILTER_DATA(data),
            }));
          };
          if (initialData && initialData.length /* initialData存在时 */) {
            callback(true, { list: initialData });
          } else if (
            list &&
            value.every(key =>
              list.find(item => item[rowKey] === key)
            ) /* 本地列表中能找到所有选项时 */
          ) {
            callback(true, array);
          } else {
            /* 从后台筛选 */
            getList
              ? getList(
                  {
                    ...(typeof initializeParams === 'function'
                      ? initializeParams(value)
                      : {
                          [initializeParams || 'ids']: value.join(','),
                        }),
                    pageSize: value.length,
                  },
                  callback,
                  true
                )
              : callback(true, array);
          }
        }
      }
    },
    [value]
  );
  // 当params发生变化时重新初始化
  useEffect(
    () => {
      if (!isEqual(params, prevParams)) {
        setPrevParams(params);
        if (!isDetail) {
          setState(STATE);
          getList && getList(undefined, setLength);
          if (hasValue) {
            onChange && onChange();
          }
        }
      }
    },
    [params]
  );
  const getColumnSearchProps = (direction, dataIndex) => {
    const filterName = `${direction}Filter`;
    const { value, prevValue, visible = false } = state[filterName][dataIndex] || {};
    const callback = () => {
      if (direction === 'left') {
        setState(state => ({
          ...state,
          [filterName]: {
            ...state[filterName],
            [dataIndex]: {
              ...state[filterName][dataIndex],
              prevValue: (state[filterName][dataIndex] || {}).value,
              visible: false,
            },
          },
        }));
        getList && getList(leftFilterParams);
      } else {
        setState(state => ({
          ...state,
          filteredData: FILTER_DATA(state.data, rightFilterParams),
          [filterName]: {
            ...state[filterName],
            [dataIndex]: {
              ...state[filterName][dataIndex],
              prevValue: (state[filterName][dataIndex] || {}).value,
              visible: false,
            },
          },
        }));
      }
    };
    return {
      filterDropdown: () => (
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <Input
              className={styles.input}
              value={value}
              ref={inputRef}
              onChange={({ target: { value } }) =>
                setState(state => ({
                  ...state,
                  [filterName]: {
                    ...state[filterName],
                    [dataIndex]: { ...state[filterName][dataIndex], value },
                  },
                }))
              }
              onPressEnter={callback}
            />
          </div>
          <div className={styles.buttonContainer}>
            <div className={styles.buttonWrapper}>
              <Button className={styles.button} type="primary" onClick={callback} size="small">
                查询
              </Button>
            </div>
            <div className={styles.buttonWrapper}>
              <Button
                className={styles.button}
                onClick={() => {
                  if (direction === 'left') {
                    setState(state => ({
                      ...state,
                      [filterName]: {
                        ...state[filterName],
                        [dataIndex]: undefined,
                      },
                    }));
                    getList && getList({ ...leftFilterParams, [dataIndex]: undefined });
                  } else {
                    setState(state => ({
                      ...state,
                      filteredData: FILTER_DATA(state.data, {
                        ...rightFilterParams,
                        [dataIndex]: undefined,
                      }),
                      [filterName]: {
                        ...state[filterName],
                        [dataIndex]: undefined,
                      },
                    }));
                  }
                }}
                size="small"
              >
                重置
              </Button>
            </div>
            <div className={styles.buttonWrapper}>
              <Button
                className={classNames(styles.button, styles.resetAllButton)}
                onClick={() => {
                  if (direction === 'left') {
                    setState(state => ({
                      ...state,
                      [filterName]: {},
                    }));
                    getList && getList();
                  } else {
                    setState(state => ({
                      ...state,
                      filteredData: FILTER_DATA(state.data),
                      [filterName]: {},
                    }));
                  }
                }}
                size="small"
              >
                全部重置
              </Button>
            </div>
          </div>
        </div>
      ),
      filterIcon: () => (
        <LegacyIcon type="search" style={{ color: prevValue ? '#1890ff' : undefined }} />
      ),
      filterDropdownVisible: visible,
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setState(state => ({
            ...state,
            [filterName]: {
              ...state[filterName],
              [dataIndex]: { ...state[filterName][dataIndex], visible },
            },
          }));
          setTimeout(() => inputRef.current.select());
        } else {
          setState(state => ({
            ...state,
            [filterName]: {
              ...state[filterName],
              [dataIndex]: {
                ...state[filterName][dataIndex],
                value: (state[filterName][dataIndex] || {}).prevValue,
                visible,
              },
            },
          }));
        }
      },
    };
  };
  if (mode !== 'detail') {
    return (
      <Transfer
        {...rest}
        className={classNames(styles.container, className)}
        rowKey={record => record[rowKey]}
        showSelectAll={false}
        dataSource={dataSource}
        selectedKeys={selectedKeys}
        targetKeys={targetKeys}
        onChange={(targetKeys, direction) => {
          const nextData =
            direction === 'left'
              ? data.filter(
                  ({ [rowKey]: key }) => !rightSelectedList.find(item => item[rowKey] === key)
                )
              : (data || []).concat(leftSelectedList);
          setState(state => ({
            ...state,
            data: nextData,
            filteredData: FILTER_DATA(nextData, rightFilterParams),
            ...(direction === 'left'
              ? {
                  rightSelectedList: [],
                }
              : {
                  leftSelectedList: [],
                }),
          }));
          onChange && onChange(nextData && nextData.map(item => item[rowKey]));
        }}
      >
        {({ direction, disabled }) => {
          const isLeft = direction === 'left';
          const columns = COLUMNS.map(item => ({
            ...item,
            ...getColumnSearchProps(direction, item.dataIndex),
          }));
          return (
            <Table
              className={styles.table}
              list={isLeft ? array : filteredData}
              loading={isLeft && loading}
              columns={columns}
              rowSelection={{
                fixed: true,
                ...(isLeft
                  ? {
                      getCheckboxProps: ({ [rowKey]: key }) => ({
                        disabled: disabled || !!(data || []).find(item => item[rowKey] === key),
                      }),
                      selectedRowKeys: leftSelectedRowKeys,
                      onSelect: (record, selected) => {
                        setState(state => ({
                          ...state,
                          leftSelectedList: selected
                            ? (state.leftSelectedList || []).concat(record)
                            : state.leftSelectedList.filter(
                                item => item[rowKey] !== record[rowKey]
                              ),
                        }));
                      },
                      onSelectAll: (selected, selectedRows, changedRows) => {
                        setState(state => ({
                          ...state,
                          leftSelectedList: selected
                            ? changedRows.reduce((result, record) => {
                                if (!result.find(item => item[rowKey] === record[rowKey])) {
                                  result = result.concat(record);
                                }
                                return result;
                              }, state.leftSelectedList || [])
                            : state.leftSelectedList.filter(
                                item => !changedRows.find(record => item[rowKey] === record[rowKey])
                              ),
                        }));
                      },
                    }
                  : {
                      getCheckboxProps: () => ({ disabled }),
                      selectedRowKeys: rightSelectedRowKeys,
                      onSelect: (record, selected) => {
                        setState(state => ({
                          ...state,
                          rightSelectedList: selected
                            ? (state.rightSelectedList || []).concat(record)
                            : state.rightSelectedList.filter(
                                item => item[rowKey] !== record[rowKey]
                              ),
                        }));
                      },
                      onSelectAll: (selected, selectedRows, changedRows) => {
                        setState(state => ({
                          ...state,
                          rightSelectedList: selected
                            ? changedRows.reduce((result, record) => {
                                if (!result.find(item => item[rowKey] === record[rowKey])) {
                                  result = result.concat(record);
                                }
                                return result;
                              }, state.rightSelectedList || [])
                            : state.rightSelectedList.filter(
                                item => !changedRows.find(record => item[rowKey] === record[rowKey])
                              ),
                        }));
                      },
                    }),
              }}
              size="small"
              style={{ pointerEvents: disabled ? 'none' : null }}
              showCard={false}
              pagination={PAGINATION}
              onChange={({ current }) => {
                if (isLeft) {
                  getList && getList({ ...leftFilterParams, pageNum: current });
                } else {
                  setState(state => ({
                    ...state,
                    filteredData: {
                      ...state.filteredData,
                      pagination: {
                        ...state.filteredData.pagination,
                        pageNum: current,
                      },
                    },
                  }));
                }
              }}
              rowKey={rowKey}
            />
          );
        }}
      </Transfer>
    );
  } else {
    return filteredData && filteredData.list && filteredData.list.length ? (
      <Table
        list={filteredData}
        columns={COLUMNS}
        size="small"
        // pagination={PAGINATION}
        // onChange={({ current }) => {
        //   setState(state => ({
        //     ...state,
        //     filteredData: {
        //       ...state.filteredData,
        //       pagination: {
        //         ...state.filteredData.pagination,
        //         pageNum: current,
        //       },
        //     },
        //   }));
        // }}
        rowKey={rowKey}
        showCard={false}
        showPagination={false}
        scroll={
          filteredData.list.length > 15 && {
            y: 39 * 15,
            scrollToFirstRowOnChange: true,
          }
        }
      />
    ) : (
      empty
    );
  }
};

TableTransfer.getRules = ({ label }) => {
  return [
    {
      type: 'array',
      min: 1,
      required: true,
      message: `${label || ''}不能为空`,
    },
  ];
};

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
          ((payload, callback, ignore) => {
            dispatch({
              type,
              payload: {
                pageNum: 1,
                pageSize: PAGE_SIZE,
                ...(!ignore && params),
                ...payload,
              },
              callback,
              ignore,
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
)(TableTransfer);
