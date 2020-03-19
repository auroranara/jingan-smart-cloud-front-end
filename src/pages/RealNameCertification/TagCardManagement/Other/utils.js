import React, { Fragment } from 'react';
// import Link from 'umi/link';
import { Input, Divider, Select } from 'antd';
import Ellipsis from '@/components/Ellipsis';

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
  { key: '1', value: '本单位人员' },
  { key: '2', value: '来访人员' },
  { key: '3', value: '外包人员' },
  { key: '4', value: '本单位车辆' },
  { key: '5', value: '来访车辆' },
  { key: '6', value: '其他' },
];

const useStatus = [{ key: '1', value: '已使用' }, { key: '2', value: '未使用' }];

export const getLevel = {
  1: '公司',
  2: '工厂-车间',
  3: '工序-班组',
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
      id: 'companyName',
      // label: 'IC卡号',
      render: () => <Input placeholder="请输入IC卡号" allowClear />,
      transform: v => v.trim(),
    },
    {
      id: 'companyName',
      // label: 'IC卡号',
      render: () => <Input placeholder="请输入SN号" allowClear />,
      transform: v => v.trim(),
    },
    {
      id: 'treamLevel',
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
      id: 'treamLevel',
      // label: '卡类型',
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

  if (isCompanyUser(+unitType)) fields.pop();
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
      dataIndex: 'treamName',
      key: 'treamName',
      align: 'center',
      width: 200,
    },
    {
      title: 'SN号',
      dataIndex: 'treamLevel',
      key: 'treamLevel',
      align: 'center',
      width: 150,
      render: val => getLevel[val],
    },
    {
      title: '标签卡类型',
      dataIndex: 'charger',
      key: 'charger',
      align: 'center',
      width: 220,
    },
    {
      title: '使用对象',
      dataIndex: 'treamDescription',
      key: 'treamDescription',
      align: 'center',
      width: 260,
      render: val => (
        <Ellipsis tooltip length={15} style={{ overflow: 'visible' }}>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '电量',
      dataIndex: 'personNumber',
      key: 'personNumber',
      align: 'center',
      // fixed: 'right',
      width: 120,
    },
    {
      title: '使用状态',
      dataIndex: 'status',
      key: 'personNumber',
      align: 'center',
      // fixed: 'right',
      width: 120,
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

export function handleDetails(values, deletedProps = ['companyName']) {
  const { companyId, companyName } = values;
  // console.log('values', values);

  return {
    ...values,
    companyId: { key: companyId, label: companyName },
  };
}
