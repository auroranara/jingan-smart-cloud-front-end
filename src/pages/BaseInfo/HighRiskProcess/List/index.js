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
    highRiskProcess: { detail: detailCode, edit: editCode, add: addCode },
  },
} = codes;
const addUrl = '/base-info/high-risk-process/add';

const { Option } = Select;
const title = '高危工艺流程';
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
        id: 'unitCompanyName',
        render() {
          return <Input placeholder="请输入高危工艺名称" />;
        },
        transform,
      },
      {
        id: 'unitCompanyName',
        render() {
          return <Input placeholder="请输入统一编码" />;
        },
        transform,
      },
      {
        id: 'deviceCode',
        render() {
          const options = [
            { value: '1', name: '1级' },
            { value: '2', name: '2级' },
            { value: '3', name: '3级' },
            { value: '4', name: '4级' },
          ];
          return (
            <Select
              allowClear
              showSearch
              placeholder="请选择SIL等级"
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
          const options = [{ value: '1', name: '是' }, { value: '0', name: '否' }];
          return (
            <Select
              allowClear
              showSearch
              placeholder="是否是重点监管危险化工工艺"
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
          fields={fields}
          gutter={{ lg: 48, md: 24 }}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
          action={
            <Button type="primary" onClick={this.goToAdd} disabled={!hasAddAuthority}>
              新增工艺流程
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
            <span style={{ marginLeft: 15 }}>高危工艺流程：0</span>
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
