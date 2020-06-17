import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Spin, Drawer } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import Form from '@/jingan-components/Form';
import { Table, EmptyText, Link } from '@/jingan-components/View';
import { connect } from 'dva';
import moment from 'moment';
import { isEqual } from 'lodash';
import { getPageSize, setPageSize } from '@/utils/utils';
import styles from './index.less';
const { Description } = DescriptionList;

const API = 'fireAlarm/fetchCompanyHistories';
const API2 = 'fireAlarm/fetchHistoryDetail';
const API3 = 'fireAlarm/fetchOptions';
const FORMAT = 'YYYY-MM-DD HH:mm:ss';
const TRANSFORM = ({ alertStatus, deviceCode, unitType, specificLocation, range } = {}) => {
  const [startTime, endTime] = range || [];
  return {
    alertStatus,
    deviceCode,
    unitType,
    specificLocation: specificLocation && specificLocation.trim(),
    startTime: startTime && startTime.format('YYYY-MM-DD 00:00:00'),
    endTime: endTime && endTime.format('YYYY-MM-DD 23:59:59'),
  };
};
const STATUSES = [
  { key: '1', value: '火警' },
  { key: '2', value: '故障' },
  { key: '3', value: '联动' },
  { key: '4', value: '监管' },
  { key: '5', value: '屏蔽' },
  { key: '6', value: '反馈' },
];

export default connect(
  ({
    fireAlarm: { deviceCodes, dictDataList, historyData: list, historyDetail },
    loading: {
      effects: { [API]: loading, [API2]: loadingDetail, [API3]: loadingOptions },
    },
  }) => ({
    list,
    loading,
    historyDetail,
    loadingDetail,
    deviceCodes,
    dictDataList,
    loadingOptions,
  }),
  (dispatch, { params }) => ({
    getList(payload, callback) {
      dispatch({
        type: API,
        payload: {
          pageNum: 1,
          pageSize: getPageSize(),
          ...params,
          ...payload,
        },
        callback,
      });
    },
    getDetail(payload, callback) {
      dispatch({
        type: API2,
        payload: {
          ...params,
          ...payload,
        },
        callback,
      });
    },
    getOptions(payload, callback) {
      dispatch({
        type: API3,
        payload: params && params.companyId,
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
        props.list === nextProps.list &&
        props.loading === nextProps.loading &&
        props.historyDetail === nextProps.historyDetail &&
        props.loadingDetail === nextProps.loadingDetail &&
        props.deviceCodes === nextProps.deviceCodes &&
        props.dictDataList === nextProps.dictDataList &&
        props.loadingOptions === nextProps.loadingOptions &&
        isEqual(props.params, nextProps.params)
      );
    },
  }
)(
  ({
    list,
    loading = false,
    getList,
    historyDetail,
    loadingDetail = false,
    getDetail,
    deviceCodes,
    dictDataList,
    loadingOptions = false,
    getOptions,
    params,
  }) => {
    const form = useRef(null);
    const [prevParams, setPrevParams] = useState(undefined);
    const [values, setValues] = useState(undefined);
    const [visible, setVisible] = useState(false);
    useEffect(
      () => {
        if (!isEqual(params, prevParams)) {
          setPrevParams(params);
          getOptions();
          getList(TRANSFORM(values)); // 这里有问题，如果companyId发生变化时，下拉框选中的值应该清除才对
        }
      },
      [params]
    );
    const columns = [
      {
        dataIndex: 'status',
        title: '警情状态',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'createTime',
        title: '发生时间',
        render: value => (value && moment(value).format(FORMAT)) || <EmptyText />,
      },
      {
        dataIndex: 'clientAddr',
        title: '主机编号',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'failureCode',
        title: '回路故障号',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'type',
        title: '设施部件类型',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'installAddress',
        title: '具体位置',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: '操作',
        title: '操作',
        render: (_, { detailId }) => (
          <Link
            onClick={() => {
              getDetail({ detailId });
              setVisible(true);
            }}
          >
            查看
          </Link>
        ),
      },
    ];
    const fields = [
      {
        name: 'alertStatus',
        label: '警情状态',
        component: 'Select',
        props: {
          list: STATUSES,
          allowClear: true,
        },
      },
      {
        name: 'deviceCode',
        label: '主机编号',
        component: 'Select',
        props: {
          list: (deviceCodes || []).map(key => ({ key, value: key })),
          loading: loadingOptions,
          allowClear: true,
        },
      },
      {
        name: 'unitType',
        label: '设施部件类型',
        component: 'Select',
        props: {
          list: dictDataList || [],
          fieldNames: {
            key: 'value',
            value: 'label',
          },
          loading: loadingOptions,
          allowClear: true,
        },
      },
      {
        name: 'specificLocation',
        label: '具体位置',
        component: 'Input',
      },
      {
        name: 'range',
        label: '发生时间',
        component: 'RangePicker',
        props: {
          allowClear: true,
        },
      },
    ];
    return (
      <Fragment>
        <div className={styles.formWrapper}>
          <Form
            ref={form}
            fields={fields}
            onSearch={values => {
              const { pagination: { pageSize = getPageSize() } = {} } = list || {};
              setValues(values);
              getList({
                ...TRANSFORM(values),
                pageSize,
              });
            }}
            onReset={values => {
              const { pagination: { pageSize = getPageSize() } = {} } = list || {};
              setValues(values);
              getList({
                ...TRANSFORM(values),
                pageSize,
              });
            }}
            showCard={false}
          />
        </div>
        <Table
          list={list}
          loading={loading}
          columns={columns}
          onChange={({ current, pageSize }) => {
            const { pagination: { pageSize: prevPageSize } = {} } = list || {};
            getList({
              ...TRANSFORM(values),
              pageNum: pageSize !== prevPageSize ? 1 : current,
              pageSize,
            });
            values ? form.current.setFieldsValue(values) : form.current.resetFields();
            pageSize !== prevPageSize && setPageSize(pageSize);
          }}
          onReload={() => {
            const { pagination: { pageNum = 1, pageSize = getPageSize() } = {} } = list || {};
            getList({
              ...TRANSFORM(values),
              pageNum,
              pageSize,
            });
            values ? form.current.setFieldsValue(values) : form.current.resetFields();
          }}
          showAddButton={false}
          showCard={{
            bordered: false,
          }}
          rowKey="detailId"
        />
        <Drawer
          title="详情信息"
          onClose={() => setVisible(false)}
          visible={visible}
          width={512}
          zIndex={1009}
        >
          <Spin spinning={loadingDetail}>
            <DescriptionList col={1}>
              {[
                { key: '单位名称', value: 'name' },
                {
                  key: '发生时间',
                  value({ time }) {
                    return time && moment(time).format(FORMAT);
                  },
                },
                { key: '主机编号', value: 'code' },
                { key: '回路故障号', value: 'failureCode' },
                { key: '设施部件类型', value: 'type' },
                { key: '具体位置', value: 'position' },
                { key: '警情状态', value: 'alarmStatus' },
                { key: '安全管理员', value: 'safetyName' },
                { key: '联系电话', value: 'safetyPhone' },
              ].map(({ key, value }) => (
                <Description term={key} key={key}>
                  {(historyDetail &&
                    (typeof value === 'function'
                      ? value(historyDetail)
                      : historyDetail[value])) || <EmptyText />}
                </Description>
              ))}
            </DescriptionList>
          </Spin>
        </Drawer>
      </Fragment>
    );
  }
);
