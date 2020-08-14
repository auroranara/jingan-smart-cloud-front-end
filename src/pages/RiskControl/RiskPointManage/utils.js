import { partClassification } from '@/pages/KeyPart/List.js';
import { Tooltip } from 'antd';

// PRODUCTION_PLANT(1,"生产装置"),
// PRODUCTION_FACILITIES(2,"生产设施"),
// SPECIAL_EQUIPMENT(3,"特种设备"),
// KEY_PARTS(4,"关键装置重点部位"),
// SAFETY_FACILITIES(5,"安全设施");

export const EquipColumns = {
  1: [
    {
      title: '设备类型',
      dataIndex: 'equipmentType',
      key: 'equipmentType',
      render: () => '生产装置',
    },
    {
      title: '装置编号',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '装置名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: {
        showTitle: false,
      },
      render: val => (
        <Tooltip placement="topLeft" title={val}>
          {val}
        </Tooltip>
      ),
    },
    {
      title: '装置位置',
      dataIndex: 'location',
      key: 'location',
      ellipsis: {
        showTitle: false,
      },
      render: val => (
        <Tooltip placement="topLeft" title={val}>
          {val}
        </Tooltip>
      ),
    },
  ],
  2: [
    {
      title: '设备类型',
      dataIndex: 'equipmentType',
      key: 'equipmentType',
      render: () => '生产设施',
    },
    {
      title: '装置设施位号',
      dataIndex: 'facilitiesNumber',
      key: 'facilitiesNumber',
      ellipsis: {
        showTitle: false,
      },
      render: val => (
        <Tooltip placement="topLeft" title={val}>
          {val}
        </Tooltip>
      ),
    },
    {
      title: '装置设施名称',
      dataIndex: 'facilitiesName',
      key: 'facilitiesName',
      ellipsis: {
        showTitle: false,
      },
      render: val => (
        <Tooltip placement="topLeft" title={val}>
          {val}
        </Tooltip>
      ),
    },
    {
      title: '设置部位',
      dataIndex: 'usePart',
      key: 'usePart',
      ellipsis: {
        showTitle: false,
      },
      render: val => (
        <Tooltip placement="topLeft" title={val}>
          {val}
        </Tooltip>
      ),
    },
  ],
  3: [
    {
      title: '设备类型',
      dataIndex: 'equipmentType',
      key: 'equipmentType',
      render: () => '特种设备',
    },
    {
      title: '出厂编号',
      dataIndex: 'factoryNumber',
      key: 'factoryNumber',
    },
    {
      title: '设备名称',
      dataIndex: 'equipName',
      key: 'equipName',
      ellipsis: {
        showTitle: false,
      },
      render: val => (
        <Tooltip placement="topLeft" title={val}>
          {val}
        </Tooltip>
      ),
    },
    {
      title: '使用部位',
      dataIndex: 'usePart',
      key: 'usePart',
      ellipsis: {
        showTitle: false,
      },
      render: val => (
        <Tooltip placement="topLeft" title={val}>
          {val}
        </Tooltip>
      ),
    },
  ],
  4: [
    {
      title: '设备类型',
      dataIndex: 'equipmentType',
      key: 'equipmentType',
      render: () => '关键装置重点部位',
    },
    {
      title: '装置部位分类',
      dataIndex: 'type',
      key: 'type',
      render: val => (partClassification[val] || {}).value,
    },
    {
      title: '装置/部位名称',
      dataIndex: 'facilityName',
      key: 'facilityName',
      ellipsis: {
        showTitle: false,
      },
      render: val => (
        <Tooltip placement="topLeft" title={val}>
          {val}
        </Tooltip>
      ),
    },
    {
      title: '具体位置',
      dataIndex: 'location',
      key: 'location',
      ellipsis: {
        showTitle: false,
      },
      render: val => (
        <Tooltip placement="topLeft" title={val}>
          {val}
        </Tooltip>
      ),
    },
  ],
  5: [
    {
      title: '设备类型',
      dataIndex: 'equipmentType',
      key: 'equipmentType',
      render: () => '安全设施',
    },
    {
      title: '出厂编号',
      dataIndex: 'leaveProductNumber',
      key: 'leaveProductNumber',
    },
    {
      title: '设备名称',
      dataIndex: 'safeFacilitiesLabel',
      key: 'safeFacilitiesLabel',
      ellipsis: {
        showTitle: false,
      },
      render: val => (
        <Tooltip placement="topLeft" title={val}>
          {val}
        </Tooltip>
      ),
    },
    {
      title: '安装部位',
      dataIndex: 'installPart',
      key: 'installPart',
    },
  ],
};
