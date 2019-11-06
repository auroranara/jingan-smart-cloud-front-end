import React, { Fragment } from 'react';
import Link from 'umi/link';
import moment from 'moment';
import { Button, Input, message, Popconfirm, Select, Upload } from 'antd';

import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';

const { Option } = Select;

const DATE_FORMAT = 'YYYY-MM-DD';
export const PAGE_SIZE = 20;
export const ROUTER = '/announcement-management/announcement'; // modify
export const LIST_URL = `${ROUTER}/list`;
export const LIST = [ // modify
  {
    index: 1,
    id: '1',
    title: '防灾减灾',
    type: 0,
    content: '关于防范自然灾害引起的重大隐患',
    name: '晶安科技有限公司',
    author: '小李子',
    time: moment(),
  },
];

export const BREADCRUMBLIST = [ // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '公告管理', name: '公告管理' },
  { title: '信息发布', name: '信息发布', href: LIST_URL },
];

const INFO = ['通知', '公告'];

export const SEARCH_FIELDS = [ // modify
  {
    id: 'title',
    label: '信息标题',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'name',
    label: '发布单位',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'type',
    label: '信息类型',
    render: () => <Select placeholder="请选择" allowClear>{INFO.map((r, i) => <Option key={i}>{r}</Option>)}</Select>,
  },
];

export const TABLE_COLUMNS = [ // modify
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '信息标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '信息类型',
    dataIndex: 'type',
    key: 'type',
    render: s => INFO[s],
  },
  {
    title: '信息内容',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: '附件',
    dataIndex: 'appendix',
    key: 'appendix',
    render: txt => <a onClick={e => e.preventDefault()}>关于施行化工规范的通知.docx</a>,
  },
  {
    title: '发布单位',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '发布者',
    dataIndex: 'author',
    key: 'author',
  },
  {
    title: '发布时间',
    dataIndex: 'time',
    key: 'time',
    render: m => m.format(DATE_FORMAT),
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
    { name: 'title', label: '信息标题' },
    { name: 'type', label: '信息类型', options: ['公告', '通知'] },
    { name: 'content', label: '信息内容', type: 'text', required: false },
    { name: 'appendix', label: '文件附件', type: 'component', component: <Upload><Button type="primary">点击上传</Button></Upload> },
];
