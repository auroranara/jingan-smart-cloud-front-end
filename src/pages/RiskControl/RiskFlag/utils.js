import React, { Fragment } from 'react';
import Link from 'umi/link';
import { Input, Popconfirm, Select } from 'antd';

import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';

const { Option } = Select;

export const PAGE_SIZE = 10;
export const ROUTER = '/risk-control/risk-flags';
export const LIST_URL = `${ROUTER}/list`;
export const SIGN_TYPES = ['禁止标志', '警告标志', '指令标志', '提示标志'];

export const BREADCRUMBLIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '风险分级管控', name: '风险分级管控' },
  { title: '国际风险标志库', name: '国际风险标志库', href: LIST_URL },
];

export const SEARCH_FIELDS = [
  {
    id: 'signName',
    label: '标志名称',
    render: () => <Input placeholder="请输入标志名称" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'signType',
    label: '标志类型',
    render: () => <Select placeholder="请选择标志类型" allowClear>{SIGN_TYPES.map((r, i) => <Option key={i}>{r}</Option>)}</Select>,
  },
];

export function getColumns(genHandleDelete, handleClick) {
  return [
    {
      title: '标志名称',
      dataIndex: 'signName',
      key: 'signName',
    },
    {
      title: '标志类型',
      dataIndex: 'signType',
      key: 'signType',
      render(t) {
        return t ? SIGN_TYPES[t] : '-';
      },
    },
    {
      title: '图片',
      dataIndex: 'signUrlList',
      key: 'signUrlList',
      align: 'center',
      width: 100,
      render(signUrlList) {
        const url = signUrlList.length ? signUrlList[0].webUrl : undefined;
        return <div className={styles1.flag} style={{ backgroundImage: `url(${url})` }} onClick={e => handleClick && handleClick(url)} />;
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
            <Link to={`${ROUTER}/edit/${id}`} target="_blank">编辑</Link>
            <Popconfirm
              title="将从数据库永久删除当前项目，确定删除？"
              onConfirm={genHandleDelete(id)}
              okText="确定"
              cancelText="取消"
            ><span className={styles1.delete}>删除</span></Popconfirm>
          </Fragment>
        );
      },
    },
  ];
}
