import React, { Fragment } from 'react';
import Link from 'umi/link';
import moment from 'moment';
import { DatePicker, Input, message, Popconfirm, Select } from 'antd';

import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';

const MAX_LENGTH = 50;
const DATE_FORMAT = 'YYYY-MM-DD';
export const PAGE_SIZE = 20;
export const ROUTER = '/cards-info/commitment-card'; // modify
export const LIST_URL = `${ROUTER}/list`;

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '三卡信息管理', name: '三卡信息管理' },
  { title: '承诺卡', name: '承诺卡', href: LIST_URL },
];

export function getSearchFields(unitType) {
  const fields = [
    // modify
    {
      id: 'companyName',
      label: '单位名称',
      render: () => <Input placeholder="请输入" allowClear />,
      transform: v => v.trim(),
    },
    {
      id: 'name',
      label: '承诺卡名称',
      render: () => <Input placeholder="请输入" allowClear />,
      transform: v => v.trim(),
    },
    {
      id: 'acceptor',
      label: '承诺人',
      render: () => <Input placeholder="请输入" allowClear />,
      transform: v => v.trim(),
    },
  ];

  if (isCompanyUser(+unitType)) fields.shift();

  return fields;
}

export function getTableColumns(handleConfirmDelete, showModal, unitType) {
  const columns = [
    {
      title: '单位名称',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: '风险分区',
      dataIndex: 'pointFixInfoList',
      key: 'pointFixInfoList',
      render: (val, row) => {
        return <span>{val.length > 0 ? val.map(item => item.areaName).join('') : ''}</span>;
      },
    },
    {
      title: '承诺卡名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '承诺卡内容',
      dataIndex: 'content',
      key: 'content',
      render: txt => (txt.length > MAX_LENGTH ? `${txt.slice(0, MAX_LENGTH)}...` : txt),
    },
    {
      title: '承诺人',
      dataIndex: 'acceptor',
      key: 'acceptor',
      width: 100,
      align: 'center',
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 120,
      align: 'center',
      render: t => moment(t).format(DATE_FORMAT),
    },
    {
      title: '在线预览',
      dataIndex: 'preview',
      key: 'preview',
      width: 100,
      align: 'center',
      render: (p, record) => (
        <a
          onClick={e => {
            e.preventDefault();
            showModal(record);
          }}
        >
          预览
        </a>
      ),
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      width: 132,
      align: 'center',
      fixed: 'right',
      render(id) {
        return (
          <Fragment>
            <Link to={`${ROUTER}/view/${id}`} target="_blank">
              查看
            </Link>
            <Link to={`${ROUTER}/edit/${id}`} target="_blank" style={{ marginLeft: 8 }}>
              编辑
            </Link>
            <Popconfirm
              title="确定删除当前项目？"
              onConfirm={e => handleConfirmDelete(id)}
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

  if (isCompanyUser(+unitType)) columns.shift();
  return columns;
}

// export const EDIT_FORMITEMS = [ // modify
//     { name: 'companyId', label: '单位名称', type: 'companyselect' },
//     { name: 'name', label: '承诺卡名称' },
//     { name: 'content', label: '承诺卡内容', type: 'text' },
//     { name: 'acceptor', label: '承诺人' },
//     { name: 'time', label: '时间', type: 'datepicker' },
//     { name: 'section', label: '风险分区', type: 'select', required: false },
// ];

export function handleDetails(values, deletedProps = ['companyName']) {
  const { companyId, companyName, time, pointFixInfoList } = values;
  // const vals = { ...values };
  // deletedProps.forEach(p => delete vals[p]);
  console.log('values', values);

  return {
    ...values,
    companyId: { key: companyId, label: companyName },
    time: moment(time),
    section: pointFixInfoList.map(item => item.areaId).join(''),
  };
}
