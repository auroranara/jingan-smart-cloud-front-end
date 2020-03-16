import React, { Fragment } from 'react';
import Link from 'umi/link';
import { Input, Divider, Select } from 'antd';

import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';
import codes from '@/utils/codes';
import { AuthPopConfirm, AuthLink } from '@/utils/customAuth';
import styles from '../List/index.less';

const { Option } = Select;

// 权限
const {
  baseInfo: {
    surroundingEnvironmentInfo: { edit: editCode, delete: deleteCode },
  },
} = codes;

const getEnvirType = {
  1: '住宅区',
  2: '生产单位',
  3: '机关团体',
  4: '公共场所',
  5: '交通要道',
  6: '其他',
};

const envirType = [
  { key: '1', value: '住宅区' },
  { key: '2', value: '生产单位' },
  { key: '3', value: '机关团体' },
  { key: '4', value: '公共场所' },
  { key: '5', value: '交通要道' },
  { key: '6', value: '其他' },
];
export { envirType };

export const ROUTER = '/major-hazard-info/surrounding-environment-info'; // modify
export const LIST_URL = `${ROUTER}/list`;

export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '基本信息', name: '基本信息' },
  { title: '周边环境信息', name: '周边环境信息', href: LIST_URL },
];

export function getSearchFields(unitType) {
  const fields = [
    {
      id: 'environmentType',
      label: '周边环境类型',
      render: () => (
        <Select placeholder="请选择" allowClear>
          {envirType.map(({ key, value }) => (
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
      title: '周边环境',
      dataIndex: 'surroundEnvir',
      key: 'surroundEnvir',
      align: 'center',
      width: 200,
      render: (val, row) => {
        const { environmentType, environmentName, environmentBear } = row;
        return (
          <div className={styles.multi}>
            <div className={styles.item}>
              <span className={styles.label}>类型：</span>
              <span>{getEnvirType[environmentType]}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>名称：</span>
              <span>{environmentName}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>方位：</span>
              <span>{environmentBear}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: '与本企业最小距离(m)',
      dataIndex: 'minSpace',
      key: 'minSpace',
      align: 'center',
    },
    {
      title: '人员数量',
      dataIndex: 'perNumber',
      key: 'perNumber',
      align: 'center',
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
      width: 230,
      align: 'center',
      render: (val, row) => {
        const { contact, areaCode, telNumber, contactPhone, contactMail } = row;

        const isPhone = areaCode || telNumber;
        const isAreaCode = areaCode !== 'null' ? areaCode : '';
        const isTelPhone = telNumber !== 'null' ? telNumber : '';

        return (
          <div className={styles.multi}>
            <div className={styles.item}>
              <span className={styles.label}>姓名：</span>
              <span>{contact}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>固定电话：</span>
              <span>{isPhone ? isAreaCode + '-' + isTelPhone : '-'}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>移动电话：</span>
              <span>{contactPhone}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.label}>电子邮箱：</span>
              <span>{contactMail}</span>
            </div>
          </div>
        );
      },
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
            {/* <AuthLink code={viewCode} to={`${ROUTER}/Handle/${id}`} target="_blank">
                    查看
                </AuthLink>
                <Divider type="vertical" /> */}
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
  const { companyId, companyName, latitude, longitude } = values;
  // const vals = { ...values };
  // deletedProps.forEach(p => delete vals[p]);
  // console.log('values', values);

  return {
    ...values,
    companyId: { key: companyId, label: companyName },
    coordinate: latitude + ',' + longitude,
  };
}
