import React, { Fragment, Component } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Form from '@/jingan-components/Form';
import Table from '@/jingan-components/View/Table';
import EmptyText from '@/jingan-components/View/EmptyText';
import TextAreaEllipsis from '@/jingan-components/View/TextAreaEllipsis';
import { Button, Divider } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { AuthLink, AuthButton } from '@/utils/customAuth';
import codes from '@/utils/codes';
import { title as listTitlt } from './List';

export const FORMAT = 'YYYY-MM-DD';
const PAGE_SIZE = 10;
export const title = '评价项目';
const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '风险分级管控', name: '风险分级管控' },
  { title: listTitlt, name: listTitlt },
  { title, name: title },
];
const {
  riskControl: {
    safetyChecklist: {
      evaluationRecord: {
        add: addCode,
        edit: editCode,
        delete: deleteCode,
        view: viewCode,
      },
    },
  },
} = codes;

@connect(({ user }) => ({
  user,
}))
export default class SafetyChecklist extends Component {

  state = {
    values: {},
    handleModalVisibe: false,
    detail: {},
    isDetail: false,
  };

  onSearch = () => { }

  onSubmitHnaldeModal = () => { }

  render () {
    const {
      list = [],
      loading,
      user: { isCompany },
    } = this.props;
    const { handleModalVisible, detail, isDetail } = this.state;
    // 表单配置对象
    const fields = [
      {
        name: 'evaluateProject',
        label: '评估项目',
        component: 'Input',
        props: {
          allowClear: true,
        },
      },
    ];
    const columns = [
      {
        dataIndex: 'evaluateProject',
        title: '评估项目',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'majorHidden',
        title: '主要危险因素（人、物、作业环境、管理）',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'hiddenTypeResultName',
        title: '可能发生的事故类型及后果',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'riskMeasures',
        title: '风险管控措施',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'emergencyMeasures',
        title: '应急处置措施',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'highRiskLevel',
        title: '风险评价结果（LEC)',
        render: (
          <div style={{ textAgin: 'left' }}>
            <p>可能性（L)：</p>
            <p>频次(E)：</p>
            <p>严重性(C)：</p>
            <p>评估风险值(D)：</p>
            <p>评价级别：</p>
            <p>评估人员：</p>
            <p>评估日期：</p>
          </div>
        ),
      },
      {
        dataIndex: 'riskLevelColor',
        title: '风险等级',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: '操作',
        title: '操作',
        fixed: 'right',
        width: 164,
        render: (_, { id, status }) => (
          <Fragment>
            <AuthLink>查看</AuthLink>
            <Divider type="vertical" />
            <AuthLink>编辑</AuthLink>
            <Divider type="vertical" />
            <AuthLink>删除</AuthLink>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderLayout
        breadcrumbList={BREADCRUMB_LIST}
        title={BREADCRUMB_LIST[BREADCRUMB_LIST.length - 1].title}
      >
        <Form ref={form => this.form = form} fields={fields} onSearch={this.onSearch} onReset={this.onSearch} />
        <Table
          list={list}
          loading={loading}
          columns={columns}
          onChange={({ current, pageSize }) => {
            const { pagination: { pageSize: prevPageSize } = {} } = list || {};
            // getListByValues({
            //   ...values,
            //   pageNum: pageSize !== prevPageSize ? 1 : current,
            //   pageSize,
            // });
            // form.current.setFieldsValue(values);
          }}
          onReload={() => {
            const { pagination: { pageNum, pageSize } = {} } = list || {};
            // getListByValues({
            //   ...values,
            //   pageNum,
            //   pageSize,
            // });
            // form.current.setFieldsValue(values);
          }}
          showAddButton={false}
          operation={
            [
              <AuthButton type="primary" code={addCode}>
                新增评价记录
              </AuthButton>,
            ]
          }
        />
      </PageHeaderLayout>
    )
  }
}
