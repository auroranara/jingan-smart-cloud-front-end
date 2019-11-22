import React, { Fragment } from 'react';
// import moment from 'moment';
import { Input, Select } from 'antd';
import Ellipsis from '@/components/Ellipsis';

const { Option } = Select;

export const PAGE_SIZE = 1;
export const ROUTER = '/two-information-management'; // modify
export const LIST_URL = `${ROUTER}/safety-risk-list/list`;
export const LIST = [
  // modify
  {
    companyName: '无锡晶安智慧科技有限公司',
    id: '1',
    riskPointName: '预防事故设施',
    area: '场所/环节/部位',
    dangerFactor: '危险因素',
    result: '后果',
  },
];

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '两单信息管理', name: '两单信息管理' },
  { title: '安全风险分级管控清单', name: '安全风险分级管控清单', href: LIST_URL },
];

const riskClassifyList = [
  {
    key: '1',
    value: '危险化学品',
  },
  {
    key: '2',
    value: '爆炸性粉尘',
  },
  {
    key: '3',
    value: '重大危险源',
  },
  {
    key: '4',
    value: '受限空间',
  },
  {
    key: '5',
    value: '涉氨场所',
  },
  {
    key: '6',
    value: '生产系统',
  },
  {
    key: '7',
    value: '设备设施',
  },
  {
    key: '8',
    value: '输送管线',
  },
  {
    key: '9',
    value: '操作行为',
  },
  {
    key: '10',
    value: '职业健康',
  },
  {
    key: '11',
    value: '环境条件',
  },
  {
    key: '12',
    value: '施工场所',
  },
  {
    key: '13',
    value: '安全管理',
  },
  {
    key: '13',
    value: '安全管理',
  },
  {
    key: '14',
    value: '公用工程',
  },
  {
    key: '15',
    value: '储存场所',
  },
  {
    key: '16',
    value: '其他',
  },
];

const dangerLevelList = [
  {
    key: '1',
    value: '红',
  },
  {
    key: '2',
    value: '橙',
  },
  {
    key: '3',
    value: '黄',
  },
  {
    key: '4',
    value: '蓝',
  },
];
export const SEARCH_FIELDS = [
  // modify
  {
    id: 'companyName',
    label: '单位名称：',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'name',
    label: '作业/设备名称：',
    render: () => <Input placeholder="请输入" allowClear />,
  },
  {
    id: 'riskClassify',
    label: '风险分类：',
    render: () => (
      <Select placeholder="请选择" allowClear>
        {riskClassifyList.map(({ key, value }) => (
          <Option key={key} value={key}>
            {value}
          </Option>
        ))}
      </Select>
    ),
  },
  {
    id: 'dangerLevel',
    label: '风险等级：',
    render: () => (
      <Select placeholder="请选择" allowClear>
        {dangerLevelList.map(({ key, value }) => (
          <Option key={key} value={key}>
            {value}
          </Option>
        ))}
      </Select>
    ),
  },
];

export const TABLE_COLUMNS = [
  {
    title: '单位名称',
    dataIndex: 'companyName',
    key: 'companyName',
    align: 'center',
    width: 260,
    render: val => (
      <Ellipsis tooltip length={15} style={{ overflow: 'visible' }}>
        {val}
      </Ellipsis>
    ),
  },
  {
    title: '作业/设备名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    width: 180,
  },
  {
    title: '风险分类',
    dataIndex: 'riskClassifyName',
    key: 'riskClassifyName',
    align: 'center',
    width: 180,
  },
  {
    title: '主要危险因素',
    dataIndex: 'dangerFactor',
    key: 'dangerFactor',
    align: 'center',
    width: 300,
    render: val => (
      <Ellipsis tooltip length={35} style={{ overflow: 'visible' }}>
        {val}
      </Ellipsis>
    ),
  },
  {
    title: '易导致后果（风险）',
    dataIndex: 'consequenceName',
    key: 'consequenceName',
    align: 'center',
    width: 180,
    render: val => (
      <Ellipsis tooltip length={40} style={{ overflow: 'visible' }}>
        {val}
      </Ellipsis>
    ),
  },
  {
    title: '作业条件危险性评价',
    dataIndex: 'result',
    key: 'result',
    align: 'center',
    children: [
      {
        title: 'L',
        dataIndex: 'l',
        key: 'l',
        width: 90,
        align: 'center',
      },
      {
        title: 'E',
        dataIndex: 'e',
        key: 'e',
        width: 90,
        align: 'center',
      },
      {
        title: 'C',
        dataIndex: 'c',
        key: 'c',
        width: 90,
        align: 'center',
      },
      {
        title: 'D',
        dataIndex: 'd',
        key: 'd',
        width: 90,
        align: 'center',
      },
    ],
  },
  {
    title: '风险等级',
    dataIndex: 'dangerLevelName',
    key: 'dangerLevelName',
    align: 'center',
    width: 120,
  },
  {
    title: '风险管控措施',
    dataIndex: 'dangerMeasure',
    key: 'dangerMeasure',
    align: 'center',
    width: 300,
    render: val => (
      <Ellipsis tooltip length={35} style={{ overflow: 'visible' }}>
        {val}
      </Ellipsis>
    ),
  },
  {
    title: '应急处置措施',
    dataIndex: 'consequenceMeasure',
    key: 'consequenceMeasure',
    align: 'center',
    width: 300,
    render: val => (
      <Ellipsis tooltip length={35} style={{ overflow: 'visible' }}>
        {val}
      </Ellipsis>
    ),
  },
];

export const EDIT_FORMITEMS = [
  // modify
  { name: 'companyName', label: '单位名称', required: false },
  {
    name: 'name',
    label: '作业/设备名称',
    required: false,
  },
  { name: 'riskClassifyName', label: '风险分类', required: false },
  { name: 'dangerFactor', label: '主要危险因素', type: 'text', required: false },
  { name: 'consequenceName', label: '易导致后果（风险）', type: 'text', required: false },
  { name: 'l', label: '时间发生的可能性（L)', required: false },
  { name: 'e', label: ' 频繁程度（E)', required: false },
  { name: 'c', label: '后果（C)', required: false },
  { name: 'd', label: '计算风险值（D)', required: false },
  { name: 'dangerLevelName', label: '风险等级', required: false },
  { name: 'dangerMeasure', label: '风险管控措施', type: 'text' },
  { name: 'consequenceMeasure', label: '应急处置措施', type: 'text', required: false },
];
