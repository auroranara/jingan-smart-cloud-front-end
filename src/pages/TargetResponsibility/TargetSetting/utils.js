import React, { Fragment } from 'react';
import Link from 'umi/link';
import moment from 'moment';
import { DatePicker, Input, message, Popconfirm, Select, Divider } from 'antd';

import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';

const { Option } = Select;

// const DATE_FORMAT = 'YYYY-MM-DD';
export const PAGE_SIZE = 20;
export const ROUTER = '/target-responsibility/target-setting'; // modify
export const LIST_URL = `${ROUTER}/index`;

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '目标责任管理', name: '目标责任管理' },
  { title: '目标责任制定实施', name: '目标责任制定实施', href: LIST_URL },
];

export const SEARCH_FIELDS = [
  // modify
  {
    id: 'companyName',
    label: '单位名称',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'year',
    label: '目标年份',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'subToliability',
    label: '责任主体',
    render: () => (
      <Select placeholder="请选择" allowClear>
        {['一', '二'].map((r, i) => (
          <Option key={i}>{r}</Option>
        ))}
      </Select>
    ),
  },
];

export const LIST = [
  // modify
  {
    companyName: '无锡晶安智慧科技有限公司',
    id: '1',
    year: '2019年',
    subToliability: '单位：本单位',
    targetValueList: [
      {
        id: '1',
        name: '工伤事故次数',
        value: '1',
      },
      {
        id: '2',
        name: '重复事故次数',
        value: '0',
      },
      {
        id: '3',
        name: '死亡率',
        value: '0.01%',
      },
      {
        id: '4',
        name: '职业病危害区域合格率',
        value: '99%',
      },
    ],
  },
];

export const TABLE_COLUMNS = [
  // modify
  {
    title: '单位名称',
    dataIndex: 'companyName',
    key: 'companyName',
    align: 'center',
  },
  {
    title: '目标年份',
    dataIndex: 'year',
    key: 'year',
    align: 'center',
  },
  {
    title: '责任主体',
    dataIndex: 'subToliability',
    key: 'subToliability',
    align: 'center',
    // render(ns) {
    //   return ns.map((n, i) => (
    //     <p key={i} className={styles1.p}>
    //       {n}
    //     </p>
    //   ));
    // },
  },
  {
    title: '安全生产目标数值',
    dataIndex: 'targetValueList',
    key: 'targetValueList',
    align: 'center',
    render: val => {
      return val.map(item => (
        <div key={item.id}>
          {item.name}:{item.value}
        </div>
      ));
    },
  },
  {
    title: '实际完成情况',
    dataIndex: 'performance',
    key: 'performance',
    align: 'center',
    render: () => {
      return <a>填写考核结果</a>;
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
          <Link to={`${ROUTER}/detail/${id}`}>查看</Link>
          <Divider type="vertical" />
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
