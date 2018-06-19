import React, { Component } from 'react';
import { Card, Table } from 'antd';

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
        <a>编辑</a>
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
        <a>编辑</a>
        <a>删除</a>
      </span>
    ),
  },
];

export default class DeviceDetailCard extends Component {
  renderDeviceTable() {
    return <Table columns={deviceColumns} dataSource={this.props.deviceData} />;
  }

  renderHostTable() {
    return <Table columns={hostColumns} dataSource={this.props.hostData} />;
  }

  render() {
    return (
      <Card type="inner">
        <h5>用户传输装置{this.props.index}</h5>
        {this.renderDeviceTable()}
        <h5>关联消费主机</h5>
        {this.renderHostTable()}
      </Card>
    );
  }
}
