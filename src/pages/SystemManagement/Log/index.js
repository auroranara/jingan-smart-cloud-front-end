import React, { useRef, useState, useMemo, useEffect } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Form from '@/jingan-components/Form';
import Table from '@/jingan-components/View/Table';
import EmptyText from '@/jingan-components/View/EmptyText';
import Link from '@/jingan-components/View/Link';
import { Modal } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import styles from './index.less';

const TAB_LIST = [{ key: '1', tab: '登录日志' }, { key: '2', tab: '操作日志' }];
const LOGIN_TYPES = [{ key: 'login', value: '登入系统' }, { key: 'logout', value: '登出系统' }];
const LOGIN_METHODS = [
  { key: 'web', value: 'web' },
  { key: 'android', value: 'android' },
  { key: 'ios', value: 'ios' },
];
const FORMAT = 'YYYY-MM-DD HH:mm:ss';
const OPERATE_TYPES = [
  { key: 'INSERT', value: '新增' },
  { key: 'UPDATE', value: '编辑' },
  { key: 'DELETE', value: '删除' },
];
const NAMESPACE = 'systemManagement';
const API = `${NAMESPACE}/getLoginLogList`;
const API2 = `${NAMESPACE}/getOperationLogList`;
const PAGE_SIZE = 10;
const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '系统管理', name: '系统管理' },
  { title: '系统日志管理', name: '系统日志管理' },
];

