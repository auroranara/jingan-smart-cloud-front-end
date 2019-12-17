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
import { getColorVal, paststatusVal } from '@/pages/BaseInfo/SpecialEquipment/utils';

const {
  emergencyManagement: {
    emergencyEquipment: { detail: detailCode, edit: editCode, add: addCode, delete: deleteCode },
  },
} = codes;
const addUrl = '/emergency-management/emergency-equipment/add';

const { Option } = Select;
const title = '应急装备';
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

const Source = ['国配', '自购', '社会装备'];
const Status = ['正常', '维检', '报废', '使用中'];
const RegisterType = ['救援队装备', '社会装备', '储备库装备'];

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
export default class EmergencyEquipmentList extends PureComponent {
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
      type: 'emergencyManagement/fetchEquipList',
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
        currentUser: { permissionCodes, unitType },
      },
    } = this.props;
    const fields = [
      {
        id: 'equipName',
        render() {
          return <Input placeholder="请输入装备名称" />;
        },
        transform,
      },
      {
        id: 'equipCode',
        render() {
          return <Input placeholder="请输入装备编码" />;
        },
        transform,
      },
      {
        id: 'deviceCode',
        render() {
          const options = [
            { value: '1', name: '未到期' },
            { value: '2', name: '即将到期' },
            { value: '3', name: '已过期' },
          ];
          return (
            <Select
              allowClear
              showSearch
              placeholder="请选择到期状态"
              getPopupContainer={getRootChild}
              style={{ width: '100%' }}
            >
              {options.map(item => {
                const { value, name } = item;
                return (
                  <Option value={value} key={value}>
                    {name}
                  </Option>
                );
              })}
            </Select>
          );
        },
      },
      {
        id: 'equipSource',
        render() {
          const options = [
            { value: '1', name: '国配' },
            { value: '2', name: '自购' },
            { value: '3', name: '社会装备' },
          ];
          return (
            <Select
              allowClear
              showSearch
              placeholder="请选择装备来源"
              getPopupContainer={getRootChild}
              style={{ width: '100%' }}
            >
              {options.map(item => {
                const { value, name } = item;
                return (
                  <Option value={value} key={value}>
                    {name}
                  </Option>
                );
              })}
            </Select>
          );
        },
      },
      {
        id: 'status',
        render() {
          const options = [
            { value: '1', name: '正常' },
            { value: '2', name: '维检' },
            { value: '3', name: '报废' },
            { value: '4', name: '使用中' },
          ];
          return (
            <Select
              allowClear
              showSearch
              placeholder="请选择装备状态"
              getPopupContainer={getRootChild}
              style={{ width: '100%' }}
            >
              {options.map(item => {
                const { value, name } = item;
                return (
                  <Option value={value} key={value}>
                    {name}
                  </Option>
                );
              })}
            </Select>
          );
        },
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
          fields={unitType === 4 ? fields.slice(0, fields.length - 1) : fields}
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
    router.push(`/emergency-management/emergency-equipment/detail/${id}`);
  };

  goEdit = id => {
    router.push(`/emergency-management/emergency-equipment/edit/${id}`);
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
      type: 'emergencyManagement/deleteEquipment',
      payload: {
        id,
      },
      success: () => {
        message.success('删除成功！');
        this.fetchList(this.pageNum, this.pageSize, { ...formData });
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
        equipment: { list, pagination: { pageNum = 1, pageSize = 10, total = 0 } = {} },
      },
      user: {
        currentUser: { unitType, permissionCodes },
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
        title: '基本信息',
        dataIndex: 'basicInfo',
        key: 'basicInfo',
        align: 'center',
        width: 250,
        render: (data, record) => {
          const { equipName, equipType, equipCode, equipModel } = record;
          return (
            <div className={styles.multi}>
              <div>
                名称：
                {equipName}
              </div>
              <div>
                类型：
                {equipType || NO_DATA}
              </div>
              <div>
                编码：
                {equipCode || NO_DATA}
              </div>
              <div>
                规格型号：
                {equipModel}
              </div>
            </div>
          );
        },
      },
      {
        title: '来源/登记类型',
        dataIndex: 'equipSource',
        key: 'equipSource',
        align: 'center',
        width: 200,
        render: (data, record) => {
          const { equipSource, registerType } = record;
          return (
            <div className={styles.multi}>
              <div>
                来源：
                {Source[equipSource - 1]}
              </div>
              <div>
                登记类型：
                {RegisterType[registerType - 1]}
              </div>
            </div>
          );
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 120,
        render: data => {
          return Status[data - 1];
        },
      },
      {
        title: '有效期至',
        dataIndex: 'endDate',
        key: 'endDate',
        align: 'center',
        width: 200,
        render: date => {
          return date ? moment(date).format('YYYY-MM-DD') : '-';
        },
      },
      {
        title: '有效期状态',
        dataIndex: 'paststatus',
        key: 'paststatus',
        align: 'center',
        width: 140,
        render: (status, { endDate }) => {
          return (
            <span style={{ color: getColorVal(status) }}>
              {endDate ? paststatusVal[status] : '-'}
            </span>
          );
        },
      },
      {
        title: '装备数量',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
        width: 120,
        render: (data, record) => {
          const { equipCount, equipUnit } = record;
          return equipCount + (equipUnit || '个');
        },
      },
      {
        title: '装备单价(元)',
        dataIndex: 'equipPrice',
        key: 'equipPrice',
        align: 'center',
        width: 200,
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
              title="确认要删除该应急装备吗？"
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
            应急装备数量：
            {total}
          </div>
        }
      >
        {this.renderForm()}
        {list && list.length ? (
          <Card style={{ marginTop: '24px' }}>
            <Table
              rowKey="id"
              loading={loading}
              columns={unitType === 4 ? columns.slice(1, columns.length) : columns}
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
