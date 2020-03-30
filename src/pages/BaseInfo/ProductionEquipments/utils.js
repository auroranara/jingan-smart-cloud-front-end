import React from 'react';
import { Input, Select } from 'antd';

const { Option } = Select;

export const PAGE_SIZE = 20;
export const ROUTER = '/major-hazard-info/production-equipments'; // modify
export const LIST_URL = `${ROUTER}/list`;
export const LIST = [
  // modify
  { index: 1, id: '1', name: '列一示例', multi: ['行一', '行二'] },
];

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '基本信息', name: '基本信息' },
  { title: '生产装置', name: '生产装置', href: LIST_URL },
];

const deviceStatusList = [
  { key: '1', value: '正常' },
  { key: '2', value: '维检' },
  { key: '3', value: '报废' },
];

const dangerSourceList = [{ key: '0', value: '否' }, { key: '1', value: '是' }];

export const SEARCH_FIELDS = [
  // modify
  {
    id: 'companyName',
    // label: '单位名称',
    render: () => <Input placeholder="单位名称" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'code',
    // label: '装置编号',
    render: () => <Input placeholder="装置编号/装置名称" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'dangerSource',
    render: () => (
      <Select placeholder="是否构成重大危险源" allowClear>
        {dangerSourceList.map(({ key, value }) => (
          <Option key={key} value={key}>
            {value}
          </Option>
        ))}
      </Select>
    ),
  },
  {
    id: 'deviceStatus',
    // label: '装置状态',
    render: () => (
      <Select placeholder="装置状态" allowClear>
        {deviceStatusList.map(({ key, value }) => (
          <Option key={key} value={key}>
            {value}
          </Option>
        ))}
      </Select>
    ),
  },
];

const getDeviceStatus = {
  1: '正常',
  2: '维检',
  3: '报废',
};

export const TABLE_COLUMNS = [
  // modify
  {
    title: '单位名称',
    dataIndex: 'companyName',
    key: 'companyName',
    align: 'center',
    width: 300,
  },
  {
    title: '装置信息',
    dataIndex: 'info',
    key: 'info',
    align: 'center',
    width: 200,
    render: (val, row) => {
      return (
        <div style={{ textAlign: 'left' }}>
          <p>
            装置编号:
            {row.code}
          </p>
          <p>
            装置名称:
            {row.name}
          </p>
          <p>
            设备型号:
            {row.model}
          </p>
          <p>
            装置位置:
            {row.location}
          </p>
          <p>
            关键装置:
            {+row.keyDevice === 1 ? '是' : '否'}
          </p>
        </div>
      );
    },
  },
  {
    title: '装置状态',
    dataIndex: 'deviceStatus',
    key: 'deviceStatus',
    align: 'center',
    width: 100,
    render: val => {
      return getDeviceStatus[val];
    },
  },
  {
    title: '危化工艺',
    dataIndex: 'dangerTechnology',
    key: 'dangerTechnology',
    align: 'center',
    width: 250,
    render: (val, row) => {
      const { dangerTechnologyList, unitChemiclaNumDetail } = row;
      const processName = dangerTechnologyList.map(item => item.processName).join(',');
      const chineName = unitChemiclaNumDetail.map(item => item.chineName).join(',');
      // const unitChemiclaNum = unitChemiclaNumDetail
      //   .map(item => item.unitChemiclaNum + 't')
      //   .join(',');
      return (
        <div style={{ textAlign: 'left' }}>
          <p>
            化工工艺:
            {processName}
          </p>
          <p>
            危化品:
            {chineName}
          </p>
          {/* <p>
            危化品数量:
            {unitChemiclaNum}
          </p> */}
        </div>
      );
    },
  },
  {
    title: '是否构成重大危险源',
    dataIndex: 'dangerSource',
    align: 'center',
    width: 200,
    render: val => {
      return +val === 0 ? '否' : '是';
    },
  },
  // {
  //   title: '装置参数',
  //   dataIndex: 'otherInfo',
  //   key: 'otherInfo',
  //   align: 'center',
  //   width: 250,
  //   render: (val, row) => {
  //     return (
  //       <div style={{ textAlign: 'left' }}>
  //         <p>
  //           装置功能:
  //           {row.deviceFunction}
  //         </p>
  //         <p>
  //           生产能力:
  //           {row.deviceProduct}
  //         </p>
  //         <p>
  //           装置能耗:
  //           {row.deviceEnergyConsumption}
  //         </p>
  //         <p>
  //           装置技术条件:
  //           {row.deviceTechnology}
  //         </p>
  //         <p>
  //           设计压力:
  //           {row.pressure}
  //           KPa
  //         </p>
  //       </div>
  //     );
  //   },
  // },
];

export const AutoList = [{ key: '1', value: 'PLC控制' }, { key: '2', value: 'DCS控制' }];
