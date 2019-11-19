import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Pagination,
  Select,
  Button,
  Table,
  Spin,
  Divider,
  Popconfirm,
  message,
} from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import router from 'umi/router';

import { hasAuthority, AuthA } from '@/utils/customAuth';
import InlineForm from '../../../BaseInfo/Company/InlineForm';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';

import styles from './index.less';

const {
  emergencyManagement: {
    emergencyEstimate: { detail: detailCode, edit: editCode, add: addCode, delete: deleteCode },
  },
} = codes;
const addUrl = '/emergency-management/emergency-estimate/add';

const { Option } = Select;
const title = '应急演练评估';
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '应急管理',
    name: '应急管理',
  },
  {
    title,
    name: title,
  },
];

/* 去除两边空格 */
const transform = value => value.trim();
/* 设置相对定位 */
const getRootChild = () => document.querySelector('#root>div');
const NO_DATA = '暂无数据';

@Form.create()
@connect(({ emergencyManagement, user, loading }) => ({
  emergencyManagement,
  user,
  loading: loading.models.emergencyManagement,
}))
export default class EmergencyEstimateList extends PureComponent {
  state = {
    formData: {},
    scrollX: 1250,
    currentPage: 1,
  };

  pageNum = 1;

  pageSize = 10;

  componentDidMount() {
    this.fetchList(1);
  }

  fetchList = (pageNum = 1, pageSize = 10, filters = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergencyManagement/fetchEstimateList',
      payload: {
        pageNum,
        pageSize,
        ...filters,
      },
    });
  };

  renderForm = () => {
    const {
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    const fields = [
      {
        id: 'planName',
        render() {
          return <Input placeholder="请输入计划名称" />;
        },
        transform,
      },
      {
        id: 'assessName',
        render() {
          return <Input placeholder="请输入演练名称" />;
        },
        transform,
      },
      {
        id: 'planCode',
        render() {
          return <Input placeholder="请输入应急演练编码" />;
        },
        transform,
      },
      {
        id: 'companyName',
        render() {
          return <Input placeholder="请输入单位名称" />;
        },
        transform,
      },
    ];

    // 是否有新增权限
    const hasAddAuthority = hasAuthority(addCode, permissionCodes);

    return (
      <Card>
        <InlineForm
          fields={fields}
          gutter={{ lg: 48, md: 24 }}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
          action={
            <Button type="primary" onClick={this.goToAdd} disabled={!hasAddAuthority}>
              新增
            </Button>
          }
        />
      </Card>
    );
  };

  goToAdd = () => {
    router.push(addUrl);
  };

  handleSearch = values => {
    this.setState({ formData: { ...values } });
    this.fetchList(1, this.pageSize, { ...values });
  };

  handleReset = () => {
    this.setState({ formData: {} });
    this.fetchList(1, this.pageSize);
  };

  goDetail = id => {
    router.push(`/emergency-management/emergency-estimate/detail/${id}`);
  };

  goEdit = id => {
    router.push(`/emergency-management/emergency-estimate/edit/${id}`);
  };

  // 表格改变触发，包含分页变动
  handleTableChange = (pageNum, pageSize) => {
    const { formData } = this.state;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize, { ...formData });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    const { formData } = this.state;
    dispatch({
      type: 'emergencyManagement/deleteEstimate',
      payload: {
        id,
      },
      success: () => {
        message.success('删除成功！');
        this.fetchList(this.pageNum, this.pageSize, { ...formData });
        // this.fetchCompanyNum();
      },
      error: msg => {
        message.error(msg);
      },
    });
  };

  render() {
    const {
      loading = false,
      emergencyManagement: {
        estimate: { list, pagination: { pageNum = 1, pageSize = 10, total = 0 } = {}, a },
      },
    } = this.props;
    const { currentPage, scrollX } = this.state;

    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
        width: 160,
      },
      {
        title: '演练计划',
        dataIndex: 'projectInfo',
        key: 'projectInfo',
        align: 'center',
        width: 250,
        render: (data, record) => {
          const { projectCode, planName } = record;
          return (
            <div className={styles.multi}>
              <div>
                计划名称：
                {planName}
              </div>
              <div>
                版本号：
                {projectCode}
              </div>
            </div>
          );
        },
      },
      {
        title: '演练信息',
        dataIndex: 'drillInfo',
        key: 'drillInfo',
        align: 'center',
        width: 200,
        render: (data, record) => {
          const { assessName, planCode } = record;
          return (
            <div className={styles.multi}>
              <div>
                演练名称：
                {assessName}
              </div>
              <div>
                演练编号：
                {planCode}
              </div>
            </div>
          );
        },
      },
      {
        title: '演练人员',
        dataIndex: 'assessMem',
        key: 'assessMem',
        align: 'center',
      },
      {
        title: '评估信息',
        dataIndex: 'assessInfo',
        key: 'assessInfo',
        align: 'center',
        width: 200,
        render: (data, record) => {
          const { drillReportList, assessUnit, assessDate } = record;
          const fileNames = drillReportList.length ? drillReportList[0].fileName.split('.') : [];
          const name = fileNames.slice(0, fileNames.length - 1).join('.');
          return (
            <div className={styles.multi}>
              <div>
                评估报告标题：
                {name}
              </div>
              <div>
                评估单位：
                {assessUnit}
              </div>
              <div>
                评估日期：
                {moment(assessDate).format('YYYY-MM-DD')}
              </div>
            </div>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        width: 160,
        render: (data, record) => (
          <span>
            <AuthA code={detailCode} onClick={() => this.goDetail(record.id)}>
              查看
            </AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.goEdit(record.id)}>
              编辑
            </AuthA>
            <Divider type="vertical" />
            <Popconfirm
              title="确认要删除该应急演练评估吗？"
              onConfirm={() => this.handleDelete(record.id)}
            >
              <AuthA code={deleteCode}>删除</AuthA>
            </Popconfirm>
          </span>
        ),
      },
    ];
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            单位数量：
            {a}
            <span style={{ marginLeft: 15 }}>
              评估信息：
              {total}
            </span>
          </div>
        }
      >
        {this.renderForm()}
        {list && list.length ? (
          <Card style={{ marginTop: '24px' }}>
            <Table
              rowKey="id"
              loading={loading}
              columns={columns}
              dataSource={list}
              pagination={false}
              // scroll={{ x: true }}
            />
            <Pagination
              style={{ marginTop: '20px', float: 'right' }}
              // showTotal={false}
              showQuickJumper
              showSizeChanger
              pageSizeOptions={['5', '10', '15', '20']}
              pageSize={pageSize}
              current={pageNum}
              total={total}
              onChange={this.handleTableChange}
              onShowSizeChange={this.handleTableChange}
              // showTotal={total => `共 ${total} 条`}
            />
          </Card>
        ) : (
          <Spin spinning={loading}>
            <Card style={{ marginTop: '20px', textAlign: 'center' }}>
              <span>暂无数据</span>
            </Card>
          </Spin>
        )}
      </PageHeaderLayout>
    );
  }
}
