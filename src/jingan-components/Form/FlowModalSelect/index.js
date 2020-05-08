import React, { useState, useMemo, useRef, useEffect, Fragment } from 'react';
import { Modal, Button, Popconfirm, Checkbox, message } from 'antd';
import Form from '@/jingan-components/Form';
import Upload from '@/jingan-components/Form/Upload';
import { Table, EmptyText } from '@/jingan-components/View';
import { connect } from 'dva';
import { getModalPageSize, setModalPageSize, isObject } from '@/utils/utils';
import styles from './index.less';

const API = 'common/getFlowList';
const API2 = 'common/getExaminationContentList';
const TRANSFORM = ({ object_title, industry, business_type }) => {
  return {
    object_title: object_title && object_title.trim(),
    industry,
    business_type,
  };
};

const FlowModalSelect = ({
  mode,
  value,
  onChange,
  list,
  getList,
  loading,
  getData,
  initializing,
  empty = <EmptyText />,
  type,
  col,
  operationCol,
  data: initialData,
  showImport,
}) => {
  const form = useRef(null);
  const [data, setData] = useState(initialData);
  const [importing, setImporting] = useState(false);
  const [modal, setModal] = useState({
    visible: false,
    values: {},
    initialValues: {},
    selectedRows: [],
    expandedRowKeys: [],
  });
  const { visible, values, initialValues, selectedRows, expandedRowKeys } = modal;
  const [selectedDeleteRows, setSelectedDeleteRows] = useState([]);
  const selectedRowKeys = useMemo(
    () => {
      return selectedRows.map(({ flow_id }) => flow_id);
    },
    [selectedRows]
  );
  const parentSelectAllProps = useMemo(
    () => {
      const { list: rows = [] } = list || {};
      const { allChecked, someChecked, allDisabled } = rows.reduce(
        (result, { flows }) => {
          if (flows && flows.length) {
            result.allDisabled = false;
            const { allChecked, someChecked } = flows.reduce(
              (result, { flow_id }) => {
                if (selectedRowKeys.includes(flow_id)) {
                  result.someChecked = true;
                } else {
                  result.allChecked = false;
                }
                return result;
              },
              {
                allChecked: true,
                someChecked: false,
              }
            );
            if (!allChecked) {
              result.allChecked = false;
            }
            if (someChecked) {
              result.someChecked = true;
            }
          }
          return result;
        },
        {
          allChecked: true,
          someChecked: false,
          allDisabled: true,
        }
      );
      return {
        checked: !allDisabled && allChecked,
        indeterminate: !allChecked && someChecked,
        disabled: allDisabled,
        onChange({ target: { checked: selected } }) {
          const changeRows = rows.reduce(
            (result, { flows, object_id, object_title, industry, business_type }) => {
              return result.concat(
                flows && flows.length
                  ? selected
                    ? flows.map(item => ({
                        ...item,
                        object_id,
                        object_title,
                        industry,
                        business_type,
                      }))
                    : flows
                  : []
              );
            },
            []
          );
          setModal(modal => ({
            ...modal,
            selectedRows: selected
              ? changeRows.reduce((result, record) => {
                  if (!modal.selectedRows.find(({ flow_id }) => flow_id === record.flow_id)) {
                    result = result.concat(record);
                  }
                  return result;
                }, modal.selectedRows)
              : modal.selectedRows.filter(
                  ({ flow_id }) => !changeRows.find(record => flow_id === record.flow_id)
                ),
          }));
        },
      };
    },
    [list, selectedRowKeys]
  );
  const parentSelectedRowKeys = useMemo(
    () => {
      const { list: rows = [] } = list || {};
      return rows.reduce((result, { object_id, flows }) => {
        if (
          flows &&
          flows.length &&
          flows.every(({ flow_id }) => selectedRowKeys.includes(flow_id))
        ) {
          result.push(object_id);
        }
        return result;
      }, []);
    },
    [list, selectedRowKeys]
  );
  const selectedDeleteRowKeys = useMemo(
    () => {
      return selectedDeleteRows.map(({ flow_id }) => flow_id);
    },
    [selectedDeleteRows]
  );
  useEffect(
    () => {
      if (value && value.length /* 如果value存在时 */) {
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
            setData(initialData);
          } else {
            /* 从后台筛选 */
            getData(
              {
                ids: value.join(','),
                pageSize: value.length,
              },
              (success, array) => {
                const list = isObject(array) ? array.list : array;
                const data = value.reduce((result, key) => {
                  const item = (list || []).find(item => item.flow_id === key);
                  if (item) {
                    result.push(item);
                  }
                  return result;
                }, []);
                setData(data);
              }
            );
          }
        }
      } else if (data && data.length /* 如果value不存在但data存在时 */) {
        setData(undefined);
      }
    },
    [value]
  );
  useEffect(
    () => {
      if (data !== initialData) {
        if (data && data.length) {
          if (
            !value ||
            value.length !== data.length ||
            value.some((key, index) => data[index].flow_id !== key)
          ) {
            onChange(data.map(({ flow_id }) => flow_id));
          }
        } else if (value && value.length) {
          onChange(undefined);
        }
      }
    },
    [data]
  );
  const onSearch = values => {
    setModal(modal => ({
      ...modal,
      values,
    }));
    getList(TRANSFORM(values));
  };
  const COLUMNS = [
    {
      dataIndex: 'object_title',
      title: '检查项名称',
    },
    {
      dataIndex: 'industry',
      title: '所属行业',
    },
    ...(type >= 3
      ? [
          {
            dataIndex: 'business_type',
            title: '业务分类',
          },
        ]
      : []),
  ];
  const COLUMNS2 = [
    {
      dataIndex: 'flow_name',
      title: '检查内容',
    },
    {
      dataIndex: 'danger_level',
      title: '隐患等级',
    },
  ];
  const FIELDS = [
    {
      name: 'object_title',
      label: '检查项名称',
      component: 'Input',
      col,
    },
    {
      name: 'industry',
      label: '所属行业',
      component: 'Select',
      props: {
        preset: 'industry',
        params: type
          ? {
              type,
            }
          : undefined,
        allowClear: true,
      },
      col,
    },
    ...(type >= 3
      ? [
          {
            name: 'business_type',
            label: '业务分类',
            component: 'Select',
            props: {
              preset: 'businessType',
              allowClear: true,
            },
            col,
          },
        ]
      : []),
  ];
  if (mode !== 'detail') {
    return (
      <div>
        <div className={styles.buttonContainer}>
          <div className={styles.buttonWrapper}>
            <Button
              type="primary"
              onClick={() => {
                setModal({
                  visible: true,
                  values: {},
                  initialValues: {},
                  selectedRows: data || [],
                  expandedRowKeys: [],
                });
                getList();
              }}
            >
              新增
            </Button>
          </div>
          <div className={styles.buttonWrapper}>
            <Popconfirm
              title="您确定要删除吗?"
              onConfirm={() => {
                const nextData = data.filter(item => !selectedDeleteRows.includes(item));
                setData(nextData);
                setSelectedDeleteRows([]);
              }}
              disabled={!selectedDeleteRows.length}
            >
              <Button type="primary" disabled={!selectedDeleteRows.length}>
                删除
              </Button>
            </Popconfirm>
          </div>
          {showImport && (
            <Fragment>
              <div className={styles.buttonWrapper}>
                <Button
                  className={styles.link}
                  type="link"
                  href="http://data.jingan-china.cn/v2/chem/file/%E6%A0%87%E7%AD%BE%E5%8D%A1%E6%A8%A1%E6%9D%BF.xls"
                  target="_blank"
                >
                  下载模板
                </Button>
              </div>
              <div className={styles.buttonWrapper}>
                <Upload /* action="/acloud_new/v2/hiddenDangerDataBase/hiddenPerilsData/import" */>
                  <Button className={styles.link} type="link" loading={importing}>
                    导入
                  </Button>
                </Upload>
              </div>
            </Fragment>
          )}
        </div>
        <Table
          columns={COLUMNS.concat(COLUMNS2)}
          rowKey={({ flow_id }) => flow_id}
          list={{ list: data }}
          loading={initializing}
          rowSelection={{
            fixed: true,
            selectedRowKeys: selectedDeleteRowKeys,
            onSelect(record, selected) {
              setSelectedDeleteRows(
                selectedDeleteRows =>
                  selected
                    ? selectedDeleteRows.concat(record)
                    : selectedDeleteRows.filter(item => item !== record)
              );
            },
            onSelectAll(selected) {
              setSelectedDeleteRows(selected ? data : []);
            },
          }}
          size="small"
          showPagination={false}
          showCard={false}
        />
        <Modal
          title="新增检查内容"
          visible={visible}
          onCancel={() => {
            setModal(modal => ({
              ...modal,
              visible: false,
            }));
          }}
          zIndex={1009}
          width="60%"
          footer={null}
        >
          <Form
            ref={form}
            className={styles.form}
            initialValues={initialValues}
            fields={FIELDS}
            onSearch={onSearch}
            onReset={onSearch}
            operation={[
              <Button
                type="primary"
                disabled={!selectedRows.length}
                onClick={() => {
                  setData(selectedRows);
                  setModal(modal => ({
                    ...modal,
                    visible: false,
                  }));
                }}
              >
                选择
              </Button>,
            ]}
            showCard={false}
            expandable={false}
            operationCol={operationCol}
          />
          <Table
            columns={COLUMNS}
            rowKey={({ object_id }) => object_id}
            list={list}
            loading={loading}
            onChange={({ current, pageSize }) => {
              const {
                pagination: { pageSize: prevPageSize },
              } = list;
              getList({
                ...TRANSFORM(values),
                pageNum: pageSize !== prevPageSize ? 1 : current,
                pageSize,
              });
              values ? form.current.setFieldsValue(values) : form.current.resetFields();
              pageSize !== prevPageSize && setModalPageSize(pageSize);
              setModal(modal => ({
                ...modal,
                expandedRowKeys: [],
              }));
            }}
            rowSelection={{
              fixed: true,
              getCheckboxProps({ flows }) {
                const disabled = !flows || !flows.length;
                let indeterminate = false;
                if (!disabled) {
                  const filteredFlows = flows.filter(({ flow_id }) =>
                    selectedRowKeys.includes(flow_id)
                  );
                  indeterminate = filteredFlows.length > 0 && filteredFlows.length < flows.length;
                }
                return { disabled: disabled, indeterminate };
              },
              selectedRowKeys: parentSelectedRowKeys,
              onSelect(record, selected) {
                const { flows, object_id, object_title, industry, business_type } = record;
                const changeRows = selected
                  ? flows.map(item => ({
                      ...item,
                      object_id,
                      object_title,
                      industry,
                      business_type,
                    }))
                  : flows;
                setModal(modal => ({
                  ...modal,
                  selectedRows: selected
                    ? changeRows.reduce((result, record) => {
                        if (!modal.selectedRows.find(({ flow_id }) => flow_id === record.flow_id)) {
                          result = result.concat(record);
                        }
                        return result;
                      }, modal.selectedRows)
                    : modal.selectedRows.filter(
                        ({ flow_id }) => !changeRows.find(record => flow_id === record.flow_id)
                      ),
                }));
              },
              onSelectAll(selected, selectedRows, changeRows) {
                changeRows = changeRows.reduce(
                  (result, { flows, object_id, object_title, industry, business_type }) => {
                    return result.concat(
                      selected
                        ? flows.map(item => ({
                            ...item,
                            object_id,
                            object_title,
                            industry,
                            business_type,
                          }))
                        : flows
                    );
                  },
                  []
                );
                setModal(modal => ({
                  ...modal,
                  selectedRows: selected
                    ? changeRows.reduce((result, record) => {
                        if (!modal.selectedRows.find(({ flow_id }) => flow_id === record.flow_id)) {
                          result = result.concat(record);
                        }
                        return result;
                      }, modal.selectedRows)
                    : modal.selectedRows.filter(
                        ({ flow_id }) => !changeRows.find(record => flow_id === record.flow_id)
                      ),
                }));
              },
              columnTitle: <Checkbox {...parentSelectAllProps} />,
            }}
            expandable={{
              expandedRowRender: ({ flows, object_id, object_title, industry, business_type }) => {
                return (
                  flows &&
                  flows.length > 0 && (
                    <Table
                      className={styles.childTable}
                      columns={COLUMNS2}
                      rowKey={({ flow_id }) => flow_id}
                      list={{ list: flows }}
                      rowSelection={{
                        fixed: true,
                        selectedRowKeys,
                        onSelect(record, selected) {
                          setModal(modal => ({
                            ...modal,
                            selectedRows: selected
                              ? modal.selectedRows.concat({
                                  ...record,
                                  object_id,
                                  object_title,
                                  industry,
                                  business_type,
                                })
                              : modal.selectedRows.filter(
                                  ({ flow_id }) => flow_id !== record.flow_id
                                ),
                          }));
                        },
                        onSelectAll(selected, selectedRows, changeRows) {
                          setModal(modal => ({
                            ...modal,
                            selectedRows: selected
                              ? changeRows.reduce((result, record) => {
                                  if (
                                    !modal.selectedRows.find(
                                      ({ flow_id }) => flow_id === record.flow_id
                                    )
                                  ) {
                                    result = result.concat({
                                      ...record,
                                      object_id,
                                      object_title,
                                      industry,
                                      business_type,
                                    });
                                  }
                                  return result;
                                }, modal.selectedRows)
                              : modal.selectedRows.filter(
                                  ({ flow_id }) =>
                                    !changeRows.find(record => flow_id === record.flow_id)
                                ),
                          }));
                        },
                      }}
                      showPagination={false}
                      showCard={false}
                    />
                  )
                );
              },
              rowExpandable: ({ flows }) => !!(flows && flows.length),
              expandedRowKeys,
              onExpand(expanded, { object_id }) {
                setModal(modal => ({
                  ...modal,
                  expandedRowKeys: expanded
                    ? modal.expandedRowKeys.concat(object_id)
                    : modal.expandedRowKeys.filter(item => item !== object_id),
                }));
              },
            }}
            showCard={false}
          />
        </Modal>
      </div>
    );
  } else {
    return data && data.length ? (
      <Table
        columns={COLUMNS.concat(COLUMNS2)}
        rowKey={({ flow_id }) => flow_id}
        list={{ list: data }}
        loading={initializing}
        size="small"
        showPagination={false}
        showCard={false}
      />
    ) : (
      empty
    );
  }
};

FlowModalSelect.getRules = ({ label }) => {
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
    common: { flowList: list },
    loading: {
      effects: { [API]: loading, [API2]: initializing },
    },
  }) => {
    return {
      list,
      loading,
      initializing,
    };
  },
  (dispatch, { type }) => ({
    getList(payload, callback) {
      dispatch({
        type: API,
        payload: {
          pageNum: 1,
          pageSize: getModalPageSize(),
          industryType: type,
          ...payload,
        },
        callback,
      });
    },
    getData(payload, callback) {
      dispatch({
        type: API2,
        payload: {
          pageNum: 1,
          pageSize: getModalPageSize(),
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
        props.mode === nextProps.mode
      );
    },
  }
)(FlowModalSelect);
