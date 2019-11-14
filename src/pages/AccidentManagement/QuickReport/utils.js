import React, { Fragment } from 'react';
import Link from 'umi/link';
import moment from 'moment';
import { Input, message, Popconfirm, Select } from 'antd';

import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';

const { Option } = Select;

const DATE_FORMAT = 'YYYY-MM-DD';
export const PAGE_SIZE = 20;
export const ROUTER = '/accident-management/quick-report'; // modify
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
  { title: '事故快报', name: '事故快报', href: LIST_URL },
];

export const CODES = [{ key: '12A01', value: '煤矿瓦斯事故' }, { key: '12A02', value: '煤矿顶板事故' }];
export const LEVELS = ['特别重大', '重大', '较大', '一般'];

export const SEARCH_FIELDS = [ // modify
  {
    id: 'name',
    label: '事故单位名称',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'title',
    label: '事故信息标题',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'code',
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
    title: '事故信息标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '事故发生时间',
    dataIndex: 'time',
    key: 'time',
    render: m => m.format(DATE_FORMAT),
  },
  {
    title: '事故发生地址',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '事故单位电话',
    dataIndex: 'phone',
    key: 'phone',
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

export const AREAS = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      {
        value: 'hangzhou',
        label: '杭州',
        children: [
          {
            value: 'xihu',
            label: '西湖',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [
      {
        value: 'wuxi',
        label: '无锡',
        children: [
          {
            value: 'xinwuqu',
            label: '新吴区',
          },
        ],
      },
    ],
  },
];

export const EDIT_FORMITEMS = [ // modify
    { name: 'name', label: '事故单位' },
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
