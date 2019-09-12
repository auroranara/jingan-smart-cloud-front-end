import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Input, Pagination, Select, Button, Table, Spin } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import router from 'umi/router';

import { hasAuthority } from '@/utils/customAuth';
import InlineForm from '../../../BaseInfo/Company/InlineForm';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';

const {
  baseInfo: {
    specialEquipment: { detail: detailCode, edit: editCode, add: addCode },
  },
} = codes;
const addUrl = '/base-info/special-equipment/add';

const { Option } = Select;
const title = '特种设备管理';
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

@connect(({ emergencyPlan, user, loading }) => ({
  emergencyPlan,
  user,
  loading: loading.models.emergencyPlan,
}))
export default class EmergencyPlanList extends PureComponent {
  state = {};

  renderForm = () => {
    const {
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    const fields = [
      {
        id: 'deviceCode',
        render() {
          const options = [];
          return (
            <Select
              allowClear
              showSearch
              placeholder="请选择代码"
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
        id: 'deviceCode',
        render() {
          const options = [];
          return (
            <Select
              allowClear
              showSearch
              placeholder="请选择种类"
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
        id: 'deviceCode',
        render() {
          const options = [];
          return (
            <Select
              allowClear
              showSearch
              placeholder="请选择类别"
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
        id: 'deviceCode',
        render() {
          const options = [];
          return (
            <Select
              allowClear
              showSearch
              placeholder="请选择品种"
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
          return <Input placeholder="请输入设备编号" />;
        },
        transform,
      },
      {
        id: 'companyName',
        render() {
          return <Input placeholder="请输入设备名称" />;
        },
        transform,
      },
      {
        id: 'companyName',
        render() {
          return <Input placeholder="请输入品牌" />;
        },
        transform,
      },
      {
        id: 'companyName',
        render() {
          return <Input placeholder="请输入型号" />;
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
              新增特种设备
            </Button>
          }
        />
      </Card>
    );
  };

  goToAdd = () => {
    router.push(addUrl);
  };

  handleSearch = () => {
    return null;
  };

  handleReset = () => {
    return null;
  };

  render() {
    const { loading = false } = this.props;
    const list = [];
    const { pageNum = 1, pageSize = 10, total = 0 } = {};
    const { currentPage } = this.state;

    const columns = [];
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            单位数量：
            {total}
            <span style={{ marginLeft: 15 }}>设备总数：0</span>
            <span style={{ marginLeft: 15 }}>已绑传感器数：0</span>
          </div>
        }
      >
        {this.renderForm()}
        {list && list.length ? (
          <Card style={{ marginTop: '24px' }}>
            <Table
              rowKey="index"
              loading={loading}
              columns={columns}
              dataSource={[]}
              pagination={false}
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
