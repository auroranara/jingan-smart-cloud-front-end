import React, { Fragment } from 'react';
import Link from 'umi/link';
import moment from 'moment';
import { DatePicker, Input, message, Popconfirm, Select } from 'antd';

import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';

const MAX_LENGTH = 20;
export const PAGE_SIZE = 20;
export const ROUTER = '/cards-info/emergency-card'; // modify
export const LIST_URL = `${ROUTER}/list`;

export const BREADCRUMBLIST = [ // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '三卡信息管理', name: '三卡信息管理' },
  { title: '应急卡', name: '应急卡', href: LIST_URL },
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
      label: '应急卡名称',
      render: () => <Input placeholder="请输入" allowClear />,
      transform: v => v.trim(),
    },
    {
      id: 'equipmentName',
      label: '作业/设备名称',
      render: () => <Input placeholder="请输入" allowClear />,
      transform: v => v.trim(),
    },
  ];

  if (isCompanyUser(+unitType))
    fields.shift();

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
      title: '应急卡名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '作业/设备名称',
      dataIndex: 'equipmentName',
      key: 'device',
    },
    {
      title: '风险提示',
      dataIndex: 'riskWarning',
      key: 'riskWarning',
      align: 'center',
      render: txt => txt.length > MAX_LENGTH ? `${txt.slice(0, MAX_LENGTH)}...` : txt,
    },
    {
      title: '应急处置方法',
      dataIndex: 'emergency',
      key: 'emergency',
      align: 'center',
      render: txt => txt.length > MAX_LENGTH ? `${txt.slice(0, MAX_LENGTH)}...` : txt,
    },
    {
      title: '注意事项',
      dataIndex: 'needAttention',
      key: 'needAttention',
      align: 'center',
      render: txt => txt.length > MAX_LENGTH ? `${txt.slice(0, MAX_LENGTH)}...` : txt,
    },
    {
      title: '应急联系方式',
      dataIndex: 'emgcy',
      key: 'emgcy',
      width: 250,
      // align: 'center',
      render(txt, { safetyNum, telNum }) {
        return [`内部：${safetyNum} ${telNum}`, '外部：火警 119  医疗救护 120'].map((n, i) => <p key={i} className={styles1.p}>{n}</p>);
      },
    },
    {
      title: '在线预览',
      dataIndex: 'preview',
      key: 'preview',
      width: 100,
      align: 'center',
      render: (p, record) => <a onClick={e => { e.preventDefault(); showModal(record); }}>预览</a>,
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
            <Link to={`${ROUTER}/view/${id}`} target="_blank">查看</Link>
            <Link to={`${ROUTER}/edit/${id}`} target="_blank" style={{ marginLeft: 8 }}>编辑</Link>
            <Popconfirm
              title="确定删除当前项目？"
              onConfirm={e => handleConfirmDelete(id)}
              okText="确定"
              cancelText="取消"
            ><span className={styles1.delete}>删除</span></Popconfirm>
          </Fragment>
        );
      },
    },
  ];

  if (isCompanyUser(+unitType))
    columns.shift();
  return columns;
}

// export const EDIT_FORMITEMS = [ // modify
//     { name: 'companyId', label: '单位名称', type: 'companyselect' },
//     { name: 'name', label: '应急卡名称' },
//     { name: 'equipmentName', label: '作业/设备名称' },
//     { name: 'riskWarning', label: '风险提示', type: 'text' },
//     { name: 'emergency', label: '应急处置方法', type: 'text' },
//     { name: 'needAttention', label: '注意事项', type: 'text' },
//     { name: 'emergency1', label: '应急联系方式-内部', type: 'component', component: '' },
//     { name: 'safetyNum', label: '安全负责人' },
//     { name: 'telNum', label: '联系方式' },
//     { name: 'emergency2', label: '应急联系方式-外部', type: 'component', component: '' },
//     { name: 'fire', label: '火警', type: 'component', component: '119' },
//     { name: 'rescue', label: '医疗救护', type: 'component', component: '120' },
// ];

export function handleEquipmentValues(values) {
  const { letterName, dangerFactor, emergencyMeasures, preventMeasures } = values;
  console.log(values);
  return {
    equipmentName: letterName,
    riskWarning: dangerFactor,
    emergency: emergencyMeasures,
    needAttention: preventMeasures,
  };
}
