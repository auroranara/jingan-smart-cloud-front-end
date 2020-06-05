import React, { Fragment, useState, useEffect, useRef, useMemo } from 'react';
import { Modal, Button, Popconfirm } from 'antd';
import Form, { InputNumber } from '@/jingan-components/Form';
import { EmptyText, Table, TextAreaEllipsis } from '@/jingan-components/View';
import { connect } from 'dva';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import { isNumber } from '@/utils/utils';
import { CLASSIFICATIONS } from '../../../PerformanceMeasurement/config';
import styles from './index.less';

const LENGTH = 10;
const COL = {
  xxl: 8,
  xl: 8,
  lg: 12,
  md: 12,
  sm: 24,
  xs: 24,
};
const MAPPER = {
  namespace: 'common',
  list: 'performanceMeasurementStandardList',
  getList: 'getPerformanceMeasurementStandardList',
};
const FIELDS = [
  {
    name: 'standardTitle',
    label: '标准标题',
    component: 'Input',
    props: {
      allowClear: true,
    },
    col: COL,
  },
  {
    name: 'standardType',
    label: '标准分类',
    component: 'Select',
    props: {
      list: CLASSIFICATIONS,
      allowClear: true,
    },
    col: COL,
  },
];
const TRANSFORM = ({ standardTitle, standardType }) => {
  return {
    standardTitle: standardTitle && standardTitle.trim(),
    standardType,
  };
};
const COLUMNS = [
  {
    dataIndex: 'standardTitle',
    title: '标准标题',
    render: value => <TextAreaEllipsis value={value} />,
  },
  {
    dataIndex: 'standardType',
    title: '标准分类',
    render: value =>
      (CLASSIFICATIONS.find(item => item.key === `${value}`) || {}).value || <EmptyText />,
  },
  {
    dataIndex: 'examProject',
    title: '考核项目',
    render: value => value || <EmptyText />,
  },
  {
    dataIndex: 'passScore',
    title: '合格分数（分）',
    render: value => (isNumber(value) ? value : <EmptyText />),
  },
];

