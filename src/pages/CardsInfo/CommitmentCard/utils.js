import React, { Fragment } from 'react';
import Link from 'umi/link';
import moment from 'moment';
import { DatePicker, Input, message, Popconfirm, Select } from 'antd';

import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';

const MAX_LENGTH = 20;
const DATE_FORMAT = 'YYYY-MM-DD';
export const PAGE_SIZE = 20;
export const ROUTER = '/cards-info/commitment-card'; // modify
export const LIST_URL = `${ROUTER}/list`;
export const LIST = [ // modify
  {
    index: 1,
    id: '1',
    name: '利民化工有限股份公司',
    cardName: '主要责任人承诺卡',
    content: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
    man: '张三',
    time: moment(),
    preview: null,
  },
];

export const BREADCRUMBLIST = [ // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '三卡信息管理', name: '三卡信息管理' },
  { title: '承诺卡', name: '承诺卡', href: LIST_URL },
];

export const SEARCH_FIELDS = [ // modify
  {
    id: 'companyName',
    label: '单位名称',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'name',
    label: '承诺卡名称',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'acceptor',
    label: '承诺人',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
];

export function getTableColumns(handleConfirmDelete, showModal) {
  return [ // modify
    // {
    //   title: '序号',
    //   dataIndex: 'index',
    //   key: 'index',
    // },
    {
      title: '单位名称',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: '承诺卡名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '承诺卡内容',
      dataIndex: 'content',
      key: 'content',
      align: 'center',
      render: txt => txt.length > MAX_LENGTH ? `${txt.slice(0, MAX_LENGTH)}...` : txt,
    },
    {
      title: '承诺人',
      dataIndex: 'acceptor',
      key: 'acceptor',
      width: 100,
      align: 'center',
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 120,
      align: 'center',
      render: t => moment(t).format(DATE_FORMAT),
    },
    {
      title: '在线预览',
      dataIndex: 'preview',
      key: 'preview',
      width: 100,
      align: 'center',
      render: (p, record) => <a onClick={e => { e.preventDefault(); showModal(record); }}>预览</a>,
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      fixed: 'right',
      render(id) {
        return (
          <Fragment>
            <Link to={`${ROUTER}/view/${id}`}>查看</Link>
            <Link to={`${ROUTER}/edit/${id}`} style={{ marginLeft: 8 }}>编辑</Link>
            <Popconfirm
              title="确定删除当前项目？"
              onConfirm={e => handleConfirmDelete(id)}
              okText="确定"
              cancelText="取消"
            ><span className={styles1.delete}>删除</span></Popconfirm>
          </Fragment>
        );
      },
    },
  ];
}

export const EDIT_FORMITEMS = [ // modify
    { name: 'companyId', label: '单位名称', type: 'companyselect' },
    { name: 'name', label: '承诺卡名称' },
    { name: 'content', label: '承诺卡内容', type: 'text' },
    { name: 'acceptor', label: '承诺人' },
    { name: 'time', label: '时间', type: 'datepicker' },
];

export function handleDetails(values, deletedProps=['companyName']) {
  const { companyId, companyName, time } = values;
  // const vals = { ...values };
  // deletedProps.forEach(p => delete vals[p]);

  return {
    ...values,
    companyId: { key: companyId, label: companyName },
    time: moment(time),
  };
}
