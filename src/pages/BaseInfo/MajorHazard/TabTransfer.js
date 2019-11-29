import React, { PureComponent } from 'react';
import { Transfer, Table } from 'antd';
import difference from 'lodash/difference';

const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer {...restProps} showSelectAll={false}>
    {({
      direction, // 渲染列表的方向
      filteredItems, // 过滤后的数据
      onItemSelectAll, // 勾选一组条目
      onItemSelect, // 勾选条目
      selectedKeys: listSelectedKeys, // 选中的条目
      //disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;
      const rowSelection = {
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows.map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };
      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          pagination={false}
          onRow={({ key }) => ({
            onClick: () => {
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
        />
      );
    }}
  </Transfer>
);

const leftStorageColumns = [
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
const rightStorageColumns = [
  {
    dataIndex: 'areaName',
    title: '名称',
  },
  {
    dataIndex: 'code',
    title: '统一编码',
  },
];

const leftReserviorColumns = [
  {
    dataIndex: 'type',
    title: '类别',
    render: () => <span>库区</span>,
  },
  {
    dataIndex: 'unitCode',
    title: '统一编码',
  },
  {
    dataIndex: 'name',
    title: '名称',
  },
];
const rightReserviorColumns = [
  {
    dataIndex: 'name',
    title: '名称',
  },
  {
    dataIndex: 'unitCode',
    title: '统一编码',
  },
];

export default class TabTransfer extends PureComponent {
  state = {
    targetKeys: [], // 右侧数据keys
  };

  getDataList = (i, s, a) => {
    switch (+i) {
      case 1:
        return s;
      case 2:
        return a;
      case 3:
        return '';
      case 4:
        return '';
      default:
        return;
    }
  };

  getLeftColumns = i => {
    switch (+i) {
      case 1:
        return leftStorageColumns;
      case 2:
        return leftReserviorColumns;
      case 3:
        return '';
      case 4:
        return '';
      default:
        return;
    }
  };

  getRightColumns = i => {
    switch (+i) {
      case 1:
        return rightStorageColumns;
      case 2:
        return rightReserviorColumns;
      case 3:
        return '';
      case 4:
        return '';
      default:
        return;
    }
  };

  render() {
    const { areaList, storageList, targetKeys, onTargetKeysClick, dangerType } = this.props;

    return (
      <div>
        <TableTransfer
          dataSource={this.getDataList(dangerType, storageList, areaList)} // 数据源(左侧)
          targetKeys={targetKeys}
          onChange={i => onTargetKeysClick(i)}
          leftColumns={this.getLeftColumns(dangerType)}
          rightColumns={this.getRightColumns(dangerType)}
          rowKey={record => record.id}
        />
      </div>
    );
  }
}
