import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Transfer, Button } from 'antd';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Input, Select } from '@/jingan-components/Form';
import { Table, EmptyText } from '@/jingan-components/View';
import { connect } from 'dva';
import { isEqual } from 'lodash';
import classNames from 'classnames';
import { isObject } from '@/utils/utils';
import styles from './index.less';

const API = 'common/getExaminationContentList';
const PAGE_SIZE = 5;
const FILTER_VALUES = {
  object_title: {
    value: undefined,
    prevValue: undefined,
    visible: false,
  },
  industry: {
    value: undefined,
    prevValue: undefined,
    visible: false,
  },
  business_type: {
    value: undefined,
    prevValue: undefined,
    visible: false,
  },
  flow_name: {
    value: undefined,
    prevValue: undefined,
    visible: false,
  },
  danger_level: {
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
const FILTER_DATA = (
  data,
  { object_title, industry, business_type, flow_name, danger_level } = {}
) => {
  const list = (data || []).filter(
    item =>
      (!object_title || item.object_title.includes(object_title)) &&
      (!industry || item.industry.includes(industry)) &&
      (!business_type || item.business_type.includes(business_type)) &&
      (!flow_name || item.flow_name.includes(flow_name)) &&
      (!danger_level || item.danger_level.includes(danger_level))
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

const ExaminationContentTransfer = props => {
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
    type,
    ...rest
  } = props;
  const COLUMNS = [
    {
      dataIndex: 'object_title',
      title: '检查项名称',
      render: value => <div style={{ minWidth: 70 }}>{value || <EmptyText />}</div>,
    },
    {
      dataIndex: 'industry',
      title: '所属行业',
      render: value => <div style={{ minWidth: 56 }}>{value || <EmptyText />}</div>,
    },
    ...(type >= 3
      ? [
          {
            dataIndex: 'business_type',
            title: '业务分类',
            render: value => <div style={{ minWidth: 56 }}>{value || <EmptyText />}</div>,
          },
        ]
      : []),
    {
      dataIndex: 'flow_name',
      title: '检查内容',
      render: value => <div style={{ minWidth: 56 }}>{value || <EmptyText />}</div>,
    },
    {
      dataIndex: 'danger_level',
      title: '隐患等级',
      render: value => <div style={{ minWidth: 56 }}>{value || <EmptyText />}</div>,
    },
  ];
  const [state, setState] = useState({
    ...STATE,
    data: initialData,
  });
  const [prevParams, setPrevParams] = useState(params);
  const inputRef = useRef(null);
  const {
    data,
    filteredData,
    sourceSelectedList,
    targetSelectedList,
    length,
    leftFilter,
    rightFilter,
  } = state;
  const leftSelectedRowKeys = useMemo(
    () => {
      return (sourceSelectedList || []).concat(data || []).map(({ flow_id }) => flow_id);
    },
    [sourceSelectedList, data]
  );
  const dataSource = useMemo(
    () => {
      return (sourceSelectedList || []).concat(data || []).concat(
        [...Array(Math.max(0, (length || 0) - leftSelectedRowKeys.length)).keys()].map(flow_id => ({
          flow_id: `${flow_id}`,
        }))
      );
    },
    [leftSelectedRowKeys, length]
  );
  const rightSelectedRowKeys = useMemo(
    () => {
      return (targetSelectedList || []).map(({ flow_id }) => flow_id);
    },
    [targetSelectedList]
  );
  const selectedKeys = useMemo(
    () => {
      return (sourceSelectedList || [])
        .concat(targetSelectedList || [])
        .map(({ flow_id }) => flow_id);
    },
    [sourceSelectedList, targetSelectedList]
  );
  const targetKeys = useMemo(
    () => {
      return (data || []).map(({ flow_id }) => flow_id);
    },
    [data]
  );
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
          [key]: value && (isObject(value) ? value.key : value.trim()),
        }),
        {}
      );
    },
    [leftFilter]
  );
  const rightFilterParams = useMemo(
    () => {
      return Object.entries(rightFilter).reduce(
        (result, [key, { value }]) => ({
          ...result,
          [key]: value && (isObject(value) ? value.label : value.trim()),
        }),
        {}
      );
    },
    [rightFilter]
  );
  const getColumnSearchProps = (direction, dataIndex) => {
    if (['object_title', 'industry', 'business_type'].includes(dataIndex)) {
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
              {dataIndex === 'object_title' ? (
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
              ) : (
                <Select
                  className={styles.input}
                  preset={{ business_type: 'businessType', industry: 'industry' }[dataIndex]}
                  value={value}
                  params={
                    dataIndex === 'industry' &&
                    type && {
                      type,
                    }
                  }
                  onChange={value =>
                    setState(state => ({
                      ...state,
                      [`${direction}Filter`]: {
                        ...state[`${direction}Filter`],
                        [dataIndex]: { ...state[`${direction}Filter`][dataIndex], value },
                      },
                    }))
                  }
                  labelInValue
                  allowClear
                />
              )}
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
            // 当有新条件时这里需要改动
            if (dataIndex === 'object_title') {
              setTimeout(() => inputRef.current.select());
            }
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
    }
  };
  useEffect(() => {
    if (
      !value ||
      !value.length /* value不存在 */ ||
      (data &&
        data.length === value.length &&
        value.every((key, index) => data[index].flow_id === key)) /* value和data一一对应 */
    ) {
      getList && getList(undefined, setLength);
    }
  }, []);
  useEffect(
    () => {
      if (value && value.length /* value存在时 */) {
        const callback = (success, array) => {
          const list = array && array.list;
          const data = value.map(key => {
            const item = (list || []).find(item => item.flow_id === key);
            return (
              item || {
                flow_id: key,
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
            (key, index) => data[index].flow_id !== key
          ) /* data不存在，或者value和data不一一对应时 */
        ) {
          if (
            initialData &&
            initialData.length === value.length &&
            value.every(
              (key, index) => initialData[index].flow_id === key
            ) /* value和initialData一一对应时 */
          ) {
            setState(state => ({
              ...state,
              ...STATE,
              data: initialData,
              filteredData: FILTER_DATA(initialData),
            }));
            getList && getList(undefined, setLength);
          } else if (
            list &&
            value.every(key =>
              list.find(item => item.flow_id === key)
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
  useEffect(
    () => {
      if (!isEqual(params, prevParams)) {
        setPrevParams(params);
        getList && getList(undefined, setLength);
      }
    },
    [params]
  );
  useEffect(
    () => {
      if (data !== initialData) {
        onChange && onChange(data && data.map(({ flow_id }) => flow_id));
      }
    },
    [data]
  );
  if (mode !== 'detail') {
    return (
      <Transfer
        {...rest}
        className={classNames(styles.container, className)}
        rowKey={({ flow_id, object_id }) => flow_id || object_id}
        showSelectAll={false}
        dataSource={dataSource}
        selectedKeys={selectedKeys}
        targetKeys={targetKeys}
        onChange={(targetKeys, direction) => {
          setState(state => {
            const data =
              direction === 'left'
                ? state.data.filter(
                    ({ flow_id }) =>
                      !state.targetSelectedList.find(item => item.flow_id === flow_id)
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
                      getCheckboxProps: ({ flow_id }) => ({
                        disabled: disabled || !!(data || []).find(item => item.flow_id === flow_id),
                      }),
                      selectedRowKeys: leftSelectedRowKeys,
                      onSelect: (record, selected) => {
                        setState(state => ({
                          ...state,
                          sourceSelectedList: selected
                            ? (state.sourceSelectedList || []).concat(record)
                            : state.sourceSelectedList.filter(
                                ({ flow_id }) => flow_id !== record.flow_id
                              ),
                        }));
                      },
                      onSelectAll: (selected, selectedRows, changedRows) => {
                        setState(state => ({
                          ...state,
                          sourceSelectedList: selected
                            ? changedRows.reduce((result, item) => {
                                if (!result.find(({ flow_id }) => item.flow_id === flow_id)) {
                                  result = result.concat(item);
                                }
                                return result;
                              }, state.sourceSelectedList || [])
                            : state.sourceSelectedList.filter(
                                ({ flow_id }) => !changedRows.find(item => item.flow_id === flow_id)
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
                                ({ flow_id }) => flow_id !== record.flow_id
                              ),
                        }));
                      },
                      onSelectAll: (selected, selectedRows, changedRows) => {
                        setState(state => ({
                          ...state,
                          targetSelectedList: selected
                            ? changedRows.reduce((result, item) => {
                                if (!result.find(({ flow_id }) => item.flow_id === flow_id)) {
                                  result = result.concat(item);
                                }
                                return result;
                              }, state.targetSelectedList || [])
                            : state.targetSelectedList.filter(
                                ({ flow_id }) => !changedRows.find(item => item.flow_id === flow_id)
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
              rowKey={({ flow_id, object_id }) => flow_id || object_id}
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
        pagination={PAGINATION}
        onChange={({ current }) => {
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
        }}
        rowKey={({ flow_id, object_id }) => flow_id || object_id}
        showCard={false}
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

ExaminationContentTransfer.getRules = ({ label }) => {
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
  ({
    common: { examinationContentList: list },
    loading: {
      effects: { [API]: loading },
    },
  }) => {
    return {
      list,
      loading,
    };
  },
  (dispatch, { params, type }) => ({
    getList(payload, callback, ignoreParams) {
      dispatch({
        type: API,
        payload: {
          pageNum: 1,
          pageSize: PAGE_SIZE,
          type,
          ...(!ignoreParams && params),
          ...payload,
        },
        callback,
      });
    },
  }),
  (stateProps, dispatchProps, ownProps) => ({
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
)(ExaminationContentTransfer);
