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
import HandleModal from './HandleModal';

export const FORMAT = 'YYYY-MM-DD';
const PAGE_SIZE = 10;
export const title = '安全检查表-SCL分析';
const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '风险分级管控', name: '风险分级管控' },
  { title, name: title },
];
const {
  riskControl: {
    safetyChecklist: {
      add: addCode,
      edit: editCode,
      delete: deleteCode,
      view: viewCode,
      copy: copyCode,
      evaluationRecord,
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
        name: 'riskPointName',
        label: '风险点名称',
        component: 'Input',
        props: {
          allowClear: true,
        },
      },
      {
        name: 'code',
        label: '编号',
        component: 'Input',
        props: {
          allowClear: true,
        },
      },
      {
        name: 'equip',
        label: '装置/设备/设施',
        component: 'Input',
        props: {
          allowClear: true,
        },
      },
      ...(!isCompany
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
    ];
    const columns = [
      ...(!isCompany
        ? [
          {
            dataIndex: 'companyName',
            title: '单位名称',
            render: value => value || <EmptyText />,
          },
        ]
        : []),
      {
        dataIndex: 'code',
        title: '编号',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'evaluateDate',
        title: '评价日期',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'riskPoint',
        title: '风险点',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'equip',
        title: '装置/设备/设施',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'riskAnalyze',
        title: '风险分析方法',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'highRiskLevel',
        title: '最高风险等级',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'evaluateNum',
        title: '评价项目',
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
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderLayout
        breadcrumbList={BREADCRUMB_LIST}
        title={title}
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
              <AuthButton type="primary" href="#/" code={addCode}>
                新增SCL评价记录
              </AuthButton>,
              <Button
                href=""
                target="_blank"
                style={{ marginRight: '10px' }}
              >
                模板下载
              </Button>,
              <Button>导入</Button>,
            ]
          }
        />
        <HandleModal
          visible={handleModalVisible}
          onOk={this.onSubmitHnaldeModal}
          onCancel={() => { this.setState({ handleModalVisible: false }) }}
          detail={detail || {}}
          isDetail={isDetail}
        />
      </PageHeaderLayout>
    )
  }
}