export default connect(
  state => state,
  null,
  (
    {
      [NAMESPACE]: { loginLogList, operationLogList },
      loading: {
        effects: { [API]: loading, [API2]: loading2 },
      },
    },
    { dispatch },
    {
      match: {
        params: { type },
      },
      ...ownProps
    }
  ) => {
    const tabActiveKey = TAB_LIST.find(item => item.key === type) ? type : TAB_LIST[0].key;
    return {
      ...ownProps,
      tabActiveKey,
      list: tabActiveKey === TAB_LIST[0].key ? loginLogList : operationLogList,
      loading: loading || loading2 || false,
      getList:
        tabActiveKey === TAB_LIST[0].key
          ? ({ userName, range, ip, ...rest } = {}, callback) => {
              const [startTime, endTime] = range || [];
              dispatch({
                type: API,
                payload: {
                  pageNum: 1,
                  pageSize: PAGE_SIZE,
                  projectKey: global.PROJECT_CONFIG.projectKey,
                  userName: userName && userName.trim(),
                  startTime: startTime && startTime.format(FORMAT),
                  endTime: endTime && endTime.format(FORMAT),
                  ip: ip && ip.trim(),
                  ...rest,
                },
                callback,
              });
            }
          : ({ userName, range, ...rest } = {}, callback) => {
              const [startTime, endTime] = range || [];
              dispatch({
                type: API2,
                payload: {
                  pageNum: 1,
                  pageSize: PAGE_SIZE,
                  projectKey: global.PROJECT_CONFIG.projectKey,
                  userName: userName && userName.trim(),
                  startTime: startTime && startTime.format(FORMAT),
                  endTime: endTime && endTime.format(FORMAT),
                  ...rest,
                },
                callback,
              });
            },
    };
  },
  {
    areStatesEqual: () => false,
    areOwnPropsEqual: () => false,
    areStatePropsEqual: () => false,
    areMergedPropsEqual: (props, nextProps) => {
      return (
        props.tabActiveKey === nextProps.tabActiveKey &&
        props.list === nextProps.list &&
        props.loading === nextProps.loading
      );
    },
  }
)(({ tabActiveKey, list, loading, getList }) => {
  // 表单实例
  const form = useRef(null);
  // 表单暂存值
  const [values, setValues] = useState(undefined);
  // 表单配置对象
  const fields = useMemo(
    () => {
      return tabActiveKey === TAB_LIST[0].key
        ? [
            {
              name: 'way',
              label: '登录类型',
              component: 'Select',
              props: {
                list: LOGIN_TYPES,
                allowClear: true,
              },
            },
            {
              name: 'device',
              label: '登录方式',
              component: 'Select',
              props: {
                list: LOGIN_METHODS,
                allowClear: true,
              },
            },
            {
              name: 'userName',
              label: '登录人',
              component: 'Input',
              props: {
                allowClear: true,
              },
            },
            {
              name: 'range',
              label: '操作时间',
              component: 'RangePicker',
              props: {
                format: FORMAT,
                allowClear: true,
              },
            },
            {
              name: 'ip',
              label: 'IP地址',
              component: 'Input',
              props: {
                allowClear: true,
              },
            },
          ]
        : [
            {
              name: 'sqlType',
              label: '操作类型',
              component: 'Select',
              props: {
                list: OPERATE_TYPES,
                allowClear: true,
              },
            },
            {
              name: 'userName',
              label: '操作人',
              component: 'Input',
              props: {
                allowClear: true,
              },
            },
            {
              name: 'range',
              label: '操作时间',
              component: 'RangePicker',
              props: {
                format: FORMAT,
                allowClear: true,
              },
            },
          ];
    },
    [tabActiveKey]
  );
  // 表格配置对象
  const columns = useMemo(
    () => {
      return tabActiveKey === TAB_LIST[0].key
        ? [
            {
              dataIndex: '登录类型',
              title: '登录类型',
              render: (_, { data: { way: value } }) =>
                (LOGIN_TYPES.find(item => item.key === `${value}`) || {}).value || <EmptyText />,
            },
            {
              dataIndex: '登录方式',
              title: '登录方式',
              render: (_, { data: { device: value } }) =>
                (LOGIN_METHODS.find(item => item.key === `${value}`) || {}).value || <EmptyText />,
            },
            {
              dataIndex: '登录人',
              title: '登录人',
              render: (_, { data: { userName: value } }) => value || <EmptyText />,
            },
            {
              dataIndex: 'addTime',
              title: '操作时间',
              render: value => (value ? moment(value).format(FORMAT) : <EmptyText />),
            },
            {
              dataIndex: 'IP地址',
              title: 'IP地址',
              render: (_, { data: { ip: value } }) => value || <EmptyText />,
            },
          ]
        : [
            {
              dataIndex: '操作类型',
              title: '操作类型',
              render: (_, { data: { sqlType: value } }) =>
                (OPERATE_TYPES.find(item => item.key === `${value}`) || {}).value || <EmptyText />,
            },
            {
              dataIndex: '操作人',
              title: '操作人',
              render: (_, { data: { userName: value } }) => value || <EmptyText />,
            },
            {
              dataIndex: 'addTime',
              title: '操作时间',
              render: value => (value ? moment(value).format(FORMAT) : <EmptyText />),
            },
            {
              dataIndex: '操作表',
              title: '操作表',
              render: (_, { data: { tableName: value } }) => value || <EmptyText />,
            },
            {
              dataIndex: '操作内容',
              title: '操作内容',
              render: (_, { data: { sql: value } }) => (
                <Link
                  onClick={() =>
                    Modal.info({
                      title: '操作内容',
                      content: value,
                    })
                  }
                >
                  查看
                </Link>
              ),
            },
          ];
    },
    [tabActiveKey]
  );
  // 数据初始化
  useEffect(
    () => {
      const values = fields.reduce((result, item) => {
        result[item.name] = undefined;
        return result;
      }, {});
      setValues(values);
      getList();
      form.current.setFieldsValue(values);
    },
    [tabActiveKey]
  );
  // 查询、重置按钮点击事件回调
  const onSearch = values => {
    const { pagination: { pageSize = PAGE_SIZE } = {} } = list || {};
    setValues(values);
    getList({
      ...values,
      pageSize,
    });
  };
  return (
    <PageHeaderLayout
      className={styles.layout}
      breadcrumbList={BREADCRUMB_LIST}
      title={BREADCRUMB_LIST[BREADCRUMB_LIST.length - 1].title}
      tabList={TAB_LIST}
      tabActiveKey={tabActiveKey}
      onTabChange={tabActiveKey => router.replace(`/system-management/log/${tabActiveKey}`)}
    >
      <Form ref={form} fields={fields} onSearch={onSearch} onReset={onSearch} />
      <Table
        list={list}
        loading={loading}
        columns={columns}
        onChange={({ current, pageSize }) => {
          const { pagination: { pageSize: prevPageSize } = {} } = list || {};
          getList({
            ...values,
            pageNum: pageSize !== prevPageSize ? 1 : current,
            pageSize,
          });
          form.current.setFieldsValue(values);
        }}
        onReload={() => {
          const { pagination: { pageNum, pageSize } = {} } = list || {};
          getList({
            ...values,
            pageNum,
            pageSize,
          });
          form.current.setFieldsValue(values);
        }}
        showAddButton={false}
      />
    </PageHeaderLayout>
  );
});
