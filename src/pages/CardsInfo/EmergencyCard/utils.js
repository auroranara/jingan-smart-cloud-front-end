import React, { Fragment } from 'react';
import Link from 'umi/link';
import moment from 'moment';
import { DatePicker, Input, message, Popconfirm, Select } from 'antd';

import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';

const { Option } = Select;

const DATE_FORMAT = 'YYYY-MM-DD';
export const PAGE_SIZE = 20;
export const ROUTER = '/cards-info/emergency-card'; // modify
export const LIST_URL = `${ROUTER}/list`;
export const LIST = [ // modify
  {
    index: 1,
    id: '1',
    name: '利民化工有限股份公司',
    cardName: '岗位应急卡',
    device: '装卸作业',
    risk: '易燃易爆',
    method: '干粉灭火',
    notes: '避光',
    man: '张三',
    phone: '18012345555',
    preview: null,
  },
];

export const BREADCRUMBLIST = [ // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '三卡信息管理', name: '三卡信息管理' },
  { title: '应急卡', name: '应急卡', href: LIST_URL },
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
    label: '应急卡名称',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'device',
    label: '作业/设备名称',
    render: () => <Input placeholder="请输入" allowClear />,
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
    title: '应急卡名称',
    dataIndex: 'cardName',
    key: 'cardName',
  },
  {
    title: '作业/设备名称',
    dataIndex: 'device',
    key: 'device',
  },
  {
    title: '风险提示',
    dataIndex: 'risk',
    key: 'risk',
  },
  {
    title: '应急处置方法',
    dataIndex: 'method',
    key: 'method',
  },
  {
    title: '注意事项',
    dataIndex: 'notes',
    key: 'notes',
  },
  {
    title: '应急联系方式',
    dataIndex: 'emergency',
    key: 'emergency',
    render(txt, { man, phone }) {
      return [`内部：${man} ${phone}`, '外部：火警 119  医疗救护 120'].map((n, i) => <p key={i} className={styles1.p}>{n}</p>);
    },
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
    { name: 'device', label: '作业/设备名称' },
    { name: 'risk', label: '风险提示', type: 'text' },
    { name: 'method', label: '应急处置方法', type: 'text' },
    { name: 'notes', label: '注意事项', type: 'text' },
    { name: 'emergency', label: '应急联系方式', type: 'component', component: '内部' },
    { name: 'man', label: '安全负责人' },
    { name: 'phone', label: '联系方式' },
    { name: 'emergency', label: '应急联系方式', type: 'component', component: '外部' },
    { name: 'fire', label: '火警', type: 'component', component: '119' },
    { name: 'rescue', label: '医疗救护', type: 'component', component: '120' },
];
