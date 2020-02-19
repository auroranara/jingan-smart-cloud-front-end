import { Select } from 'antd';

import CompanySelect from '@/jingan-components/CompanySelect';
import { DATA_TYPE_LIST } from '../ChangeWarning/utils';

const { Option } = Select;

export const BREADCRUMBLIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '风险分级管控', name: '风险分级管控' },
  { title: '变更管理', name: '变更管理' },
];

export const STATUS = [
  { key: '0', value: '待审批' },
  { key: '1', value: '审批通过' },
  { key: '2', value: '审批不通过' },
];
export const STATUS_MAP = ['新增', '审批通过', '审批不通过'];

export const STYLE = { color: '#1890ff', cursor: 'pointer' };

export function getSearchFields(isComUser, sections=[], handleCompanyChange) {
  const span = isComUser ? 12 : 8;

  const fields = [
    {
      id: 'companyId',
      label: '单位名称',
      render: () => <CompanySelect onChange={handleCompanyChange} placeholder="请输入单位名称" allowClear />,
    },
    {
      id: 'zoneId',
      label: '所属风险分区',
      span,
      render: () => (
        <Select placeholder="请选择风险分区" allowClear>
          {sections.map(({ id: key, zoneName: value }) => <Option key={key} value={key}>{value}</Option>)}
        </Select>
      ),
    },
    {
      id: 'dataType',
      label: '变更对象',
      span,
      render: () => (
        <Select placeholder="请选择变更对象" allowClear>
          {DATA_TYPE_LIST.map(({ key, value }) => <Option key={key} value={key}>{value}</Option>)}
        </Select>
      ),
    },
    {
      id: 'status',
      label: '审批状态',
      span,
      render: () => (
        <Select placeholder="请选择审批状态" allowClear>
          {STATUS.map(({ key, value }) => <Option key={key} value={key}>{value}</Option>)}
        </Select>
      ),
    },
  ];

  if (isComUser)
    fields.shift();

  return fields;
}
