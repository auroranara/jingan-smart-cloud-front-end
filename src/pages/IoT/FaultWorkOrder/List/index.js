import React, { useRef, useState, useEffect, Fragment } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Form from '@/jingan-components/Form';
import Table from '@/jingan-components/View/Table';
import EmptyText from '@/jingan-components/View/EmptyText';
import Link from '@/jingan-components/View/Link';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import isEqual from 'lodash/isEqual';
import { stringify } from 'qs';
import { STATUSES, FORMAT } from '../../AlarmWorkOrder/config';
import styles from './index.less';

const NAMESPACE = 'workOrder';
const API = `${NAMESPACE}/getList`;
const PAGE_SIZE = 10;
const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '物联网监测报警', name: '物联网监测报警' },
  { title: '故障工单管理', name: '故障工单管理' },
];

export default connect(
  state => state,
  null,
  (
    {
      user: { currentUser },
      [NAMESPACE]: { list },
      loading: {
        effects: { [API]: loading },
      },
    },
    { dispatch },
    ownProps
  ) => {
    return {
      ...ownProps,
      currentUser,
      list,
      loading,
      getList(payload, callback) {
        const { range, status, ...rest } = payload || {};
        const [queryCreateStartDate, queryCreateEndDate] = range || [];
        dispatch({
          type: API,
          payload: {
            processType: 2,
            queryCreateStartDate:
              queryCreateStartDate && queryCreateStartDate.startOf('day').format(FORMAT),
            queryCreateEndDate:
              queryCreateEndDate && queryCreateEndDate.endOf('day').format(FORMAT),
            status: status && status.join(','),
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
        props.list === nextProps.list &&
        props.loading === nextProps.loading &&
        isEqual(props.location.query, nextProps.location.query)
      );
    },
  }
)(
  ({
    route: { path },
    location: { query },
    currentUser: { permissionCodes, unitType },
    list,
    loading,
    getList,
  }) => {
    // 表单实例
    const form = useRef(null);
    // 之前的query
    const [prevQuery, setPreQuery] = useState(undefined);
    // 数据初始化
    useEffect(
      () => {
        if (!isEqual(query, prevQuery)) {
          setPreQuery(query);
          const {
            pageNum,
            pageSize,
            companyName,
            reportType,
            deviceName,
            areaLocation,
            queryCreateStartDate,
            queryCreateEndDate,
            status,
          } = query;
          const values = {
            companyName: companyName ? decodeURIComponent(companyName) : undefined,
            reportType: reportType || undefined,
            deviceName: deviceName ? decodeURIComponent(deviceName) : undefined,
            areaLocation: areaLocation ? decodeURIComponent(areaLocation) : undefined,
            range:
              queryCreateStartDate && queryCreateEndDate
                ? [moment(+queryCreateStartDate), moment(+queryCreateEndDate)]
                : undefined,
            status: status ? decodeURIComponent(status).split(',') : undefined,
          };
          getList({
            pageNum: +pageNum || 1,
            pageSize: +pageSize || PAGE_SIZE,
            ...values,
          });
          form.current.setFieldsValue(values);
        }
      },
      [query]
    );
    const hasDetailAuthority = permissionCodes.includes('companyIot.faultWorkOrder.detail');
    const FIELDS = [
      ...(unitType !== 4
        ? [
            {
              name: 'companyName',
              label: '单位名称',
              component: 'Input',
              props: {
                allowClear: true,
              },
            },
          ]
        : []),
      {
        name: 'reportType',
        label: '监测类型',
        component: 'Select',
        props: {
          preset: 'monitorType',
          params: {
            type: 4,
            hack: true,
          },
          allowClear: true,
        },
      },
      {
        name: 'deviceName',
        label: '设备名称/主机编号',
        component: 'Input',
        props: {
          allowClear: true,
        },
      },
      {
        name: 'areaLocation',
        label: '区域位置',
        component: 'Input',
        props: {
          allowClear: true,
        },
      },
      {
        name: 'range',
        label: '工单创建时间',
        component: 'RangePicker',
        props: {
          allowClear: true,
        },
      },
      {
        name: 'status',
        label: '处理状态',
        component: 'Select',
        props: {
          list: STATUSES,
          originalMode: 'multiple',
          allowClear: true,
        },
      },
    ];
    const COLUMNS = [
      ...(unitType !== 4
        ? [
            {
              dataIndex: 'companyName',
              title: '单位名称',
              render: value => value || <EmptyText />,
            },
          ]
        : []),
      {
        dataIndex: 'reportTypeName',
        title: '监测类型',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'deviceName',
        title: '设备',
        render: (_, { reportType, deviceName, unitTypeName, loopNumber, partNumber }) =>
          +reportType === 1 ? (
            <Fragment>
              <div className={styles.item}>
                <span>消防主机编号：</span>
                <span>{deviceName || <EmptyText />}</span>
              </div>
              <div className={styles.item}>
                <span>部件类型：</span>
                <span>{unitTypeName || <EmptyText />}</span>
              </div>
              <div className={styles.item}>
                <span>回路号：</span>
                <span>
                  {`${loopNumber ? `${loopNumber}回路` : ''}${
                    partNumber ? `${partNumber}号` : ''
                  }` || <EmptyText />}
                </span>
              </div>
            </Fragment>
          ) : (
            <div className={styles.item}>
              <span>监测设备名称：</span>
              <span>{deviceName || <EmptyText />}</span>
            </div>
          ),
      },
      {
        dataIndex: 'areaLocation',
        title: '区域位置',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'createDate',
        title: '工单创建时间',
        render: value => (value ? moment(value).format(FORMAT) : <EmptyText />),
      },
      {
        dataIndex: 'status',
        title: '处理状态',
        render: value =>
          (STATUSES.find(item => item.key === `${value}`) || {}).value || <EmptyText />,
      },
      {
        dataIndex: 'endDate',
        title: '工单结束时间',
        render: value => (value ? moment(value).format(FORMAT) : <EmptyText />),
      },
      {
        dataIndex: '操作',
        title: '操作',
        width: 88,
        fixed: 'right',
        render: (_, { id }) => (
          <Link
            to={`/company-iot/fault-work-order/detail/${id}`}
            target="_blank"
            disabled={!hasDetailAuthority}
          >
            查看详情
          </Link>
        ),
      },
      {
        dataIndex: 'msgCount',
        title: '消息通知',
        width: 102,
        fixed: 'right',
        render: (value, { id }) => (
          <Fragment>
            <span className={styles.text}>已发送</span>
            <Link
              to={`/company-iot/fault-work-order/detail/${id}?flag`}
              target="_blank"
              disabled={!hasDetailAuthority || !value}
            >
              {`${value || 0}条`}
            </Link>
          </Fragment>
        ),
        align: 'center',
      },
    ];
    // 查询、重置按钮点击事件回调
    const onSearch = values => {
      const { companyName, reportType, deviceName, areaLocation, range, status } = values;
      const { pageSize = PAGE_SIZE } = query;
      const [queryCreateStartDate, queryCreateEndDate] = range || [];
      router.replace(
        `${path}?${stringify({
          pageNum: 1,
          pageSize,
          companyName:
            companyName && companyName.trim() ? encodeURIComponent(companyName.trim()) : undefined,
          reportType,
          deviceName:
            deviceName && deviceName.trim() ? encodeURIComponent(deviceName.trim()) : undefined,
          areaLocation:
            areaLocation && areaLocation.trim()
              ? encodeURIComponent(areaLocation.trim())
              : undefined,
          queryCreateStartDate: queryCreateStartDate ? +queryCreateStartDate : undefined,
          queryCreateEndDate: queryCreateEndDate ? +queryCreateEndDate : undefined,
          status: status && status.length ? encodeURIComponent(status.join(',')) : undefined,
          flag: +new Date(),
        })}`
      );
    };
    return (
      <PageHeaderLayout
        breadcrumbList={BREADCRUMB_LIST}
        title={BREADCRUMB_LIST[BREADCRUMB_LIST.length - 1].title}
      >
        <Form ref={form} fields={FIELDS} onSearch={onSearch} onReset={onSearch} />
        <Table
          list={list}
          loading={loading}
          columns={COLUMNS}
          onChange={({ current, pageSize }) => {
            const { pageSize: prevPageSize = PAGE_SIZE } = query;
            router.replace(
              `${path}?${stringify({
                ...query,
                pageNum: pageSize !== +prevPageSize ? 1 : current,
                pageSize,
              })}`
            );
          }}
          onReload={() => {
            router.replace(
              `${path}?${stringify({
                ...query,
                flag: +new Date(),
              })}`
            );
          }}
          showAddButton={false}
        />
      </PageHeaderLayout>
    );
  }
);
