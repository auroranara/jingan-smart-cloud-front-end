import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Popconfirm,
  Card,
  Input,
  Pagination,
  Select,
  Button,
  Table,
  Spin,
  Divider,
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
  baseInfo: {
    storehouse: { detail: detailCode, edit: editCode, add: addCode, delete: deleteCode },
  },
} = codes;
const addUrl = '/base-info/storehouse/add';

const { Option } = Select;
const title = '库房管理';
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '一企一档',
    name: '一企一档',
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

@connect(({ storehouse, user, loading }) => ({
  storehouse,
  user,
  loading: loading.models.storehouse,
}))
export default class StorehouseList extends PureComponent {
  state = {
    formData: {},
  };

  componentDidMount() {
    this.fetchList(1);
    this.fetchCompanyNum();
  }

  pageNum = 1;
  pageSize = 10;

  fetchList = (pageNum, pageSize = 10, filters = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'storehouse/fetchStorehouseList',
      payload: {
        pageNum,
        pageSize,
        ...filters,
      },
    });
  };

  fetchCompanyNum = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'storehouse/fetchCountCompanyNum',
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
        id: 'name',
        render() {
          return <Input placeholder="请输入库房名称" />;
        },
        transform,
      },
      {
        id: 'code',
        render() {
          return <Input placeholder="请输入库房编号" />;
        },
        transform,
      },
      {
        id: 'position',
        render() {
          return <Input placeholder="请输入区域位置" />;
        },
        transform,
      },
      {
        id: 'dangerSource',
        render() {
          const options = [{ value: '0', name: '否' }, { value: '1', name: '是' }];
          return (
            <Select
              allowClear
              showSearch
              placeholder="是否是重大危险源"
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
        id: 'aName',
        render() {
          return <Input placeholder="请输入库区名称" />;
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
              新增库房
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

  goEdit = id => {
    router.push(`/base-info/storehouse/edit/${id}`);
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
      type: 'storehouse/deleteStorehouse',
      payload: {
        id,
      },
      success: () => {
        message.success('删除成功！');
        this.fetchList(this.pageNum, this.pageSize, { ...formData });
        this.fetchCompanyNum();
      },
      error: msg => {
        message.error(msg);
      },
    });
  };

  render() {
    const {
      loading = false,
      storehouse: {
        list,
        pagination: { pageNum = 1, pageSize = 10, total = 0 } = {},
        countCompanyNum = 0,
      },
    } = this.props;
    const { currentPage } = this.state;

    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
        width: 180,
      },
      {
        title: '基本信息',
        dataIndex: 'basicInfo',
        key: 'basicInfo',
        align: 'center',
        width: 250,
        render: (data, record) => {
          const { code, number, name, area, dangerSource } = record;
          return (
            <div className={styles.multi}>
              <div>
                库房编号：
                {code}
              </div>
              <div>
                库房序号：
                {number}
              </div>
              <div>
                库房名称：
                {name}
              </div>
              <div>
                库房面积（㎡）：
                {area}
              </div>
              <div>
                重大危险源：
                {dangerSource === '0' ? '否' : '是'}
              </div>
            </div>
          );
        },
      },
      {
        title: '所属库区',
        dataIndex: 'areaInfo',
        key: 'areaInfo',
        align: 'center',
        width: 240,
        render: (data, record) => {
          const { anumber, aname } = record;
          return (
            <div className={styles.multi}>
              <div>
                库区编号：
                {anumber}
              </div>
              <div>
                库区名称：
                {aname}
              </div>
            </div>
          );
        },
      },
      {
        title: '贮存物质名称',
        dataIndex: 'materialsName',
        key: 'materialsName',
        align: 'center',
        width: 250,
        render: data =>
          data ? (
            <div className={styles.multi}>
              {JSON.parse(data).map(item => (
                <div key={item.materialId}>{item.chineName + item.unitChemiclaNum + '吨'}</div>
              ))}
            </div>
          ) : (
            ''
          ),
      },
      {
        title: '区域位置',
        dataIndex: 'position',
        key: 'position',
        align: 'center',
        width: 120,
      },
      {
        title: '已绑传感器',
        dataIndex: 'sensor',
        key: 'sensor',
        align: 'center',
        width: 100,
        render: (data, record) => {
          return 0;
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        width: 200,
        render: (data, record) => (
          <span>
            <AuthA code={editCode} onClick={() => this.bindSensor(record.id)}>
              绑定传感器
            </AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.goEdit(record.id)}>
              编辑
            </AuthA>
            <Divider type="vertical" />
            <Popconfirm title="确认要删除该库房吗？" onConfirm={() => this.handleDelete(record.id)}>
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
            {countCompanyNum}
            <span style={{ marginLeft: 15 }}>
              库房数量：
              {total}
            </span>
            <span style={{ marginLeft: 15 }}>已绑传感器数：0</span>
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
              scroll={{ x: 'max-content' }}
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
