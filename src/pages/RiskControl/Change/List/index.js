import React, { useRef, useState, useEffect, useMemo, Fragment } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Form from '@/jingan-components/Form';
import Table from '@/jingan-components/View/Table';
import EmptyText from '@/jingan-components/View/EmptyText';
import TextAreaEllipsis from '@/jingan-components/View/TextAreaEllipsis';
import Badge from '@/jingan-components/View/Badge';
import Link from '@/jingan-components/View/Link';
import { Button, Divider } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './index.less';

export const TYPES = [
  { key: '1', value: '工艺变更' },
  { key: '2', value: '人员变更' },
  { key: '3', value: '设备设施变更' },
  { key: '4', value: '管理变更' },
  { key: '5', value: '其他变更' },
];
export const STATUSES = [
  { key: '2', value: '待验收', status: 'default' },
  { key: '1', value: '验收通过', status: 'success' },
  { key: '0', value: '验收不通过', status: 'error' },
];
export const FORMAT = 'YYYY-MM-DD';
const NAMESPACE = 'change';
const API = `${NAMESPACE}/getList`;
const PAGE_SIZE = 10;
const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '风险分级管控', name: '风险分级管控' },
  { title: '变更管理', name: '变更管理' },
];

export default connect(
  state => state,
  null,
  (
    {
      user: {
        currentUser: { unitType, permissionCodes },
      },
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
      isUnit: unitType === 4,
      // 运维和企业才有操作权限，其他角色只能查看
      hasOperateAuthority: [3, 4].includes(unitType),
      hasDetailAuthority: permissionCodes.includes('riskControl.change.detail'),
      hasAddAuthority: permissionCodes.includes('riskControl.change.add'),
      hasEditAuthority: permissionCodes.includes('riskControl.change.edit'),
      hasApproveAuthority: permissionCodes.includes('riskControl.change.approve'),
    };
  },
  {
    areStatesEqual: () => false,
    areOwnPropsEqual: () => false,
    areStatePropsEqual: () => false,
    areMergedPropsEqual: (props, nextProps) => {
      return props.list === nextProps.list && props.loading === nextProps.loading;
    },
  }
)(
  ({
    list,
    loading,
    getList,
    isUnit,
    hasOperateAuthority,
    hasDetailAuthority,
    hasAddAuthority,
    hasEditAuthority,
    hasApproveAuthority,
  }) => {
    // 表单实例
    const form = useRef(null);
    // 表单暂存值
    const [values, setValues] = useState(undefined);
    // 接口封装方法
    const getListByValues = ({ companyName, changeProject, applyPerson, ...rest } = {}) => {
      getList({
        ...rest,
        companyName: companyName && companyName.trim(),
        changeProject: changeProject && changeProject.trim(),
        applyPerson: applyPerson && applyPerson.trim(),
      });
    };
    // 表单配置对象
    const fields = [
      ...(!isUnit
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
        name: 'changeType',
        label: '变更类别',
        component: 'Select',
        props: {
          list: TYPES,
          allowClear: true,
        },
      },
      {
        name: 'changeProject',
        label: '变更项目',
        component: 'Input',
        props: {
          allowClear: true,
        },
      },
      {
        name: 'applyPerson',
        label: '申请人',
        component: 'Input',
        props: {
          allowClear: true,
        },
      },
      {
        name: 'status',
        label: '验收状态',
        component: 'Select',
        props: {
          list: STATUSES,
          allowClear: true,
        },
      },
    ];
    // 表格配置对象
    const columns = useMemo(() => {
      return [
        ...(!isUnit
          ? [
              {
                dataIndex: 'companyName',
                title: '单位名称',
                render: value => value || <EmptyText />,
              },
            ]
          : []),
        {
          dataIndex: 'changeProject',
          title: '变更项目',
          render: value => value || <EmptyText />,
        },
        {
          dataIndex: 'changeType',
          title: '变更类别',
          render: value =>
            (TYPES.find(item => item.key === `${value}`) || {}).value || <EmptyText />,
        },
        {
          dataIndex: 'applyContent',
          title: '变更内容描述',
          render: value => <TextAreaEllipsis value={value} />,
        },
        {
          dataIndex: 'applyPersonName',
          title: '申请人',
          render: value => value || <EmptyText />,
        },
        {
          dataIndex: 'createTime',
          title: '申请时间',
          render: value => (value ? moment(value).format(FORMAT) : <EmptyText />),
        },
        {
          dataIndex: 'status',
          title: '验收状态',
          render: value => <Badge list={STATUSES} value={`${value}`} />,
        },
        {
          dataIndex: '操作',
          title: '操作',
          fixed: 'right',
          width: 164,
          render: (_, { id, status }) => (
            <Fragment>
              <Link
                to={`/risk-control/change/detail/${id}`}
                target="_blank"
                disabled={!hasDetailAuthority}
              >
                查看
              </Link>
              {hasOperateAuthority &&
                `${status}` !== STATUSES[1].key && (
                  <Fragment>
                    <Divider type="vertical" />
                    <Link
                      to={`/risk-control/change/edit/${id}`}
                      target="_blank"
                      disabled={!hasEditAuthority}
                    >
                      编辑
                    </Link>
                  </Fragment>
                )}
              {hasOperateAuthority &&
                `${status}` === STATUSES[0].key && (
                  <Fragment>
                    <Divider type="vertical" />
                    <Link
                      to={`/risk-control/change/approve/${id}`}
                      target="_blank"
                      disabled={!hasApproveAuthority}
                    >
                      去验收
                    </Link>
                  </Fragment>
                )}
            </Fragment>
          ),
        },
      ];
    }, []);
    // 数据初始化
    useEffect(() => {
      setValues(
        fields.reduce((result, item) => {
          result[item.name] = undefined;
          return result;
        }, {})
      );
      getListByValues();
    }, []);
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
          operation={
            hasOperateAuthority && [
              <Button type="primary" href="#/risk-control/change/add" disabled={!hasAddAuthority}>
                申请变更
              </Button>,
            ]
          }
        />
      </PageHeaderLayout>
    );
  }
);
