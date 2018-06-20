import React, { Component } from 'react';
import { Card, Table } from 'antd';

const TABLE_ACTION_MARGIN_RIGHT = 10;

const deviceColumns = [
  {
    title: '装置编号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '品牌',
    dataIndex: 'brand',
    key: 'brand',
  },
  {
    title: '型号',
    dataIndex: 'model',
    key: 'model',
  },
  {
    title: '安装位置',
    dataIndex: 'position',
    key: 'position',
  },
  {
    title: '生产日期',
    dataIndex: 'productionDate',
    key: 'productionDate',
  },
  {
    title: '接入主机数量',
    dataIndex: 'hostQuantity',
    key: 'hostQuantity',
  },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <span>
        <a style={{ marginRight: TABLE_ACTION_MARGIN_RIGHT }}>编辑</a>
        <a>删除</a>
      </span>
    ),
  },
];

const hostColumns = [
  {
    title: '主机编号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '品牌',
    dataIndex: 'brand',
    key: 'brand',
  },
  {
    title: '型号',
    dataIndex: 'model',
    key: 'model',
  },
  {
    title: '传输接口',
    dataIndex: 'interface',
    key: 'interface',
  },
  {
    title: '安装位置',
    dataIndex: 'position',
    key: 'position',
  },
  {
    title: '生产日期',
    dataIndex: 'productionDate',
    key: 'productionDate',
  },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <span>
        <a style={{ marginRight: TABLE_ACTION_MARGIN_RIGHT }}>编辑</a>
        <a style={{ marginRight: TABLE_ACTION_MARGIN_RIGHT }}>删除</a>
        <a>导入位点</a>
      </span>
    ),
  },
];

function setColumnAlign(columns, align = 'center') {
  return columns.map(column => ({ ...column, align }));
}

export default class DeviceDetailCard extends Component {
  renderDeviceTable() {
    return (
      <Table
        pagination={false}
        columns={setColumnAlign(deviceColumns)}
        dataSource={this.props.deviceData}
        rowKey="index"
        style={{ marginBottom: 20 }}
      />
    );
  }

  renderHostTable() {
    return (
      <Table
        pagination={false}
        columns={setColumnAlign(hostColumns)}
        dataSource={this.props.hostData}
        rowKey="index"
      />
    );
  }

  render() {
    return (
      <Card style={{ marginBottom: 30 }}>
        <h5>用户传输装置{this.props.index}</h5>
        {this.renderDeviceTable()}
        <h5>关联消费主机</h5>
        {this.renderHostTable()}
      </Card>
    );
  }
}
