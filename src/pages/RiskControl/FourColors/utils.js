export const NAMESPACE = 'fourColors';

const CODE = 'fourColorImage';

const URL = 'four-color-image';

export const LIST_API = `${NAMESPACE}/getList`;

export const MAP_API = `${NAMESPACE}/getMap`;

export const AREA_API = `${NAMESPACE}/getAreaList`;

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

export const DETAIL_CODE = `riskControl.${CODE}.view`;
export const ADD_CODE = `riskControl.${CODE}.add`;
export const EDIT_CODE = `riskControl.${CODE}.edit`;
export const DELETE_CODE = `riskControl.${CODE}.delete`;
export const LIST_PATH = `/risk-control/${URL}/list`;
export const DETAIL_PATH = `/risk-control/${URL}/detail`;
export const ADD_PATH = `/risk-control/${URL}/add`;
export const EDIT_PATH = `/risk-control/${URL}/edit`;

export const FourLvls = [
  { key: 1, value: '红', color: 'rgb(252, 31, 2)' },
  { key: 2, value: '橙', color: 'rgb(237, 126, 17)' },
  { key: 3, value: '黄', color: '#FFCC33' },
  { key: 4, value: '蓝', color: 'rgb(30, 96, 255)' },
];
