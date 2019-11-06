import React, { Fragment } from 'react';
import Link from 'umi/link';
// import moment from 'moment';
import { Input, message, Popconfirm, Select } from 'antd';

import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';

const { Option } = Select;

const DATE_FORMAT = 'YYYY-MM-DD';
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

export const SEARCH_FIELDS = [
  // modify
  {
    id: 'id1',
    label: '单位名称：',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'id2',
    label: '作业/设备名称：',
    render: () => <Input placeholder="请输入" allowClear />,
  },
  {
    id: 'id3',
    label: '风险分类：',
    render: () => (
      <Select placeholder="请选择" allowClear>
        {[
          '危险化学品',
          '爆炸性粉尘',
          '重大危险源',
          '受限空间',
          '涉氨场所',
          '生产系统',
          '设备设施',
          '输送管线',
          '操作行为',
          '职业健康',
          '环境条件',
          '施工场所',
          '安全管理',
          '其他',
        ].map((r, i) => (
          <Option key={i}>{r}</Option>
        ))}
      </Select>
    ),
  },
  {
    id: 'id4',
    label: '风险等级：',
    render: () => (
      <Select placeholder="请选择" allowClear>
        {['红', '橙', '黄', '蓝'].map((r, i) => (
          <Option key={i}>{r}</Option>
        ))}
      </Select>
    ),
  },
];

export const TABLE_COLUMNS = [
  // modify
  {
    title: '单位名称',
    dataIndex: 'companyName',
    key: 'companyName',
    align: 'center',
    width: 240,
  },
  {
    title: '作业/设备名称',
    dataIndex: 'riskPointName',
    key: 'riskPointName',
    align: 'center',
  },
  {
    title: '风险分类',
    dataIndex: 'area',
    key: 'area',
    align: 'center',
  },
  {
    title: '主要危险因素',
    dataIndex: 'dangerFactor',
    key: 'dangerFactor',
    align: 'center',
  },
  {
    title: '易导致后果（风险）',
    dataIndex: 'result',
    key: 'result',
    align: 'center',
  },
  {
    title: '作业条件危险性评价',
    children: [
      {
        title: 'L',
        dataIndex: 'L',
        key: 'L',
      },
      {
        title: 'E',
        dataIndex: 'E',
        key: 'E',
      },
      {
        title: 'C',
        dataIndex: 'C',
        key: 'C',
      },
      {
        title: 'D',
        dataIndex: 'D',
        key: 'D',
      },
    ],
    dataIndex: 'result',
    key: 'result',
    align: 'center',
  },
  {
    title: '风险等级',
    dataIndex: 'level',
    key: 'level',
    align: 'center',
  },
  {
    title: '风险管控措施',
    dataIndex: 'controlMeasures',
    key: 'controlMeasures',
    align: 'center',
  },
  {
    title: '应急处置措施',
    dataIndex: 'emergencyMeasure',
    key: 'emergencyMeasure',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    render: (val, text) => {
      return (
        <Fragment>
          <Link to={`${ROUTER}/safety-risk-list/view/${text.id}`}>查看</Link>
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

export const EDIT_FORMITEMS = [
  // modify
  { name: 'companyName', label: '单位名称' },
  {
    name: 'type',
    label: '作业/设备名称',
  },
  { name: 'facilitiesName', label: '风险分类' },
  { name: 'models', label: '主要危险因素', type: 'text' },
  { name: 'enginFacility', label: '易导致后果（风险）', type: 'text' },
  { name: 'enginFacility', label: '时间发生的可能性（L)' },
  { name: 'enginFacility', label: ' 频繁程度（E)' },
  { name: 'enginFacility', label: '后果（C)' },
  { name: 'enginFacility', label: '计算风险值（D)', required: false },
  { name: 'enginFacility', label: '风险等级', required: false },
  { name: 'enginFacility', label: '风险管控措施', type: 'text' },
  { name: 'enginFacility', label: '应急处置措施', type: 'text' },
];
