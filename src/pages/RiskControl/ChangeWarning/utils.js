import { Select } from 'antd';

import CompanySelect from '@/jingan-components/CompanySelect';

const { Option } = Select;

export const PAGE_SIZE = 20;
export const CHANGE_TYPE_LIST = [
  { key: 'add', value: '添加' },
  { key: 'update', value: '修改' },
  { key: 'delete', value: '删除' },
];
export const DATA_TYPE_LIST = [
  { key: 'dept', value: '部门' },
  { key: 'safeEng', value: '注册安全工程师' },
  { key: 'secm', value: '特种作业操作证人员' },
  { key: 'sewm', value: '特种设备作业人员' },
  { key: 'gwgy', value: '高危工艺' },
  { key: 'se', value: '特种设备' },
  { key: 'sczz', value: '生产装置' },
  { key: 'tankArea', value: '储罐区' },
  { key: 'tank', value: '储罐' },
  { key: 'wareHouseArea', value: '库区' },
  { key: 'wareHouse', value: '库房' },
  { key: 'gasHolder', value: '气柜' },
  { key: 'area', value: '区域' },
  { key: 'point', value: '风险点' },
];

// const DATA_TYPE_MAP = {
//   'dept': '/base-info/company/department/list',
//   'safeEng': '/base-info/registered-engineer-management/view',
//   'secm': '/operation-safety/special-operation-permit/view',
//   'sewm': '/operation-safety/special-equipment-operators/view',
//   'gwgy': '/major-hazard-info/high-risk-process/detail',
//   'se': '/facility-management/special-equipment/detail',
//   'sczz': '/major-hazard-info/high-risk-process/detail',
//   'tankArea': '/major-hazard-info/storage-area-management/detail',
//   'tank': '/major-hazard-info/storage-management/view',
//   'wareHouse': '/major-hazard-info/storehouse/detail',
//   'wareHouseArea': '/major-hazard-info/reservoir-region-management/view',
//   'gasHolder': '/major-hazard-info/gasometer/detail',
//   'area': '',
//   'point': '/risk-control/risk-point-manage/risk-point-edit',
// };

export const BREADCRUMBLIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '风险分级管控', name: '风险分级管控' },
  { title: '变更预警管理', name: '变更预警管理' },
];

export const STATUS = [
  { key: '0', value: '待评价' },
  { key: '1', value: '已评价' },
];

export function getSearchFields(getRangeFromEvent, isComUser, sections=[]) {
  const span = isComUser ? 12 : 8;

  const fields = [
    {
      id: 'companyId',
      label: '单位名称',
      render: () => <CompanySelect placeholder="请输入单位名称" allowClear />,
    },
    {
      id: 'section',
      label: '所属风险分区',
      span,
      render: () => (
        <Select placeholder="请选择风险分区" allowClear>
          {sections.map(({ key, value }) => <Option key={key} value={key}>{value}</Option>)}
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
      label: '评价状态',
      span,
      render: () => (
        <Select placeholder="请选择评价状态" allowClear>
          {STATUS.map(({ key, value }) => <Option key={key} value={key}>{value}</Option>)}
        </Select>
      ),
    },
  ];

  if (isComUser)
    fields.shift();

  return fields;
}

export function getColumns(genConfirmEvaluate) {
  return [
    {
      title: '单位名称',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: '变更对象',
      dataIndex: 'dataTypeName',
      key: 'dataTypeName',
      width: 200,
      align: 'center',
    },
    {
      title: '变更操作',
      dataIndex: 'changeTypeName',
      key: 'changeTypeName',
      width: 100,
      align: 'center',
    },
    {
      title: '变更内容',
      dataIndex: 'dataEntity',
      key: 'dataEntity',
      render: c => <div style={{ whiteSpace: 'pre-wrap' }}>{c.replace(/\/r\/n/g, '\n')}</div>,
    },
    {
      title: '所属风险分区',
      dataIndex: 'zoneName',
      key: 'zoneName',
      width: 200,
      align: 'center',
    },
    {
      title: '评价状态',
      dataIndex: 'statusName',
      key: 'statusName',
      width: 120,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      align: 'center',
      fixed: 'right',
      render(id, { status }) {
        return status === '0'
          ? <span onClick={genConfirmEvaluate(id)} style={{ color: '#1890ff', cursor: 'pointer' }}>标为已评价</span>
          : null;
      },
    },
  ];
}
