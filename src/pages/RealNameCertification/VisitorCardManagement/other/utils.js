import React, { Fragment } from 'react';
import { Input, Select, Divider } from 'antd';
import { AuthPopConfirm, AuthLink } from '@/utils/customAuth';
import codes from '@/utils/codes';
import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';

// 权限
const {
  realNameCertification: {
    visitorRegistration: { cancelCard: cancelCardCode },
  },
} = codes;

const useStatus = [{ key: '0', value: '已使用' }, { key: '1', value: '未使用' }];

export const PAGE_SIZE = 20;
export const ROUTER = 'real-name-certification/visitor-registration'; // modify
export const LIST_URL = `${ROUTER}/list`;

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '基础信息', name: '基础信息' },
  { title: '标签卡管理', name: '标签卡管理' },
  { title: '访客卡管理', name: '访客卡管理', href: LIST_URL },
];

export function getSearchFields(unitType) {
  const fields = [
    // modify
    {
      id: 'user',
      label: '单位名称',
      render: () => <Input placeholder="请输入" allowClear />,
      transform: v => v.trim(),
    },
    {
      id: 'name',
      label: '卡名称',
      render: () => <Input placeholder="请输入" allowClear />,
      transform: v => v.trim(),
    },
    {
      id: 'ic',
      label: 'IC卡号',
      render: () => <Input placeholder="请输入" allowClear />,
      transform: v => v.trim(),
    },
    {
      id: 'sn',
      label: 'SN卡号',
      render: () => <Input placeholder="请输入" allowClear />,
      transform: v => v.trim(),
    },
    {
      id: 'status',
      label: '使用状态',
      render: () => (
        <Select placeholder="请选择使用状态" allowClear>
          {useStatus.map(({ key, value }) => (
            <Select.Option key={key} value={key}>
              {value}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];
  if (isCompanyUser(+unitType)) fields.shift();
  return fields;
}

export function getTableColumns(handleConfirmDelete, unitType) {
  const columns = [
    // modify
    {
      title: '单位名称',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: '卡名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'IC卡号',
      dataIndex: 'ic',
      key: 'ic',
    },
    {
      title: 'SN卡号',
      dataIndex: 'sn',
      key: 'ic',
    },
    {
      title: '使用次数',
      dataIndex: 'useNum',
      key: 'useNum',
    },
    {
      title: '使用状态',
      dataIndex: 'status',
      key: 'status',
      render: val => (val === '0' ? '已使用' : '未使用'),
    },
    {
      title: '操作',
      dataIndex: 'reason',
      key: 'reason',
      render: (val, row) => (
        <Fragment>
          <AuthLink
            // code={editCode}
            // to={`${ROUTER}/edit/${id}`}
            target="_blank"
            style={{ marginLeft: 8 }}
          >
            编辑
          </AuthLink>
          <Divider type="vertical" />
          <AuthPopConfirm
            // code={deleteCode}
            title="删除卡后会导致该卡历史定位记录也被删除，是否继续？"
            // onConfirm={e => handleConfirmDelete(id)}
            okText="确定"
            cancelText="取消"
          >
            删除
          </AuthPopConfirm>
        </Fragment>
      ),
    },
  ];
  if (isCompanyUser(+unitType)) columns.shift();
  return columns;
}
