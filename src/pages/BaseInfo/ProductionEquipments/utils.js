import React, { Fragment } from 'react';
import Link from 'umi/link';
import { Input, message, Popconfirm, Select, Form } from 'antd';

import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';

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
  { title: '重大危险源基本信息', name: '重大危险源基本信息' },
  { title: '生产装置', name: '生产装置', href: LIST_URL },
];

const deviceStatusList = [
  { key: '1', value: '正常' },
  { key: '2', value: '维检' },
  { key: '3', value: '报废' },
];

export const SEARCH_FIELDS = [
  // modify
  {
    id: 'companyName',
    label: '单位名称',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'code',
    label: '装置编号',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'name',
    label: '装置名称',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'model',
    label: '设备型号',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'location',
    label: '装置位置',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'dangerTechnology',
    label: '化工工艺',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'deviceStatus',
    label: '装置状态',
    render: () => (
      <Select placeholder="请输入" allowClear>
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
  },
  {
    title: '装置信息',
    dataIndex: 'info',
    key: 'info',
    align: 'center',
    render: () => {
      return (
        <div>
          <p>装置编号:</p>
          <p>装置名称:</p>
          <p>设备型号:</p>
        </div>
      );
    },
  },
  {
    title: '是否关键装置',
    dataIndex: 'keyDevice',
    key: 'keyDevice',
    align: 'center',
    render: val => {
      return +val === 1 ? '是' : '否';
    },
  },
  {
    title: '危化工艺',
    dataIndex: 'dangerTechnology',
    key: 'dangerTechnology',
    align: 'center',
    render: () => {
      return (
        <div>
          <p>化工工艺:</p>
          <p>危化品:</p>
          <p>危化品数量:</p>
        </div>
      );
    },
  },
  {
    title: '装置状态',
    dataIndex: 'deviceStatus',
    key: 'deviceStatus',
    align: 'center',
    render: val => {
      return getDeviceStatus[val];
    },
  },
  {
    title: '',
    dataIndex: 'otherInfo',
    key: 'otherInfo',
    align: 'center',
    render: () => {
      return (
        <div>
          <p>装置功能:</p>
          <p>生产能力:</p>
          <p>装置能耗:</p>
          <p>装置技术条件:</p>
          <p>设计压力:</p>
        </div>
      );
    },
  },
  {
    title: '装置位置',
    dataIndex: 'location',
    key: 'location',
    align: 'center',
  },
  {
    title: '已绑定传感器',
    dataIndex: 'bindSensor',
    key: 'bindSensor',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render(id) {
      return (
        <Fragment>
          <Link to={`${ROUTER}/edit/${id}`}>绑定传感器</Link>
          <Link to={`${ROUTER}/edit/${id}`}>编辑</Link>
          <Popconfirm
            title="确定删除当前项目？"
            onConfirm={e => message.success('删除成功')}
            okText="确定"
            cancelText="取消"
          >
            <span className={styles1.delete}>删除</span>
          </Popconfirm>
        </Fragment>
      );
    },
  },
];
