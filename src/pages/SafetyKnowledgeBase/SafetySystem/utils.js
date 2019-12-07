import React, { Fragment } from 'react';
import Link from 'umi/link';
import moment from 'moment';
import { Button, Input, message, Popconfirm, Select, Upload } from 'antd';

import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import CompanySelect from '@/jingan-components/CompanySelect';

const { Option } = Select;

const DATE_FORMAT = 'YYYY-MM-DD';
export const PAGE_SIZE = 20;
export const ROUTER = '/safety-production-regulation/safety-system'; // modify
export const LIST_URL = `${ROUTER}/list`;
export const LIST = [ // modify
  {
    index: 1,
    id: '1',
    name: '和晶科技',
    safety: '生产安全规范一',
    editor: '张三',
    phone: '13813141222',
    validity: [moment('2019-9-12'), moment('2020-9-12')],
    date: '即将到期',
    check: '审核通过已发布',
    version: '-',
  },
];

export const BREADCRUMBLIST = [ // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '安全生产制度法规', name: '安全生产制度法规' },
  { title: '安全制度管理', name: '安全制度管理', href: LIST_URL },
];

export const SEARCH_FIELDS = [ // modify
  {
    id: 'name',
    label: '单位名称',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'system',
    label: '安全制度',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'editor',
    label: '编制人',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'date',
    label: '到期状态',
    render: () => <Select placeholder="请选择" allowClear>{['未到期', '已到期', '即将到期'].map((r, i) => <Option key={i}>{r}</Option>)}</Select>,
  },
  {
    id: 'check',
    label: '审核状态',
    render: () => <Select placeholder="请选择" allowClear>{['待审核', '审核通过待发布', '审核不通过', '审核通过已发布'].map((r, i) => <Option key={i}>{r}</Option>)}</Select>,
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
    title: '安全制度名称',
    dataIndex: 'safety',
    key: 'safety',
  },
  {
    title: '编制人',
    dataIndex: 'edit',
    key: 'edit',
    render(txt, { editor, phone }) {
      return [editor, phone].join(' ');
    },
  },
  {
    title: '时间',
    dataIndex: 'validity',
    key: 'validity',
    render(v) {
      return v.map(t => t.format(DATE_FORMAT)).join(' ~ ');
    },
  },
  {
    title: '到期状态',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '审核状态',
    dataIndex: 'check',
    key: 'check',
  },
  {
    title: '附件',
    dataIndex: 'appendix',
    key: 'appendix',
    render() {
      return <a onClick={e => e.preventDefault()}>规章制度.docx</a>
    },
  },
  {
    title: '历史版本',
    dataIndex: 'version',
    key: 'version',
    render(txt) {
      return txt === '-' ? txt : <Link to={`${ROUTER}/history`}>{txt}</Link>;
    },
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
    // { name: 'name', label: '单位名称', required: true, type: 'component', component: <CompanySelect /> },
    { name: 'name', label: '单位名称', required: true },
    { name: 'safety', label: '安全制度名称', required: true },
    { name: 'type', label: '版本类型', type: 'component', component: '修订' },
    { name: 'version', label: '版本号', type: 'component', component: 'v1.0' },
    { name: 'editor', label: '编制人', required: true },
    { name: 'phone', label: '联系电话', required: true },
    { name: 'validity', label: '有效期', required: true, type: 'rangepicker' },
    { name: 'appendix', label: '附件', required: true, type: 'component', component: <Upload><Button type="primary">上传附件</Button></Upload> },
];
