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
    name: '无锡化工有限股份公司',
    cardName: '设备应知卡',
    content: '该设备应定期维护，保养...',
    man: '张三丰',
    time: moment(),
    preview: null,
  },
  {
    index: 2,
    id: '2',
    name: '新区化工有限股份公司',
    cardName: '催化剂应知卡',
    content: '本品应避光保存...',
    man: '吴三桂',
    time: moment(),
    preview: null,
  },
  {
    index: 3,
    id: '3',
    name: '晶安智慧有限公司',
    cardName: '危险特性应知卡',
    content: '本品遇水易燃易爆...',
    man: '周杰伦',
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
    id: 'name',
    label: '单位名称',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'cardName',
    label: '应知卡名称',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'man',
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

export const TABLE_COLUMNS = [ // modify
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '单位名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '应知卡名称',
    dataIndex: 'cardName',
    key: 'cardName',
  },
  {
    title: '应知卡内容',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: '发布人员',
    dataIndex: 'man',
    key: 'man',
  },
  {
    title: '发布时间',
    dataIndex: 'time',
    key: 'time',
    render: t => t.format(DATE_FORMAT),
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
            onConfirm={e => message.success('删除成功')}
            okText="确定"
            cancelText="取消"
          ><span className={styles1.delete}>删除</span></Popconfirm>
        </Fragment>
      );
    },
  },
];

export const EDIT_FORMITEMS = [ // modify
    { name: 'name', label: '单位名称' },
    { name: 'cardName', label: '应知卡名称' },
    { name: 'content', label: '应知卡内容', type: 'text' },
    { name: 'man', label: '发布人员' },
    { name: 'time', label: '时间', type: 'datepicker' },
];
