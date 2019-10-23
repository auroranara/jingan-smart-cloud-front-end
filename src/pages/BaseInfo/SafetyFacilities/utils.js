import React, { Fragment } from 'react';
import Link from 'umi/link';
// import moment from 'moment';
import { Divider, Input, message, Popconfirm, Select, Cascader, Upload, Button, Icon } from 'antd';
import CompanySelect from '@/jingan-components/CompanySelect';

import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';

const { Option } = Select;

const DATE_FORMAT = 'YYYY-MM-DD';
export const PAGE_SIZE = 1;
export const ROUTER = '/base-info/safety-facilities'; // modify
export const LIST_URL = `${ROUTER}/list`;
export const LIST = [
  // modify
  {
    companyName: '无锡晶安智慧科技有限公司',
    id: '1',
    type: '预防事故设施',
    facilitiesName: '压力表',
    status: '正常',
    number: 1,
    date: ['已过期', '2019-10-01'],
  },
];

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '一企一档', name: '一企一档' },
  { title: '安全设施', name: '安全设施', href: LIST_URL },
];

export const SEARCH_FIELDS = [
  // modify
  {
    id: 'id1',
    label: '装备名称：',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'id2',
    label: '分类：',
    render: () => <Cascader placeholder="请选择" allowClear />,
  },
  {
    id: 'id3',
    label: '设备名称：',
    render: () => (
      <Select placeholder="请选择" allowClear>
        {['一', '二'].map((r, i) => (
          <Option key={i}>{r}</Option>
        ))}
      </Select>
    ),
  },
  {
    id: 'id4',
    label: '到期状态：',
    render: () => (
      <Select placeholder="请选择" allowClear>
        {['一', '二'].map((r, i) => (
          <Option key={i}>{r}</Option>
        ))}
      </Select>
    ),
  },
  {
    id: 'id1',
    label: '单位名称：',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
];

export const TABLE_COLUMNS = [
  // modify
  {
    title: '单位名称',
    dataIndex: 'companyName',
    key: 'companyName',
    align: 'center',
    width: 240,
  },
  {
    title: '分类',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
  },
  {
    title: '安全设施名称',
    dataIndex: 'facilitiesName',
    key: 'facilitiesName',
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
  },
  {
    title: '数量',
    dataIndex: 'number',
    key: 'number',
    align: 'center',
  },
  {
    title: '有效期至',
    dataIndex: 'date',
    key: 'date',
    align: 'center',
    render(ns) {
      return ns.map((n, i) => (
        <p key={i} className={styles1.p}>
          {n}
        </p>
      ));
    },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    render(id) {
      return (
        <Fragment>
          <Link to={`${ROUTER}/edit/${id}`}>编辑</Link>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除当前项目？"
            onConfirm={e => message.success('删除成功')}
            okText="确定"
            cancelText="取消"
          >
            <span className={styles1.delete}>删除</span>
          </Popconfirm>
        </Fragment>
      );
    },
  },
];

export const EDIT_FORMITEMS = [
  // modify
  { name: 'companyName', label: '单位名称', type: 'component', component: <CompanySelect /> },
  {
    name: 'type',
    label: '分类',
    required: true,
    type: 'component',
    component: <Cascader placeholder="请选择" />,
  },
  { name: 'facilitiesName', label: '安全设施名称', type: 'select' },
  { name: 'models', label: '规格型号' },
  { name: 'enginFacility', label: '涉及工艺设施', required: false },
  { name: 'number', label: '设备数量' },
  {
    name: 'status',
    label: '设备状态',
    type: 'radio',
    options: ['正常', '维检', '报废', '使用中'],
  },
  { name: 'productVender', label: '生产厂家' },
  { name: 'productDate', label: '出厂日期', type: 'datepicker' },
  { name: 'useDate', label: '使用年限' },
  { name: 'remark', label: '备注', type: 'text' },
  {
    name: 'pic',
    label: '图片',
    type: 'component',
    component: (
      <Upload>
        <Button type="dashed" style={{ width: '96px', height: '96px' }}>
          <Icon type="plus" style={{ fontSize: '32px' }} />
          <div style={{ marginTop: '8px' }}>点击上传</div>
        </Button>
      </Upload>
    ),
  },
];
