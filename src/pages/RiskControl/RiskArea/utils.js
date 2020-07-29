export const NAMESPACE = 'riskArea';

export const LIST_API = `${NAMESPACE}/getList`;

export const MAP_API = `${NAMESPACE}/getMap`;

export const PERSON_API = `${NAMESPACE}/getPersonList`;

export const DETAIL_API = `${NAMESPACE}/getDetail`;

export const ADD_API = `${NAMESPACE}/add`;

export const EDIT_API = `${NAMESPACE}/edit`;

export const DELETE_API = `${NAMESPACE}/remove`;

export const SAVE_API = `${NAMESPACE}/save`;

export const BREADCRUMB_LIST_PREFIX = [
  { title: '首页', name: '首页', href: '/' },
  { title: '风险分级管控', name: '风险分级管控' },
];

export const COMPANY_LIST_MAPPER = {
  namespace: 'common',
  list: 'unitList',
  getList: 'getUnitList',
};

export const COMPANY_LIST_FIELDNAMES = {
  key: 'id',
  value: 'name',
};

export const DETAIL_CODE = `riskControl.${NAMESPACE}.view`;
export const ADD_CODE = `riskControl.${NAMESPACE}.add`;
export const EDIT_CODE = `riskControl.${NAMESPACE}.edit`;
export const DELETE_CODE = `riskControl.${NAMESPACE}.delete`;
export const LIST_PATH = `/risk-control/risk-area/list`;
export const DETAIL_PATH = `/risk-control/risk-area/detail`;
export const ADD_PATH = `/risk-control/risk-area/add`;
export const EDIT_PATH = `/risk-control/risk-area/edit`;
