import React, { Fragment } from 'react';
// import Link from 'umi/link';
import { Input, Divider, Select } from 'antd';

import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';
import codes from '@/utils/codes';
import { AuthPopConfirm, AuthLink } from '@/utils/customAuth';

const { Option } = Select;

// 权限
const {
  personnelManagement: {
    tagCardManagement: { view: viewCode, edit: editCode, delete: deleteCode },
  },
} = codes;

const cardType = [
  { key: '1', value: '单位人员' },
  { key: '2', value: '临时人员' },
  { key: '3', value: '外协人员' },
  { key: '4', value: '单位车辆' },
  { key: '5', value: '来访车辆' },
  { key: '6', value: '其他' },
];

const useStatus = [{ key: '0', value: '已使用' }, { key: '1', value: '未使用' }];

const getCardType = {
  1: '单位人员',
  2: '临时人员',
  3: '外协人员',
  4: '单位车辆',
  5: '来访车辆',
  6: '其他',
  7: '访客卡',
};

const getStatus = {
  0: '已使用',
  1: '未使用',
};

export { cardType };

export const ROUTER = '/personnel-management/tag-card'; // modify
export const LIST_URL = `${ROUTER}/index`;

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '基础信息', name: '基础信息' },
  { title: '标签卡管理', name: '标签卡管理', href: LIST_URL },
];

export function getSearchFields(unitType) {
  const fields = [
    {
      id: 'companyName',
      // label: '单位名称',
      render: () => <Input placeholder="请输入单位名称" allowClear />,
      transform: v => v.trim(),
    },
    {
      id: 'icNumber',
      // label: 'IC卡号',
      render: () => <Input placeholder="请输入IC卡号" allowClear />,
      transform: v => v.trim(),
    },
    {
      id: 'snNumber',
      // label: 'SN卡号',
      render: () => <Input placeholder="请输入SN号" allowClear />,
      transform: v => v.trim(),
    },
    {
      id: 'labelType',
      // label: '卡类型',
      render: () => (
        <Select placeholder="请选择卡类型" allowClear>
          {cardType.map(({ key, value }) => (
            <Option key={key} value={key}>
              {value}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      id: 'status',
      // label: '使用状态',
      render: () => (
        <Select placeholder="请选择使用状态" allowClear>
          {useStatus.map(({ key, value }) => (
            <Option key={key} value={key}>
              {value}
            </Option>
          ))}
        </Select>
      ),
    },
  ];

  if (isCompanyUser(+unitType)) fields.shift();
  return fields;
}

export function getTableColumns(handleConfirmDelete, unitType, handlePesonListClick) {
  const columns = [
    {
      title: '单位名称',
      dataIndex: 'companyName',
      key: 'companyName',
      align: 'center',
      width: 260,
    },
    {
      title: 'IC卡号',
      dataIndex: 'icNumber',
      key: 'icNumber',
      align: 'center',
      width: 200,
    },
    {
      title: 'SN号',
      dataIndex: 'snNumber',
      key: 'snNumber',
      align: 'center',
      width: 150,
    },
    {
      title: '标签卡类型',
      dataIndex: 'labelType',
      key: 'labelType',
      align: 'center',
      width: 220,
      render: val => getCardType[val],
    },
    {
      title: '使用对象',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 200,
    },
    {
      title: '电量',
      dataIndex: 'electricity',
      key: 'electricity',
      align: 'center',
      width: 120,
    },
    {
      title: '使用状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 120,
      render: val => getStatus[val],
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      width: 180,
      align: 'center',
      fixed: 'right',
      render(id) {
        return (
          <Fragment>
            <AuthLink code={viewCode} to={`${ROUTER}/detail/${id}`} target="_blank">
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
              title="你确定要删除该卡？"
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

export function handleDetails(values, deletedProps = ['companyName']) {
  const { companyId, companyName } = values;
  // console.log('values', values);

  return {
    ...values,
    companyId: { key: companyId, label: companyName },
  };
}
