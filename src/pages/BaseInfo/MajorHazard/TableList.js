import React, { PureComponent } from 'react';
import { Table } from 'antd';

// 储罐区列表
const storageColumns = [
  {
    dataIndex: 'type',
    title: '类别',
    render: () => <span>储罐区</span>,
  },
  {
    dataIndex: 'code',
    title: '统一编码',
  },
  {
    dataIndex: 'areaName',
    title: '名称',
  },
];

// 库区列表
const reserviorColumns = [
  {
    dataIndex: 'type',
    title: '类别',
    render: () => <span>库区</span>,
  },
  {
    dataIndex: 'number',
    title: '统一编码',
  },
  {
    dataIndex: 'name',
    title: '名称',
  },
];

// 生产装置
const productColumns = [
  {
    dataIndex: 'type',
    title: '类别',
    render: () => <span>生产装置</span>,
  },
  {
    dataIndex: 'code',
    title: '统一编码',
  },
  {
    dataIndex: 'name',
    title: '名称',
  },
];

// 气柜列表
const gasColumns = [
  {
    dataIndex: 'type',
    title: '类别',
    render: () => <span>气柜</span>,
  },
  {
    dataIndex: 'unifiedCode',
    title: '统一编码',
  },
  {
    dataIndex: 'gasholderName',
    title: '名称',
  },
];

// 工业管道
const pipelineColumns = [
  {
    dataIndex: 'type',
    title: '类别',
    render: () => <span>工业管道</span>,
  },
  {
    dataIndex: 'code',
    title: '统一编码',
  },
  {
    dataIndex: 'name',
    title: '名称',
  },
];

export default class Modals extends PureComponent {
  getColumns = i => {
    switch (+i) {
      case 1:
        return storageColumns;
      case 2:
        return reserviorColumns;
      case 3:
        return productColumns;
      case 4:
        return gasColumns;
      case 5:
        return pipelineColumns;
      default:
        return;
    }
  };

  getDataList = (i, s, a, p, g, pi) => {
    switch (+i) {
      case 1:
        return s;
      case 2:
        return a;
      case 3:
        return p;
      case 4:
        return g;
      case 5:
        return pi;
      default:
        return;
    }
  };

  render() {
    const {
      loading,
      rowKey,
      dangerType,
      areaList,
      storageList,
      gasList,
      proEquipList,
      pipelineList,
      handleSelectChange,
    } = this.props;
    return (
      <Table
        style={{ marginTop: '16px' }}
        loading={loading}
        bordered
        size="middle"
        rowKey={rowKey || 'id'}
        dataSource={this.getDataList(
          dangerType,
          storageList,
          areaList,
          proEquipList,
          gasList,
          pipelineList
        )}
        columns={this.getColumns(dangerType)}
        pagination={false}
        rowSelection={{
          // selectedRowKeys,
          onChange: handleSelectChange,
          hideDefaultSelections: true,
          type: 'checkbox',
          // ...rowSelection,
        }}
        onChange={this.handleChangePagination}
      />
    );
  }
}
