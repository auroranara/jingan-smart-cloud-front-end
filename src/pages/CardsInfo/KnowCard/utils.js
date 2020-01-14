import React, { Fragment } from 'react';
import Link from 'umi/link';
import moment from 'moment';
import { DatePicker, Input, Divider, Popconfirm, Select } from 'antd';

import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';
import codes from '@/utils/codes';
import { AuthPopConfirm, AuthLink } from '@/utils/customAuth';

// 权限
const {
  cardsInfo: {
    knowCard: { view: viewCode, edit: editCode, delete: deleteCode },
  },
} = codes;

// const MAX_LENGTH = 20;
const DATE_FORMAT = 'YYYY-MM-DD';
export const PAGE_SIZE = 20;
export const ROUTER = '/cards-info/know-card'; // modify
export const LIST_URL = `${ROUTER}/list`;

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '三卡信息管理', name: '三卡信息管理' },
  { title: '应知卡', name: '应知卡', href: LIST_URL },
];

export function getSearchFields(unitType) {
  const fields = [
    {
      id: 'companyName',
      label: '单位名称',
      render: () => <Input placeholder="请输入" allowClear />,
      transform: v => v.trim(),
    },
    {
      id: 'name',
      label: '应知卡名称',
      render: () => <Input placeholder="请输入" allowClear />,
      transform: v => v.trim(),
    },
    {
      id: 'publisher',
      label: '发布人员',
      render: () => <Input placeholder="请输入" allowClear />,
      transform: v => v.trim(),
    },
    {
      id: 'time',
      label: '发布时间',
      render: () => <DatePicker placeholder="请输入" allowClear />,
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
      title: '应知卡名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '发布人员',
      dataIndex: 'publisher',
      key: 'publisher',
      width: 100,
      align: 'center',
    },
    {
      title: '发布时间',
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
      render: (p, record) => {
        if (record && record.contentDetails && record.contentDetails.length) {
          return (
            <a
              onClick={e => {
                e.preventDefault();
                showModal(record);
              }}
            >
              预览
            </a>
          );
        }
        return '预览';
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      // fixed: 'right',
      render(id) {
        return (
          <Fragment>
            <AuthLink code={viewCode} to={`${ROUTER}/view/${id}`} target="_blank">
              查看
            </AuthLink>
            <Divider type="vertical" />
            <AuthLink
              code={editCode}
              to={`${ROUTER}/edit/${id}`}
              target="_blank"
              style={{ marginLeft: 8 }}
            >
              编辑
            </AuthLink>
            <Divider type="vertical" />
            <AuthPopConfirm
              code={deleteCode}
              title="确定删除当前项目？"
              onConfirm={e => handleConfirmDelete(id)}
              okText="确定"
              cancelText="取消"
            >
              删除
            </AuthPopConfirm>
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
//     { name: 'name', label: '应知卡名称' },
//     { name: 'content', label: '应知卡内容', type: 'text' },
//     { name: 'publisher', label: '发布人员' },
//     { name: 'time', label: '时间', type: 'datepicker' },
// ];
