import React, { Fragment } from 'react';
import Link from 'umi/link';
import moment from 'moment';
import { DatePicker, Input, message, Popconfirm, Select } from 'antd';

import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';

const { Option } = Select;

const DATE_FORMAT = 'YYYY-MM-DD';
export const PAGE_SIZE = 20;
export const ROUTER = '/announcement-management/promise'; // modify
export const LIST_URL = `${ROUTER}/list`;
export const LIST = [ // modify
  {
    index: 1,
    id: '1',
    name: '晶安智慧科技有限公司',
    total: '4',
    run: '4',
    stop: '0',
    checking: '0',
    specialWork: '1',
    levelOne: '1',
    levelTwo: '1',
    limitedSpace: '0',
    pilot: 1,
    driving: 0,
    safe: 0,
    submitter: '小李子',
    submitTime: moment(),
  },
];

export const BREADCRUMBLIST = [ // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '公告管理', name: '公告管理' },
  { title: '安全承诺公告', name: '安全承诺公告', href: LIST_URL },
];

export const SEARCH_FIELDS = [ // modify
  {
    id: 'name',
    label: '单位名称',
    render: () => <Input placeholder="请输入" allowClear />,
  },
  {
    id: 'date',
    label: '提交日期',
    render: () => <DatePicker placeholder="请输入" allowClear />,
  },
];

const DEVICES = ['总', '运行', '停产', '检修'];
const SPECIAL = ['特种作业', '一级动火作业', '二级动火作业', '进入受限空间'];
const PILOT = ['否', '是'];
const DRIVING = ['否', '是'];

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
    title: '生产装置',
    dataIndex: 'devices',
    key: 'devices',
    render: (txt, { total, run, stop, checking }) => [total, run, stop, checking].map((n, i) => <p key={i} className={styles1.p}>{DEVICES[i]}{n}套</p>),
  },
  {
    title: '特种作业',
    dataIndex: 'special',
    key: 'special',
    render: (txt, { specialWork, levelOne, levelTwo, limitedSpace }) => [specialWork, levelOne, levelTwo, limitedSpace].map((n, i) => <p key={i} className={styles1.p}>{SPECIAL[i]}{n}处</p>),
  },
  {
    title: '处于试生产',
    dataIndex: 'pilot',
    key: 'pilot',
    render: s => PILOT[s],
  },
  {
    title: '处于开停车状态',
    dataIndex: 'driving',
    key: 'driving',
    render: s => DRIVING[s],
  },
  {
    title: '提交信息',
    dataIndex: 'submit',
    key: 'submit',
    render: (txt, { submitter, submitTime }) => `${submitter} ${submitTime.format(DATE_FORMAT)}`,
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

const PROMISE = '今天我公司已进行安全风险研判，各项安全风险防控措施已落实到位，我承诺所有生产装置处于安全运行状态，罐区、仓库等重大危险源安全风险得到有效管控。';

export const EDIT_FORMITEMS = [ // modify
    { name: 'total', label: '生产装置', required: true },
    { name: 'run', label: '其中运行', required: true },
    { name: 'stop', label: '停产', required: true },
    { name: 'checking', label: '检修', required: true },
    { name: 'specialWork', label: '特殊作业', required: true },
    { name: 'levelOne', label: '一级动火作业', required: true },
    { name: 'levelTwo', label: '二级动火作业', required: true },
    { name: 'limitedSpace', label: '进入受限空间', required: true },
    { name: 'pilot', label: '处于试生产状态', type: 'radio', options: PILOT, required: true },
    { name: 'driving', label: '处于开停车状态', type: 'radio', options: DRIVING, required: true },
    { name: 'safe', label: '重大危险源处于安全状态', type: 'radio', options: DRIVING, required: true },
    { name: 'promise', label: '安全承诺', type: 'component', component: PROMISE },
    { name: 'submitter', label: '主要负责人', required: true },
    { name: 'submitTime', label: '日期', type: 'component', component: moment().format(DATE_FORMAT) },
];
