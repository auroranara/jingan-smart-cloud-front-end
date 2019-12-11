import { Input, Select, DatePicker } from 'antd';

import CompanySelect from '@/jingan-components/CompanySelect';

const { RangePicker } = DatePicker;
export const PAGE_SIZE = 20;
export const BREADCRUMBLIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '风险分级管控', name: '风险分级管控' },
  { title: '变更预警管理', name: '变更预警管理' },
];

export const SEARCH_FIELDS = [
  {
    id: 'companyId',
    label: '单位名称',
    render: () => <CompanySelect placeholder="请输入单位名称" allowClear />,
  },
  {
    id: 'changeType',
    label: '变更对象',
    render: () => <Select placeholder="请选择变更对象" allowClear />,
  },
  {
    id: 'userName',
    label: '操作人',
    render: () => <Input placeholder="请输入操作人" allowClear />,
    transform: v => v.trim(),
  },
  {
    id: 'range',
    label: '操作时间',
    render: () => <RangePicker allowClear />,
  },
];

export const COLUMNS = [

];
