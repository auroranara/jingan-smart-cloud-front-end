import React from 'react';
import { EmptyText } from '@/utils';
import locale from '@/locales/zh-CN';

export const modelName = 'LS';
export const listName = 'list';
export const detailName = 'detail';
export const listApi = 'LS/getList';
export const detailApi = 'LS/getDetail';
export const addApi = 'LS/add';
export const editApi = 'LS/edit';
export const deleteApi = 'LS/delete';
export const detailCode = 'riskControl.LS.detail';
export const addCode = 'riskControl.LS.add';
export const editCode = 'riskControl.LS.edit';
export const deleteCode = 'riskControl.LS.delete';
export const listPath = '/risk-control/LS/list';
export const detailPath = '/risk-control/LS/detail';
export const addPath = '/risk-control/LS/add';
export const editPath = '/risk-control/LS/edit';
export const parentLocale = locale['menu.riskControl'];
export const listLocale = locale['menu.riskControl.LS.list'];
export const detailLocale = locale['menu.riskControl.LS.detail'];
export const addLocale = locale['menu.riskControl.LS.add'];
export const editLocale = locale['menu.riskControl.LS.edit'];
export const levelMap = {
  1: {
    color: '#f5222d',
    label: '红',
  },
  2: {
    color: '#fa8c16',
    label: '橙',
  },
  3: {
    color: '#fadb14',
    label: '黄',
  },
  4: {
    color: '#1890ff',
    label: '蓝',
  },
};
export const possibilityList = [
  {
    key: '4',
    value: '4',
    label: '4',
  },
  {
    key: '3',
    value: '3',
    label: '3',
  },
  {
    key: '2',
    value: '2',
    label: '2',
  },
  {
    key: '1',
    value: '1',
    label: '1',
  },
];
export const severityList = [
  {
    key: '4',
    value: '4',
    label: '4',
  },
  {
    key: '3',
    value: '3',
    label: '3',
  },
  {
    key: '2',
    value: '2',
    label: '2',
  },
  {
    key: '1',
    value: '1',
    label: '1',
  },
];
export const RiskLevel = ({ value }) => (value ? <span>{`${value} 级`}</span> : <EmptyText />);
export const Color = ({ value }) => {
  const map = levelMap[value];
  return map ? <span style={{ color: map.color }}>{map.label}</span> : <EmptyText />;
};