const Standard = ({ mode, value, onChange, list, loading, getList, params, empty }) => {
  const form = useRef(null);
  const [prevParams, setPrevParams] = useState(params);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modal, setModal] = useState({
    visible: false,
    values: undefined,
    selectedRows: [],
  });
  const { visible, values, selectedRows } = modal;
  const length = useMemo(
    () => {
      return value
        ? value.reduce(
            (result, { contentList }) => result + ((contentList && contentList.length) || 1),
            0
          )
        : 0;
    },
    [value]
  );
  // 当params发生变化时，重置value
  useEffect(
    () => {
      if (!isEqual(params, prevParams)) {
        setPrevParams(params);
        if (value && value.length) {
          onChange && onChange();
        }
      }
    },
    [params]
  );
  if (mode !== 'detail') {
    const columns = [
      {
        dataIndex: 'standardTitle',
        title: '标准标题',
        render: value => <TextAreaEllipsis value={value} />,
      },
      {
        dataIndex: '考核项目',
        title: '考核项目',
        render: (_, { examProject, passScore }) => (
          <Fragment>
            {examProject || <EmptyText />}
            {isNumber(passScore) ? `（${passScore}分）` : <EmptyText />}
          </Fragment>
        ),
      },
      {
        dataIndex: '考核内容',
        title: '考核内容',
        render: (_, { contentList }) =>
          contentList && contentList.length ? (
            <div className={styles.contentContainer}>
              {contentList.map(item => (
                <div className={styles.contentWrapper} key={item.id}>
                  <TextAreaEllipsis value={item.examContent} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: '评定标准',
        title: '评定标准',
        render: (_, { contentList }) =>
          contentList && contentList.length ? (
            <div className={styles.contentContainer}>
              {contentList.map(item => (
                <div className={styles.contentWrapper} key={item.id}>
                  <TextAreaEllipsis value={item.estimateNorm} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: '扣分情况（分）',
        title: '扣分情况（分）',
        render: (_, { contentList, passScore }, index) =>
          contentList && contentList.length ? (
            <div className={styles.contentContainer}>
              {contentList.map((item, i) => {
                // 非当前修改值应该不可能是负值或越界值（然而现实往往打脸）
                // 总值减去其他已填值以后的剩余值
                const rest =
                  (passScore || 0) -
                  contentList.reduce(
                    (result, { pointCase }, k) =>
                      i !== k && isNumber(pointCase) ? result + Math.max(pointCase, 0) : result,
                    0
                  );
                const currentValue = isNumber(item.pointCase) ? Math.max(item.pointCase, 0) : 0;
                return (
                  <div
                    className={classNames(styles.contentWrapper, styles.inputNumberWrapper)}
                    key={item.id}
                  >
                    <InputNumber
                      placeholder=""
                      value={item.pointCase}
                      onChange={pointCase =>
                        onChange &&
                        onChange(
                          value.map(
                            (item, index2) =>
                              index === index2
                                ? {
                                    ...item,
                                    contentList: item.contentList.map(
                                      (item, j) =>
                                        i === j
                                          ? { ...item, pointCase, changed: true }
                                          : { ...item, changed: false }
                                    ),
                                  }
                                : item
                          )
                        )
                      }
                      min={0}
                      max={
                        item.changed
                          ? rest < 0
                            ? currentValue > (passScore || 0)
                              ? 0
                              : currentValue
                            : rest
                          : Math.min(Math.max(rest, currentValue), passScore || 0)
                      }
                      precision={0}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyText />
          ),
      },
    ];
    const onSearch = values => {
      setModal(modal => ({
        ...modal,
        values,
      }));
      getList && getList(TRANSFORM(values));
    };
    return (
      <div className={styles.container}>
        <div className={styles.buttonContainer}>
          <div className={styles.buttonWrapper}>
            <Button
              type="primary"
              onClick={() => {
                setModal({
                  visible: true,
                  values: undefined,
                  selectedRows: value || [],
                });
                getList && getList();
              }}
            >
              新增
            </Button>
          </div>
          <div className={styles.buttonWrapper}>
            <Popconfirm
              title="您确定要删除吗?"
              onConfirm={() => {
                onChange && onChange(value.filter(item => !selectedRowKeys.includes(item.id)));
                setSelectedRowKeys([]);
              }}
              disabled={!selectedRowKeys.length}
            >
              <Button type="primary" disabled={!selectedRowKeys.length}>
                删除
              </Button>
            </Popconfirm>
          </div>
        </div>
        <Table
          columns={columns}
          rowKey="id"
          list={{ list: value }}
          size="small"
          scroll={
            length > LENGTH && {
              y: 39 * LENGTH,
              scrollToFirstRowOnChange: true,
            }
          }
          rowSelection={{
            fixed: true,
            selectedRowKeys,
            onChange(selectedRowKeys) {
              setSelectedRowKeys(selectedRowKeys);
            },
          }}
          showCard={false}
          showPagination={false}
        />
        <Modal
          title="新增考核内容"
          visible={visible}
          onCancel={() =>
            setModal(modal => ({
              ...modal,
              visible: false,
            }))
          }
          width="60%"
          zIndex={1009}
          footer={null}
          destroyOnClose
        >
          <Form
            ref={form}
            fields={FIELDS}
            onSearch={onSearch}
            onReset={onSearch}
            operation={[
              <Button
                type="primary"
                disabled={!selectedRows.length}
                onClick={() => {
                  onChange && onChange(selectedRows);
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
            operationCol={COL}
          />
          <Table
            columns={COLUMNS}
            rowKey="id"
            list={list}
            loading={loading}
            onChange={({ current, pageSize }) => {
              const {
                pagination: { pageSize: prevPageSize },
              } = list;
              getList &&
                getList({
                  pageNum: pageSize !== prevPageSize ? 1 : current,
                  pageSize,
                  ...TRANSFORM(values || {}),
                });
              form.current.setFieldsValue(
                values ||
                  FIELDS.reduce((result, { name }) => ({ ...result, [name]: undefined }), {})
              );
            }}
            rowSelection={{
              fixed: true,
              getCheckboxProps(record) {
                return {
                  disabled: !(record.contentList && record.contentList.length),
                };
              },
              selectedRowKeys: selectedRows.map(item => item.id),
              onSelect(record, selected) {
                setModal(modal => ({
                  ...modal,
                  selectedRows: selected
                    ? modal.selectedRows.concat(record)
                    : modal.selectedRows.filter(item => item.id !== record.id),
                }));
              },
              onSelectAll(selected, selectedRows, changeRows) {
                setModal(modal => ({
                  ...modal,
                  selectedRows: selected
                    ? modal.selectedRows
                        .filter(item => changeRows.every(record => item.id !== record.id))
                        .concat(changeRows)
                    : modal.selectedRows.filter(item =>
                        changeRows.every(record => item.id !== record.id)
                      ),
                }));
              },
            }}
            showCard={false}
          />
        </Modal>
      </div>
    );
  } else {
    const columns = [
      {
        dataIndex: 'standardTitle',
        title: '标准标题',
        render: value => <TextAreaEllipsis value={value} />,
      },
      {
        dataIndex: '考核项目',
        title: '考核项目',
        render: (_, { examProject, passScore }) => (
          <Fragment>
            {examProject || <EmptyText />}
            {isNumber(passScore) ? `（${passScore}分）` : <EmptyText />}
          </Fragment>
        ),
      },
      {
        dataIndex: '考核内容',
        title: '考核内容',
        render: (_, { contentList }) =>
          contentList && contentList.length ? (
            <div className={styles.contentContainer}>
              {contentList.map(item => (
                <div className={styles.contentWrapper} key={item.id}>
                  <TextAreaEllipsis value={item.examContent} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: '评定标准',
        title: '评定标准',
        render: (_, { contentList }) =>
          contentList && contentList.length ? (
            <div className={styles.contentContainer}>
              {contentList.map(item => (
                <div className={styles.contentWrapper} key={item.id}>
                  <TextAreaEllipsis value={item.estimateNorm} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: '扣分情况（分）',
        title: '扣分情况（分）',
        render: (_, { contentList }) =>
          contentList && contentList.length ? (
            <div className={styles.contentContainer}>
              {contentList.map(item => (
                <div className={styles.contentWrapper} key={item.id}>
                  {isNumber(item.pointCase) ? item.pointCase : <EmptyText />}
                </div>
              ))}
            </div>
          ) : (
            <EmptyText />
          ),
      },
    ];
    return length ? (
      <Table
        columns={columns}
        rowKey="id"
        list={{ list: value }}
        size="small"
        scroll={
          length > LENGTH && {
            y: 39 * LENGTH,
            scrollToFirstRowOnChange: true,
          }
        }
        showCard={false}
        showPagination={false}
      />
    ) : empty === undefined ? (
      <EmptyText />
    ) : (
      empty
    );
  }
};

Standard.getRules = ({ label }) => {
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
  (stateProps, { dispatch }, { params, ...ownProps }) => {
    const { namespace, list, getList } = MAPPER;
    const valid = !params || Object.values(params).every(v => v);
    const type = `${namespace}/${getList}`;
    return {
      ...ownProps,
      params,
      list: valid ? stateProps[namespace][list] : undefined,
      loading: stateProps.loading.effects[type] || false,
      getList: valid
        ? (payload, callback) => {
            dispatch({
              type,
              payload: {
                pageNum: 1,
                pageSize: 10,
                ...params,
                ...payload,
              },
              callback,
            });
          }
        : undefined,
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
)(Standard);
