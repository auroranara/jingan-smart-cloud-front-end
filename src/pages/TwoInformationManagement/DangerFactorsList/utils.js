import React, { Fragment } from 'react';
import Link from 'umi/link';
// import moment from 'moment';
import { Input, message, Popconfirm, Select } from 'antd';

import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';

const { Option } = Select;

const DATE_FORMAT = 'YYYY-MM-DD';
export const PAGE_SIZE = 1;
export const ROUTER = '/two-information-management'; // modify
export const LIST_URL = `${ROUTER}/danger-factors-list/list`;
export const LIST = [
  // modify
  {
    id: '1',
    companyName: '无锡晶安智慧科技有限公司',
    riskPointName: '预防事故设施',
    area: '场所/环节/部位',
    dangerFactor: '危险因素',
    result: '后果',
  },
];

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '两单信息管理', name: '两单信息管理' },
  { title: '危险（有害）因素排查辨识清单', name: '危险（有害）因素排查辨识清单', href: LIST_URL },
];

export const SEARCH_FIELDS = [
  // modify
  {
    id: 'id1',
    label: '单位名称：',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'id2',
    label: '风险点（单元）名称：',
    render: () => <Input placeholder="请输入" allowClear />,
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
    title: '风险点名称',
    dataIndex: 'riskPointName',
    key: 'riskPointName',
    align: 'center',
  },
  {
    title: '场所/环节/部位',
    dataIndex: 'area',
    key: 'area',
    align: 'center',
  },
  {
    title: '主要危险因素',
    dataIndex: 'dangerFactor',
    key: 'dangerFactor',
    align: 'center',
  },
  {
    title: '易导致后果（风险）',
    dataIndex: 'result',
    key: 'result',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    align: 'center',
    render: (val, text) => {
      console.log('text', text);
      return (
        <Fragment>
          <Link to={`${ROUTER}/danger-factors-list/view/${text.id}`}>查看</Link>
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
  { name: 'companyName', label: '单位名称' },
  {
    name: 'type',
    label: '风险点名称',
  },
  { name: 'facilitiesName', label: '场所/环节/部位' },
  { name: 'models', label: '主要危险因素' },
  { name: 'enginFacility', label: '易导致后果（风险）' },
];
