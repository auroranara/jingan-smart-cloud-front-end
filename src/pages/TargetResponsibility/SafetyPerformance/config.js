export const COMPANY_FIELDNAMES = { key: 'id', value: 'name' };
export const COMPANY_MAPPER = { namespace: 'common', list: 'unitList', getList: 'getUnitList' };
export const DEPARTMENT_FIELDNAMES = { key: 'id', value: 'name' };
export const DEPARTMENT_MAPPER = {
  namespace: 'common',
  list: 'departmentList',
  getList: 'getDepartmentList',
};
export const RESULTS = [
  { key: '1', value: '通过', status: 'success' },
  { key: '0', value: '不通过', status: 'error' },
];
export const FORMAT = 'YYYY-MM-DD';
