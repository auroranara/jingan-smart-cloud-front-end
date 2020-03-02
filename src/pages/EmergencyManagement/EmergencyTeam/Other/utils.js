import React, { Fragment } from 'react';
// import Link from 'umi/link';
import { Input, Divider, Select } from 'antd';

import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';
import codes from '@/utils/codes';
import { AuthPopConfirm, AuthLink } from '@/utils/customAuth';
import styles from '../List/index.less';

const { Option } = Select;

// 权限
const {
  baseInfo: {
    surroundingEnvironmentInfo: { view: viewCode, edit: editCode, delete: deleteCode },
  },
} = codes;

const teamType = [
  { key: '1', value: '公司' },
  { key: '2', value: '工厂-车间' },
  { key: '3', value: '工序=班组' },
];
export { teamType };

export const ROUTER = '/emergency-management/emergency-team'; // modify
export const LIST_URL = `${ROUTER}/list`;

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '应急管理', name: '应急管理' },
  { title: '应急队伍管理', name: '应急队伍管理', href: LIST_URL },
];

export function getSearchFields(unitType) {
  const fields = [
    {
      id: 'teamType',
      label: '队伍级别',
      render: () => (
        <Select placeholder="请选择" allowClear>
          {teamType.map(({ key, value }) => (
            <Option key={key} value={key}>
              {value}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      id: 'companyName',
      label: '单位名称',
      render: () => <Input placeholder="请输入" allowClear />,
      transform: v => v.trim(),
    },
  ];

  if (isCompanyUser(+unitType)) fields.pop();

  return fields;
}

export function getTableColumns(handleConfirmDelete, unitType) {
  const columns = [
    {
      title: '单位名称',
      dataIndex: 'companyName',
      key: 'companyName',
      align: 'center',
      width: 250,
    },
    {
      title: '队伍名称',
      dataIndex: 'teamName',
      key: 'teamName',
      align: 'center',
    },
    {
      title: '队伍级别',
      dataIndex: 'teamLevel',
      key: 'teamLevel',
      align: 'center',
    },
    {
      title: '队伍负责人',
      dataIndex: 'surroundEnvir',
      key: 'surroundEnvir',
      align: 'center',
      width: 180,
      render: (val, row) => {
        return (
          <div className={styles.multi}>
            <div className={styles.item}>
              <span className={styles.label}>姓名:</span>
              <span>{'即使对方开始'}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>部门:</span>
              <span>{234234}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>手机:</span>
              <span>{324234}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>固定电话:</span>
              <span>{324234}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: '队伍描述',
      dataIndex: 'note',
      key: 'note',
      align: 'center',
    },
    {
      title: '队伍人员',
      dataIndex: 'personNum',
      key: 'personNum',
      align: 'center',
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

export function handleDetails(values, deletedProps = ['companyName']) {
  const { companyId, companyName } = values;
  // const vals = { ...values };
  // deletedProps.forEach(p => delete vals[p]);
  console.log('values', values);

  return {
    ...values,
    companyId: { key: companyId, label: companyName },
  };
}
