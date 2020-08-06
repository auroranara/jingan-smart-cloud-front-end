import moment from 'moment';
import { Input, Select, DatePicker } from 'antd';

import CompanySelect from '@/jingan-components/CompanySelect';

const { RangePicker } = DatePicker;
const { Option } = Select;

export const PAGE_SIZE = 20;
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const CHANGE_TYPE_LIST = [
  { key: 'add', value: '添加' },
  { key: 'update', value: '修改' },
  { key: 'delete', value: '删除' },
];
export const DATA_TYPE_LIST = [
  { key: 'dept', value: '部门' },
  { key: 'safeEng', value: '注册安全工程师' },
  { key: 'secm', value: '特种作业操作证人员' },
  { key: 'sewm', value: '特种设备操作证' },
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

function getValueByKey(k, list) {
  const target = list.find(({ key }) => key === k);
  if (target)
    return target.value;
}

const DATA_TYPE_MAP = {
  'dept': '/base-info/company/department/list',
  'safeEng': '/base-info/registered-engineer-management/view',
  'secm': '/operation-safety/special-operation-permit/view',
  'sewm': '/operation-safety/special-equipment-operators/view',
  'gwgy': '/major-hazard-info/high-risk-process/detail',
  'se': '/facility-management/special-equipment/detail',
  'sczz': '/major-hazard-info/high-risk-process/detail',
  'tankArea': '/major-hazard-info/storage-area-management/detail',
  'tank': '/major-hazard-info/storage-management/view',
  'wareHouse': '/major-hazard-info/storehouse/detail',
  'wareHouseArea': '/major-hazard-info/reservoir-region-management/view',
  'gasHolder': '/major-hazard-info/gasometer/detail',
  'area': '',
  'point': '/risk-control/risk-point-manage/risk-point-edit',
};

function getRouter(dataId, type, companyId) {
  let id = dataId;
  if (type === 'dept')
    id = companyId;
  return `${DATA_TYPE_MAP[type]}/${id}`;
}

export const BREADCRUMBLIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '风险分级管控', name: '风险分级管控' },
  { title: '变更预警管理', name: '变更预警管理' },
];

export function getSearchFields(getRangeFromEvent, isComUser) {
  const span = isComUser ? 12 : 8;

  const fields = [
    {
      id: 'companyId',
      label: '单位名称',
      render: () => <CompanySelect placeholder="请输入单位名称" allowClear />,
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
      id: 'userName',
      label: '操作人',
      span,
      render: () => <Input placeholder="请输入操作人" allowClear />,
      transform: v => v.trim(),
    },
    {
      id: 'range',
      label: '操作时间',
      span,
      render: () => <RangePicker showTime={{ format: 'HH:mm:ss' }} allowClear />,
      options: {
        getValueFromEvent: getRangeFromEvent,
      },
    },
  ];

  if (isComUser)
    fields.shift();

  return fields;
}

export const COLUMNS = [
  {
    title: '单位名称',
    dataIndex: 'companyName',
    key: 'companyName',
  },
  {
    title: '变更对象',
    dataIndex: 'dataType',
    key: 'dataType',
    width: 200,
    align: 'center',
    render: d => getValueByKey(d, DATA_TYPE_LIST),
  },
  {
    title: '变更操作',
    dataIndex: 'changeType',
    key: 'changeType',
    width: 100,
    align: 'center',
    render: c => getValueByKey(c, CHANGE_TYPE_LIST),
  },
  {
    title: '变更内容',
    dataIndex: 'changeContent',
    key: 'changeContent',
    render: c => <div style={{ whiteSpace: 'pre-wrap' }}>{c.replace(/\/r\/n/g, '\n')}</div>,
  },
  {
    title: '操作时间',
    dataIndex: 'changeDate',
    key: 'changeDate',
    width: 200,
    align: 'center',
    render: t => moment(t).format(DATE_FORMAT),
  },
  {
    title: '操作人',
    dataIndex: 'userName',
    key: 'userName',
    width: 120,
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'dataId',
    key: 'dataId',
    width: 80,
    align: 'center',
    fixed: 'right',
    render(dataId, { changeType, dataType, companyId }) {
      return changeType === 'delete' || dataType === 'area'
        ? <span style={{ cursor: 'not-allowed' }}>查看</span>
        : <a href={`${window.publicPath}#${getRouter(dataId, dataType, companyId)}`} target="_blank" rel="noopener noreferrer">查看</a>;
    },
  },
];
