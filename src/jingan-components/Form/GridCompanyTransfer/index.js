import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Transfer, Button } from 'antd';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Input } from '@/jingan-components/Form';
import { Table, EmptyText } from '@/jingan-components/View';
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
  },
  checkedCompany: {
    mapper: {
      namespace: 'common',
      list: 'checkedCompanyList',
      getList: 'getCheckedCompanyList',
    },
  },
};
const PAGE_SIZE = 5;
const COLUMNS = [
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
];
const FILTER_VALUES = {
  companyName: {
    value: undefined,
    prevValue: undefined,
    visible: false,
  },
  address: {
    value: undefined,
    prevValue: undefined,
    visible: false,
  },
};
const STATE = {
  data: [],
  filteredData: {},
  sourceSelectedList: [],
  targetSelectedList: [],
  length: 0,
  leftFilter: {
    ...FILTER_VALUES,
  },
  rightFilter: {
    ...FILTER_VALUES,
  },
};
const FILTER_DATA = (data, { companyName, address } = {}) => {
  const list = (data || []).filter(
    item =>
      (!companyName || item.companyName.includes(companyName)) &&
      (!address || item.address.includes(address))
  );
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

const GridCompanyTransfer = props => {
  const {
    className,
    mode,
    value,
    onChange,
    list: array,
    list: { list } = {},
    getList,
    loading = false,
    empty = <EmptyText />,
    params,
    initializeParams,
    data: initialData,
    ...rest
  } = props;
  const [state, setState] = useState({
    ...STATE,
    data: initialData,
  });
  const [prevParams, setPrevParams] = useState(params);
  const inputRef = useRef(null);
  const {
    data, // 右边的数据列表
    filteredData, // 筛选以后的右边数据列表（包含分页）
    sourceSelectedList, // 左边选中的数据列表（不含固定的右边数据）
    targetSelectedList, // 右边选中的数据列表
    length, // 总数
    leftFilter, // 左边的筛选参数
    rightFilter, // 右边的筛选参数
  } = state;
  const leftSelectedRowKeys = useMemo(
    () => {
      return (sourceSelectedList || []).concat(data || []).map(({ company_id }) => company_id);
    },
    [sourceSelectedList, data]
  ); // 左边选中的键值列表（含固定的右边键值）
  const dataSource = useMemo(
    () => {
      return (sourceSelectedList || []).concat(data || []).concat(
        [...Array(Math.max(0, (length || 0) - leftSelectedRowKeys.length)).keys()].map(
          company_id => ({
            company_id: `${company_id}`,
          })
        )
      );
    },
    [leftSelectedRowKeys, length]
  ); // 根据总数虚拟的transfer源数据
  const rightSelectedRowKeys = useMemo(
    () => {
      return (targetSelectedList || []).map(({ company_id }) => company_id);
    },
    [targetSelectedList]
  ); // 右边选中的键值列表
  const selectedKeys = useMemo(
    () => {
      return (sourceSelectedList || [])
        .concat(targetSelectedList || [])
        .map(({ company_id }) => company_id);
    },
    [sourceSelectedList, targetSelectedList]
  ); // 被选中的transfer所有键值列表
  const targetKeys = useMemo(
    () => {
      return (data || []).map(({ company_id }) => company_id);
    },
    [data]
  ); // 被选中的transfer右边键值列表
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
  const leftFilterParams = useMemo(
    () => {
      return Object.entries(leftFilter).reduce(
        (result, [key, { value }]) => ({
          ...result,
          [key]: value && value.trim(),
        }),
        {}
      );
    },
    [leftFilter]
  ); // 格式化后的左边筛选参数对象
  const rightFilterParams = useMemo(
    () => {
      return Object.entries(rightFilter).reduce(
        (result, [key, { value }]) => ({
          ...result,
          [key]: value && value.trim(),
        }),
        {}
      );
    },
    [rightFilter]
  ); // 格式化后的右边筛选参数对象
  // 初始化请求接口
  useEffect(() => {
    if (
      !value ||
      !value.length /* value不存在 */ ||
      (data &&
        data.length === value.length &&
        value.every((key, index) => data[index].company_id === key)) /* value和data一一对应 */
    ) {
      getList && getList(undefined, setLength);
    }
  }, []);
  // value发生变化时
  useEffect(
    () => {
      if (value && value.length /* value存在时 */) {
        const callback = (success, array) => {
          const list = array && array.list;
          const data = value.map(key => {
            const item = (list || []).find(item => item.company_id === key);
            return (
              item || {
                company_id: key,
              }
            );
          });
          setState(state => ({
            ...state,
            ...STATE,
            data,
            filteredData: FILTER_DATA(data),
          }));
        };
        if (
          !data ||
          data.length !== value.length ||
          value.some(
            (key, index) => data[index].company_id !== key
          ) /* data不存在，或者value和data不一一对应时 */
        ) {
          if (
            initialData &&
            initialData.length === value.length &&
            value.every(
              (key, index) => initialData[index].company_id === key
            ) /* value和initialData一一对应时 */
          ) {
            // setState(state => ({
            //   ...state,
            //   ...STATE,
            //   data: initialData,
            //   filteredData: FILTER_DATA(initialData),
            // }));
            callback(true, { list: initialData });
            getList && getList(undefined, setLength);
          } else if (
            list &&
            value.every(key =>
              list.find(item => item.company_id === key)
            ) /* 本地列表中能找到所有选项时 */
          ) {
            callback(true, array);
            getList && getList(undefined, setLength);
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
            getList && getList(undefined, setLength);
          }
        }
      } else if (data && data.length /* value不存在但data存在时 */) {
        setState(state => ({
          ...state,
          ...STATE,
        }));
        getList && getList(undefined, setLength);
      }
    },
    [value]
  );
  // params发生变化时
  useEffect(
    () => {
      if (!isEqual(params, prevParams)) {
        setPrevParams(params);
        setState(state => ({
          ...state,
          ...STATE,
        }));
        getList && getList(undefined, setLength);
      }
    },
    [params]
  );
  // data发生变化时（这是setData时无法同步执行onChange而做的降级处理）
  useEffect(
    () => {
      if (data !== initialData) {
        const isDataExist = data && data.length;
        const isValueExist = value && value.length;
        if (
          (!isDataExist && isValueExist) ||
          (isDataExist &&
            (!isValueExist ||
              data.length !== value.length ||
              value.some((key, index) => data[index].company_id !== key)))
        ) {
          onChange && onChange(data && data.map(({ company_id }) => company_id));
        }
      }
    },
    [data]
  );
  const getColumnSearchProps = (direction, dataIndex) => {
    const { value, prevValue, visible } = state[`${direction}Filter`][dataIndex];
    const callback = () => {
      if (direction === 'left') {
        setState(state => ({
          ...state,
          [`${direction}Filter`]: {
            ...state[`${direction}Filter`],
            [dataIndex]: {
              ...state[`${direction}Filter`][dataIndex],
              prevValue: state[`${direction}Filter`][dataIndex].value,
              visible: false,
            },
          },
        }));
        getList && getList(leftFilterParams);
      } else {
        setState(state => ({
          ...state,
          filteredData: FILTER_DATA(state.data, rightFilterParams),
          [`${direction}Filter`]: {
            ...state[`${direction}Filter`],
            [dataIndex]: {
              ...state[`${direction}Filter`][dataIndex],
              prevValue: state[`${direction}Filter`][dataIndex].value,
              visible: false,
            },
          },
        }));
      }
    };
    return {
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <div className={styles.inputWrapper}>
            <Input
              className={styles.input}
              value={value}
              ref={inputRef}
              onChange={({ target: { value } }) =>
                setState(state => ({
                  ...state,
                  [`${direction}Filter`]: {
                    ...state[`${direction}Filter`],
                    [dataIndex]: { ...state[`${direction}Filter`][dataIndex], value },
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
                      [`${direction}Filter`]: {
                        ...state[`${direction}Filter`],
                        [dataIndex]: {
                          ...state[`${direction}Filter`][dataIndex],
                          value: undefined,
                          prevValue: undefined,
                          visible: false,
                        },
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
                      [`${direction}Filter`]: {
                        ...state[`${direction}Filter`],
                        [dataIndex]: {
                          ...state[`${direction}Filter`][dataIndex],
                          value: undefined,
                          prevValue: undefined,
                          visible: false,
                        },
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
                      [`${direction}Filter`]: {
                        ...FILTER_VALUES,
                      },
                    }));
                    getList && getList();
                  } else {
                    setState(state => ({
                      ...state,
                      filteredData: FILTER_DATA(state.data),
                      [`${direction}Filter`]: {
                        ...FILTER_VALUES,
                      },
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
            [`${direction}Filter`]: {
              ...state[`${direction}Filter`],
              [dataIndex]: { ...state[`${direction}Filter`][dataIndex], visible },
            },
          }));
          setTimeout(() => inputRef.current.select());
        } else {
          setState(state => ({
            ...state,
            [`${direction}Filter`]: {
              ...state[`${direction}Filter`],
              [dataIndex]: {
                ...state[`${direction}Filter`][dataIndex],
                value: state[`${direction}Filter`][dataIndex].prevValue,
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
        rowKey={({ company_id }) => company_id}
        showSelectAll={false}
        dataSource={dataSource}
        selectedKeys={selectedKeys}
        targetKeys={targetKeys}
        onChange={(targetKeys, direction) => {
          setState(state => {
            const data =
              direction === 'left'
                ? state.data.filter(
                    ({ company_id }) =>
                      !state.targetSelectedList.find(item => item.company_id === company_id)
                  )
                : (state.data || []).concat(state.sourceSelectedList);
            return {
              ...state,
              ...(direction === 'left'
                ? {
                    targetSelectedList: [],
                    data,
                    filteredData: FILTER_DATA(data, rightFilterParams),
                  }
                : {
                    sourceSelectedList: [],
                    data,
                    filteredData: FILTER_DATA(data, rightFilterParams),
                  }),
            };
          });
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
                      getCheckboxProps: ({ company_id }) => ({
                        disabled:
                          disabled || !!(data || []).find(item => item.company_id === company_id),
                      }),
                      selectedRowKeys: leftSelectedRowKeys,
                      onSelect: (record, selected) => {
                        setState(state => ({
                          ...state,
                          sourceSelectedList: selected
                            ? (state.sourceSelectedList || []).concat(record)
                            : state.sourceSelectedList.filter(
                                ({ company_id }) => company_id !== record.company_id
                              ),
                        }));
                      },
                      onSelectAll: (selected, selectedRows, changedRows) => {
                        setState(state => ({
                          ...state,
                          sourceSelectedList: selected
                            ? changedRows.reduce((result, item) => {
                                if (
                                  !result.find(({ company_id }) => item.company_id === company_id)
                                ) {
                                  result = result.concat(item);
                                }
                                return result;
                              }, state.sourceSelectedList || [])
                            : state.sourceSelectedList.filter(
                                ({ company_id }) =>
                                  !changedRows.find(item => item.company_id === company_id)
                              ),
                        }));
                      },
                    }
                  : {
                      getCheckboxProps: () => ({ disabled: disabled }),
                      selectedRowKeys: rightSelectedRowKeys,
                      onSelect: (record, selected) => {
                        setState(state => ({
                          ...state,
                          targetSelectedList: selected
                            ? (state.targetSelectedList || []).concat(record)
                            : state.targetSelectedList.filter(
                                ({ company_id }) => company_id !== record.company_id
                              ),
                        }));
                      },
                      onSelectAll: (selected, selectedRows, changedRows) => {
                        setState(state => ({
                          ...state,
                          targetSelectedList: selected
                            ? changedRows.reduce((result, item) => {
                                if (
                                  !result.find(({ company_id }) => item.company_id === company_id)
                                ) {
                                  result = result.concat(item);
                                }
                                return result;
                              }, state.targetSelectedList || [])
                            : state.targetSelectedList.filter(
                                ({ company_id }) =>
                                  !changedRows.find(item => item.company_id === company_id)
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
              rowKey="company_id"
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
        rowKey="company_id"
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

GridCompanyTransfer.getRules = ({ label }) => {
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
  (
    stateProps,
    { dispatch },
    { list, loading, getList, params, mapper, preset = 'gridCompany', ...ownProps }
  ) => {
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
          ((payload, callback, ignoreParams) => {
            dispatch({
              type,
              payload: {
                pageNum: 1,
                pageSize: PAGE_SIZE,
                ...(!ignoreParams && params),
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
)(GridCompanyTransfer);
