import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { Card, Spin, Drawer } from 'antd';
import { Table, Link, EmptyText } from '@/jingan-components/View';
import DescriptionList from '@/components/DescriptionList';
import { connect } from 'dva';
import moment from 'moment';
import { isEqual } from 'lodash';
import { getPageSize, setPageSize } from '@/utils/utils';
import styles from './index.less';
const { Description } = DescriptionList;

const API = 'fireAlarm/fetchAlarmData';
const API2 = 'fireAlarm/fetchAlarmDetail';
const TABS = [
  { key: 'fire', value: '火警' },
  { key: 'fault', value: '故障' },
  { key: 'start', value: '联动' },
  { key: 'supervise', value: '监管' },
  { key: 'shield', value: '屏蔽' },
  { key: 'feedback', value: '反馈' },
];
const FORMAT = 'YYYY-MM-DD HH:mm:ss';

export default connect(
  ({
    fireAlarm: { tableLists: list, alarmDetail },
    loading: {
      effects: { [API]: loading, [API2]: loadingDetail },
    },
  }) => ({
    list,
    loading,
    alarmDetail,
    loadingDetail,
  }),
  (dispatch, { params }) => ({
    getList(payload, callback) {
      dispatch({
        type: API,
        payload: params && params.companyId,
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
        props.alarmDetail === nextProps.alarmDetail &&
        props.loadingDetail === nextProps.loadingDetail &&
        isEqual(props.params, nextProps.params)
      );
    },
  }
)(({ list, loading = false, getList, alarmDetail, loadingDetail = false, getDetail, params }) => {
  const [prevParams, setPrevParams] = useState(undefined);
  const [activeTabKey, setActiveTabKey] = useState(TABS[0].key);
  const [data, setData] = useState(undefined);
  const [visible, setVisible] = useState(false);
  useEffect(
    () => {
      if (!isEqual(params, prevParams)) {
        setPrevParams(params);
        getList();
      }
    },
    [params]
  );
  useEffect(
    () => {
      const { [`${activeTabKey}StateNum`]: total, [`${activeTabKey}StateList`]: array } =
        (list || {})[`${activeTabKey}StateMap`] || {};
      setData({
        list: array || [],
        pagination: {
          total: total || 0,
          pageNum: 1,
          pageSize: getPageSize(),
        },
      });
    },
    [list, activeTabKey]
  );
  const tabList = useMemo(
    () => {
      return TABS.map(({ key, value }) => ({
        key,
        tab: (
          <div className={styles.tab}>
            <div>{((list || {})[`${key}StateMap`] || {})[`${key}StateNum`] || 0}</div>
            <div>{value}</div>
          </div>
        ),
      }));
    },
    [list]
  );
  const columns = [
    { dataIndex: 'status', title: '警情状态', render: value => value || <EmptyText /> },
    {
      dataIndex: 'createTime',
      title: '发生时间',
      render: value => value && moment(value).format(FORMAT),
    },
    { dataIndex: 'clientAddr', title: '主机编号', render: value => value || <EmptyText /> },
    { dataIndex: 'failureCode', title: '回路故障号', render: value => value || <EmptyText /> },
    { dataIndex: 'type', title: '设施部件类型', render: value => value || <EmptyText /> },
    { dataIndex: 'installAddress', title: '具体位置', render: value => value || <EmptyText /> },
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
  return (
    <Fragment>
      <Spin spinning={loading}>
        <Card
          className={styles.card}
          tabList={tabList}
          activeTabKey={activeTabKey}
          onTabChange={setActiveTabKey}
          bordered={false}
        >
          <Table
            list={data}
            columns={columns}
            onChange={({ current, pageSize }) => {
              const { pagination: { pageSize: prevPageSize } = {} } = list || {};
              setData(({ list, pagination }) => ({
                list,
                pagination: {
                  ...pagination,
                  pageNum: pageSize !== prevPageSize ? 1 : current,
                  pageSize,
                },
              }));
              pageSize !== prevPageSize && setPageSize(pageSize);
            }}
            showCard={false}
            rowKey="detailId"
          />
        </Card>
      </Spin>
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
                {(alarmDetail &&
                  (typeof value === 'function' ? value(alarmDetail) : alarmDetail[value])) || (
                  <EmptyText />
                )}
              </Description>
            ))}
          </DescriptionList>
        </Spin>
      </Drawer>
    </Fragment>
  );
});
