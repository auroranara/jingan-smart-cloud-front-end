export const CATEGORIES = [
  { key: '1', value: '准承包商' },
  { key: '2', value: '合格承包商' },
  { key: '3', value: '不合格承包商' },
];
export const TYPES = [
  { key: '1', value: '环境改造' },
  { key: '2', value: '工程检修安装' },
  { key: '3', value: '建筑施工' },
  { key: '4', value: '吊装作业' },
  { key: '5', value: '其他' },
];
export const STATUSES = [
  { key: '1', value: '未过期', status: 'success' },
  { key: '2', value: '即将过期', status: 'warning' },
  { key: '3', value: '已过期', status: 'error' },
];
export const COMPANY_FIELDNAMES = { key: 'id', value: 'name' };
export const COMPANY_MAPPER = { namespace: 'common', list: 'unitList', getList: 'getUnitList' };
export const FORMAT = 'YYYY-MM-DD';
export const TAB_LIST = [
  { key: '1', tab: '施工记录' },
  { key: '2', tab: '评定记录' },
  { key: '3', tab: '违章记录' },
];
