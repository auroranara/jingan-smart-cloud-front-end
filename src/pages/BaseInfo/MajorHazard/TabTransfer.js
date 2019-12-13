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

// 储罐区列表
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

// 库区列表
const leftReserviorColumns = [
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

// 气柜列表
const leftGasColumns = [
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
const rightGasColumns = [
  {
    dataIndex: 'gasholderName',
    title: '名称',
  },
  {
    dataIndex: 'unifiedCode',
    title: '统一编码',
  },
];

// 生产装置
const leftProductColumns = [
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

const rightProductColumns = [
  {
    dataIndex: 'name',
    title: '名称',
  },
  {
    dataIndex: 'code',
    title: '统一编码',
  },
];

export default class TabTransfer extends PureComponent {
  getDataList = (i, s, a, p, g) => {
    switch (+i) {
      case 1:
        return s;
      case 2:
        return a;
      case 3:
        return p;
      case 4:
        return g;
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
        return leftProductColumns;
      case 4:
        return leftGasColumns;
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
        return rightProductColumns;
      case 4:
        return rightGasColumns;
      default:
        return;
    }
  };

  filterOption = (inputValue, option) => {
    const { dangerType } = this.props;
    if (+dangerType === 1) {
      return option.areaName.indexOf(inputValue) > -1;
    } else if (+dangerType === 2) {
      return option.name.indexOf(inputValue) > -1;
    } else if (+dangerType === 3) {
      return option.indexOf(inputValue) > -1;
    } else {
      return option.gasholderName.indexOf(inputValue) > -1;
    }
  };

  render() {
    const {
      areaList,
      storageList,
      gasList,
      proEquipList,
      targetKeys,
      onTargetKeysClick,
      dangerType,
    } = this.props;

    return (
      <div>
        <TableTransfer
          showSearch
          dataSource={this.getDataList(dangerType, storageList, areaList, proEquipList, gasList)} // 数据源(左侧)
          targetKeys={targetKeys}
          onSearch={this.handleSearch}
          filterOption={this.filterOption}
          onChange={i => onTargetKeysClick(i)}
          leftColumns={this.getLeftColumns(dangerType)}
          rightColumns={this.getRightColumns(dangerType)}
          rowKey={record => record.id}
        />
      </div>
    );
  }
}
