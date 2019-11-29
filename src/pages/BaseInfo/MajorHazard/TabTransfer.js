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

  render() {
    const { areaList, storageList, targetKeys, onTargetKeysClick, dangerType } = this.props;

    const allLeftColumds = +dangerType === 1 ? leftStorageColumns : leftReserviorColumns;
    const allRightColumds = +dangerType === 1 ? rightStorageColumns : rightReserviorColumns;

    const data = +dangerType === 1 ? storageList : areaList;

    return (
      <div>
        <TableTransfer
          dataSource={[...data]} // 数据源(左侧)
          targetKeys={targetKeys}
          onChange={i => onTargetKeysClick(i)}
          leftColumns={allLeftColumds}
          rightColumns={allRightColumds}
          rowKey={record => record.id}
        />
      </div>
    );
  }
}
