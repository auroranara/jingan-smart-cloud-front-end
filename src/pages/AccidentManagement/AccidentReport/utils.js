import React, { Fragment } from 'react';
import Link from 'umi/link';
import moment from 'moment';
import { Button, Input, message, Popconfirm, Select } from 'antd';

import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import { AREAS, CODES, LEVELS } from '@/pages/AccidentManagement/QuickReport/utils';

const { Option } = Select;

const DATE_FORMAT = 'YYYY-MM-DD';
export const PAGE_SIZE = 20;
export const ROUTER = '/accident-management/accident-report'; // modify
export const LIST_URL = `${ROUTER}/list`;
export const LIST = [ // modify
  {
    index: 1,
    id: '1',
    name: '和晶科技有限公司',
    title: '甲烷车间爆炸',
    time: moment(),
    area: ['jiangsu', 'wuxi', 'xinwuqu'],
    address: '交警大队',
    phone: '0510-85553333',
    code: '12A01',
    level: '0',
  },
];

export const BREADCRUMBLIST = [ // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '事故管理', name: '事故管理' },
  { title: '事故报告', name: '事故报告', href: LIST_URL },
];

const COMPANY_TYPES = ["煤矿企业", "非煤矿山企业", "危险化学品企业", "烟花爆竹企业", "冶金、有色", "建材", "机械", "其它"];
const TREATMENT_TYPES = [
  '国务院领导做出批示',
  '中央办公厅或国务院办公厅要求上报',
  '总局领导明确要求',
  '省级领导作示',
  '省政府要求上报',
  '省安监局领导明确要求',
  '市级领导作出批示',
  '市政府要求上报',
  '市安监局领导明确要求',
  '其他',
];
const REPORTED_TYPES = ['首报', '续报', '重报', '核报', '反馈'];
const REPORTED_STATUS = ['保存', '上报'];

export const SEARCH_FIELDS = [ // modify
  {
    id: 'name',
    label: '事故单位名称',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'companyType',
    label: '事故企业类型',
    render: () => <Select placeholder="请选择" allowClear>{COMPANY_TYPES.map((r, i) => <Option key={i}>{r}</Option>)}</Select>,
  },
  {
    id: 'title',
    label: '事故信息标题',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'reportedUnit',
    label: '报送单位',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'reportedType',
    label: '报送类型',
    render: () => <Select placeholder="请选择" allowClear>{REPORTED_TYPES.map((r, i) => <Option key={i}>{r}</Option>)}</Select>,
  },
  {
    id: 'reportedType',
    label: '报送状态',
    render: () => <Select placeholder="请选择" allowClear>{REPORTED_STATUS.map((r, i) => <Option key={i}>{r}</Option>)}</Select>,
  },
  {
    id: 'reportedType',
    label: '事故类型代码',
    render: () => <Select placeholder="请选择" allowClear>{CODES.map(({ key, value }) => <Option key={key}>{value}</Option>)}</Select>,
  },
  {
    id: 'level',
    label: '事故级别',
    render: () => <Select placeholder="请选择" allowClear>{LEVELS.map((r, i) => <Option key={i}>{r}</Option>)}</Select>,
  },
];

export const TABLE_COLUMNS = [ // modify
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: '事故单位',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '事故企业类型',
    dataIndex: 'companyType',
    key: 'companyType',
    render: t => COMPANY_TYPES[t],
  },
  {
    title: '事故处理类型',
    dataIndex: 'companyType',
    key: 'companyType',
    render: t => TREATMENT_TYPES[t],
  },
  {
    title: '事故发生时间',
    dataIndex: 'time',
    key: 'time',
    render: m => m.format(DATE_FORMAT),
  },
  {
    title: '事故类型代码',
    dataIndex: 'code',
    key: 'code',
    render: c => CODES[c],
  },
  {
    title: '事故级别',
    dataIndex: 'level',
    key: 'level',
    render: s => LEVELS[s],
  },
  {
    title: '报送单位',
    dataIndex: 'reportedUnit',
    key: 'reportedUnit',
  },
  {
    title: '报送类型',
    dataIndex: 'level',
    key: 'level',
    render: t => REPORTED_TYPES[t],
  },
  {
    title: '报送状态',
    dataIndex: 'level',
    key: 'level',
    render: t => REPORTED_STATUS[t],
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
  { name: 'name', label: '事故单位' },
  { name: 'commpanyType', label: '事故企业类型', type: 'select', options: COMPANY_TYPES, required: false },
  { name: 'treatmentType', label: '事故处理类型', type: 'select', options: TREATMENT_TYPES },
  { name: 'reportedUnit', label: '报送单位' },
  { name: 'reportedType', label: '报送类型', type: 'select', options: REPORTED_TYPES },
  { name: 'reportedStatus', label: '报送状态', type: 'select', options: REPORTED_STATUS },
  { name: 'quickReport', label: '事故快报', type: 'component', component: <Button type="primary">选择</Button>, required: false },
  { name: 'area', label: '所在区域', type: 'cascader', options: AREAS },
  { name: 'address', label: '事故发生详细地址', required: false },
  { name: 'coordinate', label: '经纬度' },
  { name: 'title', label: '事故信息标题' },
  { name: 'time', label: '事故发生时间', type: 'datepicker' },
  { name: 'code', label: '事故类型代码', type: 'select', options: CODES },
  { name: 'level', label: '事故级别', type: 'select', options: LEVELS },
  { name: 'loss', label: '直接经济损失(万)', required: false },
  { name: 'danger', label: '涉险人数', required: false },
  { name: 'dead', label: '死亡人数', required: false },
  { name: 'severeWound', label: '重伤人数', required: false },
  { name: 'slightWound', label: '轻伤人数', required: false },
  { name: 'trapped', label: '被困人数', required: false },
  { name: 'missing', label: '失踪人数', required: false },
  { name: 'cause', label: '事故原因初步分析', type: 'text', required: false },
  { name: 'situation', label: '事故现场情况', type: 'text', required: false },
  { name: 'detail', label: '事故简要经过', type: 'text', required: false },
  { name: 'measure', label: '已采取措施', type: 'text', required: false },
  { name: 'remark', label: '备注', type: 'text', required: false },
  { name: 'url', label: '视频链接', required: false },
  { name: 'operator', label: '经办人', required: false },
  { name: 'operatorPhone', label: '经办人电话', required: false },
  { name: 'liaison', label: '现场联络员', required: false },
  { name: 'liaisonPhone', label: '现场联络员电话', required: false },
  { name: 'editor', label: '签发人', required: false },
  { name: 'updateTime', label: '最近更新时间', required: false, type: 'datepicker' },
];
