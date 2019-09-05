import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Table, Divider, Popconfirm, Button, Modal, Input, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { AuthButton, AuthA } from '@/utils/customAuth';
import codes from '@/utils/codes';

const title = '型号管理'

@connect(({ user, device }) => ({
  user,
  device,
}))
export default class ModelList extends PureComponent {


  /**
   * 渲染型号列表
   */
  renderTable = () => {
    const {
      device: {
        model: {
          list = [],
          pagination: { total, pageNum, pageSize },
        },
      },
    } = this.props
    const columns = [
      {
        title: '型号名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        render: (val, row) => (
          <Fragment>
            <AuthA code={codes.deviceManagement.brand.edit} onClick={() => this.handleViewEdit(row)}>编辑</AuthA>
            <Divider type="vertical" />
            <Popconfirm title="确认要删除该监测类型吗？" onConfirm={() => this.handleDelete(row.id)}>
              <AuthA code={codes.deviceManagement.brand.delete}>删除</AuthA>
            </Popconfirm>
            <Divider type="vertical" />
            <a>型号管理</a>
          </Fragment>
        ),
      },
    ]
    return (
      <Card style={{ marginTop: '20px' }}>
        {list && list.length ? (
          <Table
            // loading={loading}
            rowKey="id"
            columns={columns}
            dataSource={list}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15', '20'],
              onChange: this.handleQuery,
              onShowSizeChange: (num, size) => {
                this.handleQuery(1, size);
              },
            }}
            bordered
          />
        ) : (
            <div style={{ textAlign: 'center' }}>暂无数据</div>
          )}
      </Card>
    );
  }

  render() {
    const {
      device: {
        model: {
          pagination: { total = 0 },
        },
      },
    } = this.props
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '设备管理', name: '设备管理' },
      { title: '/device-management/brand/list', name: '品牌管理' },
      { title, name: title },
    ]
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={`型号总数：${total}`}
      >
        {this.renderTable()}
      </PageHeaderLayout>
    )
  }
}
