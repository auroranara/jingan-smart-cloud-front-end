import React, { Fragment } from 'react';
import Link from 'umi/link';
import moment from 'moment';
import { DatePicker, Input, message, Popconfirm, Select } from 'antd';

import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';

const { Option } = Select;

const DATE_FORMAT = 'YYYY-MM-DD';
export const PAGE_SIZE = 20;
export const ROUTER = '/base-info/three-simultaneity'; // modify
export const LIST_URL = `${ROUTER}/list`;
export const LIST = [ // modify
  {
    id: '1',
    index: 1,
    name: '利民化工股份有限公司',
    projectName: '甲醇',
    projectType: 0,
    projectProgram: 0,
    conditionType: 0,
    conditionConclusion: 0,
    conditionDate: moment(),
    designType: 0,
    designConclusion: 0,
    designDate: moment(),
    backupRange: [moment(), moment().add(5, 'days')],
    backupConclusion: 0,
    backupDate: moment(),
    completeType: 0,
    completeConclusion: 0,
    completeDate: moment(),
    date: moment(),
  },
];

const PROJECT = ['新建项目', '改建项目', '扩建项目', '其他项目'];
const PROGRAM = ['一般程序', '简易程序'];
const TYPE = ['备案', '审查'];
const CONCLUSION = ['通过', '不通过'];

export const BREADCRUMBLIST = [ // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '一企一档', name: '一企一档' },
  { title: '三同时审批记录', name: '三同时审批记录', href: LIST_URL },
];

export const SEARCH_FIELDS = [ // modify
  {
    id: 'name',
    label: '单位名称',
    render: () => <Input allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'project',
    label: '项目名称',
    render: () => <Input allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'projectType',
    label: '项目类型',
    render: () => <Select placeholder="请选择" allowClear>{PROJECT.map((r, i) => <Option key={i}>{r}</Option>)}</Select>,
  },
  {
    id: 'program',
    label: '程序',
    render: () => <Select placeholder="请选择" allowClear>{PROGRAM.map((r, i) => <Option key={i}>{r}</Option>)}</Select>,
  },
  {
    id: 'date',
    label: '登记时间',
    render: () => <DatePicker style={{ width: '100%' }} allowClear />,
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
    title: '项目信息',
    dataIndex: 'info',
    key: 'info',
    render(ns, record) {
      return [
        `项目名称：${record.projectName}`,
        `项目类型：${PROJECT[record.projectType]}`,
        `程序：${PROGRAM[record.projectProgram]}`,
      ].map((n, i) => <p key={i} className={styles1.p}>{n}</p>);
    },
  },
  {
    title: '安全条件',
    dataIndex: 'condition',
    key: 'condition',
    render(ns, record) {
      return [
        `类别：${TYPE[record.designType]}`,
        `结论：${CONCLUSION[record.designConclusion]}`,
        `文书日期：${record.designDate.format(DATE_FORMAT)}`,
      ].map((n, i) => <p key={i} className={styles1.p}>{n}</p>);
    },
  },
  {
    title: '安全设施设计',
    dataIndex: 'design',
    key: 'design',
    render(ns, record) {
      return [
        `类别：${TYPE[record.conditionType]}`,
        `结论：${CONCLUSION[record.conditionConclusion]}`,
        `文书日期：${record.conditionDate.format(DATE_FORMAT)}`,
      ].map((n, i) => <p key={i} className={styles1.p}>{n}</p>);
    },
  },
  {
    title: '试生产方案备案',
    dataIndex: 'backup',
    key: 'backup',
    render(ns, record) {
      const range = record.backupRange.map(m => m.format(DATE_FORMAT));
      return [
        `试生产日期：${range[0]} ~ ${range[1]}`,
        `结论：${CONCLUSION[record.backupConclusion]}`,
        `文书日期：${record.backupDate.format(DATE_FORMAT)}`,
      ].map((n, i) => <p key={i} className={styles1.p}>{n}</p>);
    },
  },
  {
    title: '安全设施竣工',
    dataIndex: 'complete',
    key: 'complete',
    render(ns, record) {
      return [
        `类别：${TYPE[record.completeType]}`,
        `结论：${CONCLUSION[record.completeConclusion]}`,
        `文书日期：${record.completeDate.format(DATE_FORMAT)}`,
      ].map((n, i) => <p key={i} className={styles1.p}>{n}</p>);
    },
  },
  {
    title: '登记时间',
    dataIndex: 'date',
    key: 'date',
    render: d => d.format(DATE_FORMAT),
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
  {
    title: '项目信息',
    fields: [
      { name: 'name', label: '单位名称' },
      { name: 'projectName', label: '项目名称' },
      { name: 'projectType', label: '项目类型', type: 'radio', options: PROJECT },
      { name: 'projectProgram', label: '程序', type: 'radio', options: PROGRAM },
    ],
  },
  {
    title: '安全条件',
    fields: [
      { name: 'conditionType', label: '类别', type: 'radio', options: TYPE },
      { name: 'conditionConclusion', label: '结论', type: 'radio', options: CONCLUSION },
      { name: 'conditionDate', label: '出具文书日期', type: 'datepicker' },
    ],
  },
  {
    title: '安全设施设计',
    fields: [
      { name: 'designType', label: '类别', type: 'radio', options: TYPE },
      { name: 'designConclusion', label: '结论', type: 'radio', options: CONCLUSION },
      { name: 'designDate', label: '出具文书日期', type: 'datepicker' },
    ],
  },
  {
    title: '试生产方案备案',
    fields: [
      { name: 'backupRange', label: '试生产日期', type: 'rangepicker' },
      { name: 'backupConclusion', label: '结论', type: 'radio', options: CONCLUSION },
      { name: 'backupDate', label: '出具文书日期', type: 'datepicker' },
    ],
  },
  {
    title: '安全设施竣工',
    fields: [
      { name: 'completeType', label: '类别', type: 'radio', options: TYPE },
      { name: 'completeConclusion', label: '结论', type: 'radio', options: CONCLUSION },
      { name: 'completeDate', label: '出具文书日期', type: 'datepicker' },
    ],
  },
];
