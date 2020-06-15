export const TYPES = [{ key: '1', tab: '登录日志' }, { key: '2', tab: '操作日志' }];
export const LOGIN_TYPES = [{ key: '1', value: '登入系统' }, { key: '2', value: '登出系统' }];
export const LOGIN_METHODS = [
  { key: '1', value: 'web' },
  { key: '2', value: 'android' },
  { key: '3', value: 'ios' },
];
export const FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const OPERATE_TYPES = [
  { key: '1', value: '新增' },
  { key: '2', value: '编辑' },
  { key: '3', value: '删除' },
];
export const NAMESPACE = 'systemManagement';
export const API = `${NAMESPACE}/getLogList`;
export const PAGE_SIZE = 10;
