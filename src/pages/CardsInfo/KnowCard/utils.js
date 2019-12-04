import React, { Fragment } from 'react';
import Link from 'umi/link';
import moment from 'moment';
import { DatePicker, Input, message, Popconfirm, Select } from 'antd';

import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';

const { Option } = Select;

const DATE_FORMAT = 'YYYY-MM-DD';
export const PAGE_SIZE = 20;
export const ROUTER = '/cards-info/know-card'; // modify
export const LIST_URL = `${ROUTER}/list`;
export const LIST = [ // modify
  {
    index: 1,
    id: '1',
    name: '利民化工有限股份公司',
    cardName: '从业人员应知卡',
    content: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
    man: '张三',
    time: moment(),
    preview: null,
  },
];

export const BREADCRUMBLIST = [ // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '三卡信息管理', name: '三卡信息管理' },
  { title: '应知卡', name: '应知卡', href: LIST_URL },
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
    label: '应知卡名称',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'publisher',
    label: '发布人员',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'time',
    label: '发布时间',
    render: () => <DatePicker placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
];

export function getTableColumns(handleConfirmDelete) {
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
      title: '应知卡名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '应知卡内容',
      dataIndex: 'content',
      key: 'content',
      render: txt => txt.length > 10 ? `${txt.slice(0, 10)}...` : txt,
    },
    {
      title: '发布人员',
      dataIndex: 'publisher',
      key: 'publisher',
    },
    {
      title: '发布时间',
      dataIndex: 'time',
      key: 'time',
      render: t => moment(t).format(DATE_FORMAT),
    },
    {
      title: '在线预览',
      dataIndex: 'preview',
      key: 'preview',
      render: p => <a onClick={e => e.preventDefault()}>预览</a>,
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render(id) {
        return (
          <Fragment>
            <Link to={`${ROUTER}/edit/${id}`}>编辑</Link>
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
    { name: 'name', label: '应知卡名称' },
    { name: 'content', label: '应知卡内容', type: 'text' },
    { name: 'publisher', label: '发布人员' },
    { name: 'time', label: '时间', type: 'datepicker' },
];
