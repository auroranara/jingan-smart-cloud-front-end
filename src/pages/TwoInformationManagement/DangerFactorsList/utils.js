import React from 'react';
// import Link from 'umi/link';
import Ellipsis from '@/components/Ellipsis';
import { Input } from 'antd';

export const PAGE_SIZE = 1;
export const ROUTER = '/two-information-management'; // modify
export const LIST_URL = `${ROUTER}/danger-factors-list/list`;

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '两单信息管理', name: '两单信息管理' },
  { title: '危险（有害）因素排查辨识清单', name: '危险（有害）因素排查辨识清单', href: LIST_URL },
];

export const SEARCH_FIELDS_COMPANY = [
  {
    id: 'companyName',
    label: '单位名称：',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
];

export const SEARCH_FIELDS = [
  {
    id: 'name',
    label: '风险点（单元）名称：',
    render: () => <Input placeholder="请输入" allowClear />,
  },
];

export const TABLE_COLUMNS_COMPANY = [
  // modify
  {
    title: '单位名称',
    dataIndex: 'companyName',
    key: 'companyName',
    align: 'center',
    width: 240,
  },
];

export const TABLE_COLUMNS = [
  // modify
  {
    title: '风险分区',
    dataIndex: 'space',
    key: 'space',
    align: 'center',
    width: 200,
  },
  {
    title: '排查人员',
    dataIndex: 'dangerFactor',
    key: 'dangerFactor',
    align: 'center',
    width: 200,
    render: val => (
      <Ellipsis tooltip length={35} style={{ overflow: 'visible' }}>
        {val}
      </Ellipsis>
    ),
  },
  {
    title: '负责人',
    dataIndex: 'consequenceName',
    key: 'consequenceName',
    align: 'center',
    width: 200,
    render: val => (
      <Ellipsis tooltip length={40} style={{ overflow: 'visible' }}>
        {val}
      </Ellipsis>
    ),
  },
  {
    title: '时间',
    dataIndex: 'creatTime',
    key: 'creatTime',
    align: 'center',
    width: 160,
    render: val => (
      <Ellipsis tooltip length={40} style={{ overflow: 'visible' }}>
        {val}
      </Ellipsis>
    ),
  },
  {
    title: '附件',
    dataIndex: 'file',
    key: 'file',
    align: 'center',
    width: 240,
    render: val => <span>查看清单</span>,
  },
];

// export const TABLE_COLUMNS = [
//   // modify
//   {
//     title: '风险点名称',
//     dataIndex: 'name',
//     key: 'name',
//     align: 'center',
//     width: 160,
//   },
//   {
//     title: '场所/环节/部位',
//     dataIndex: 'space',
//     key: 'space',
//     align: 'center',
//     width: 160,
//   },
//   {
//     title: '主要危险因素',
//     dataIndex: 'dangerFactor',
//     key: 'dangerFactor',
//     align: 'center',
//     width: 300,
//     render: val => (
//       <Ellipsis tooltip length={35} style={{ overflow: 'visible' }}>
//         {val}
//       </Ellipsis>
//     ),
//   },
//   {
//     title: '易导致后果（风险）',
//     dataIndex: 'consequenceName',
//     key: 'consequenceName',
//     align: 'center',
//     width: 340,
//     render: val => (
//       <Ellipsis tooltip length={40} style={{ overflow: 'visible' }}>
//         {val}
//       </Ellipsis>
//     ),
//   },
// ];

export const EDIT_FORMITEMS_COMPANY = [{ name: 'companyName', label: '单位名称', required: false }];

export const EDIT_FORMITEMS = [
  // modify
  { name: 'name', label: '风险点名称', required: false },
  { name: 'space', label: '场所/环节/部位', required: false },
  { name: 'dangerFactor', label: '主要危险因素', type: 'text', required: false },
  { name: 'consequenceName', label: '易导致后果（风险）', type: 'text', required: false },
];
