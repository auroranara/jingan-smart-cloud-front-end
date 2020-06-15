import React, { useRef, useState, useMemo, useEffect } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Form from '@/jingan-components/Form';
import Table from '@/jingan-components/View/Table';
import EmptyText from '@/jingan-components/View/EmptyText';
import Link from '@/jingan-components/View/Link';
import { Button } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import styles from './index.less';

const TYPES = [{ key: '1', tab: '登录日志' }, { key: '2', tab: '操作日志' }];
const LOGIN_TYPES = [{ key: '1', value: '登入系统' }, { key: '2', value: '登出系统' }];
const LOGIN_METHODS = [
  { key: '1', value: 'web' },
  { key: '2', value: 'android' },
  { key: '3', value: 'ios' },
];
const FORMAT = 'YYYY-MM-DD HH:mm:ss';
const OPERATE_TYPES = [
  { key: '1', value: '新增' },
  { key: '2', value: '编辑' },
  { key: '3', value: '删除' },
];
const NAMESPACE = 'systemManagement';
const API = `${NAMESPACE}/getLogList`;
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
      [NAMESPACE]: { logList: list },
      loading: {
        effects: { [API]: loading },
      },
    },
    { dispatch },
    ownProps
  ) => {
    return {
      ...ownProps,
      list,
      loading,
      getList(payload, callback) {
        dispatch({
          type: API,
          payload: {
            pageNum: 1,
            pageSize: PAGE_SIZE,
            ...payload,
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
        props.list === nextProps.list &&
        props.loading === nextProps.loading &&
        props.match.params.type === nextProps.match.params.type
      );
    },
  }
)(({ match: { params: { type } }, list, loading, getList }) => {
  // 表单实例
  const form = useRef(null);
  // 表单暂存值
  const [values, setValues] = useState(undefined);
  // 当前选中的标签键值
  const tabActiveKey = useMemo(
    () => {
      return TYPES.find(item => item.key === type) ? type : TYPES[0].key;
    },
    [type]
  );
  // 表单配置对象
  const fields = useMemo(
    () => {
      return tabActiveKey === TYPES[0].key
        ? [
            {
              name: 'loginType',
              label: '登录类型',
              component: 'Select',
              props: {
                list: LOGIN_TYPES,
                allowClear: true,
              },
            },
            {
              name: 'loginMethod',
              label: '登录方式',
              component: 'Select',
              props: {
                list: LOGIN_METHODS,
                allowClear: true,
              },
            },
            {
              name: 'loginUser',
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
              name: 'operateType',
              label: '操作类型',
              component: 'Select',
              props: {
                list: OPERATE_TYPES,
                allowClear: true,
              },
            },
            {
              name: 'operator',
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
      return tabActiveKey === TYPES[0].key
        ? [
            {
              dataIndex: 'loginType',
              title: '登录类型',
              render: value =>
                (LOGIN_TYPES.find(item => item.key === `${value}`) || {}).value || <EmptyText />,
            },
            {
              dataIndex: 'loginMethod',
              title: '登录方式',
              render: value =>
                (LOGIN_METHODS.find(item => item.key === `${value}`) || {}).value || <EmptyText />,
            },
            {
              dataIndex: 'loginUser',
              title: '登录人',
              render: value => value || <EmptyText />,
            },
            {
              dataIndex: 'operateTime',
              title: '操作时间',
              render: value => (value ? moment(value).format(FORMAT) : <EmptyText />),
            },
            {
              dataIndex: 'ip',
              title: 'IP地址',
              render: value => value || <EmptyText />,
            },
          ]
        : [
            {
              dataIndex: 'operateType',
              title: '操作类型',
              render: value =>
                (OPERATE_TYPES.find(item => item.key === `${value}`) || {}).value || <EmptyText />,
            },
            {
              dataIndex: 'operator',
              title: '操作人',
              render: value => value || <EmptyText />,
            },
            {
              dataIndex: 'operateTime',
              title: '操作时间',
              render: value => (value ? moment(value).format(FORMAT) : <EmptyText />),
            },
            {
              dataIndex: 'operateTarget',
              title: '操作表',
              render: value => value || <EmptyText />,
            },
            {
              dataIndex: '操作内容',
              title: '操作内容',
              render: (_, { id }) => <Link onClick={() => console.log(id)}>查看</Link>,
            },
          ];
    },
    [tabActiveKey]
  );
  // 接口封装方法
  const getListByValues = ({ loginUser, range, ip, operator, ...rest } = {}) => {
    const [startTime, endTime] = range || [];
    getList({
      ...rest,
      tabActiveKey,
      loginUser: loginUser && loginUser.trim(),
      startTime: startTime && startTime.format(FORMAT),
      endTime: endTime && endTime.format(FORMAT),
      ip: ip && ip.trim(),
      operator: operator && operator.trim(),
    });
  };
  // 数据初始化
  useEffect(
    () => {
      setValues(
        fields.reduce((result, item) => {
          result[item.name] = undefined;
          return result;
        }, {})
      );
      getListByValues();
    },
    [tabActiveKey]
  );
  // 查询、重置按钮点击事件回调
  const onSearch = values => {
    const { pagination: { pageSize = PAGE_SIZE } = {} } = list || {};
    setValues(values);
    getListByValues({
      ...values,
      pageSize,
    });
  };
  return (
    <PageHeaderLayout
      className={styles.layout}
      breadcrumbList={BREADCRUMB_LIST}
      title={BREADCRUMB_LIST[BREADCRUMB_LIST.length - 1].title}
      action={
        <Button type="primary" href="#/test">
          申请变更
        </Button>
      }
      tabList={TYPES}
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
          getListByValues({
            ...values,
            pageNum: pageSize !== prevPageSize ? 1 : current,
            pageSize,
          });
          form.current.setFieldsValue(values);
        }}
        onReload={() => {
          const { pagination: { pageNum, pageSize } = {} } = list || {};
          getListByValues({
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
