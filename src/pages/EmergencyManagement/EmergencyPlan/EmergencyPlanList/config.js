export const TITLE = '应急预案';
export const BREADCRUMB_LIST = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '应急管理',
    name: '应急管理',
  },
  {
    title: TITLE,
    name: TITLE,
  },
];
export const TYPE_CODES = [
  {
    key: '66A00',
    value: '66A00 综合应急预案',
  },
  {
    key: '66B00',
    value: '66B00 专项应急预案',
  },
  {
    key: '66C00',
    value: '66C00 现场处置预案',
  },
  {
    key: '66Y00',
    value: '66Y00 其他企业级应急预案',
  },
];
export const RECORD_STATUSES = [
  {
    key: '0',
    value: '未备案',
  },
  {
    key: '1',
    value: '已备案',
  },
];
export const AUDIT_STATUSES = [
  {
    key: '0',
    value: '待审核',
  },
  {
    key: '1',
    value: '审核通过',
  },
  {
    key: '-1',
    value: '审核不通过',
  },
];
export const PUBLISH_STATUSES = [
  {
    key: '0',
    value: '待发布',
  },
  {
    key: '1',
    value: '已发布',
  },
];
export const STATUSES = [
  {
    key: '1',
    value: '待审核',
  },
  {
    key: '2',
    // value: '审核通过待发布',
    value: '待发布',
  },
  {
    key: '3',
    value: '审核不通过',
  },
  {
    key: '4',
    // value: '审核通过已发布',
    value: '已发布',
  },
  {
    key: '5',
    value: '已作废',
  },
];
export const SECRET_CODES = [
  {
    key: '0',
    value: '机密',
  },
  {
    key: '1',
    value: '秘密',
  },
  {
    key: '2',
    value: '限制',
  },
  {
    key: '3',
    value: '公开',
  },
  {
    key: '9',
    value: '其他',
  },
];
export const DATE_STATUS = ['未到期', '即将到期', '已过期']; //到期状态  0：未到期 1：即将到期 2：已过期
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_NUM = 1;
export const ADD_CODE = 'emergencyManagement.emergencyPlan.add';
export const EDIT_CODE = 'emergencyManagement.emergencyPlan.edit';
export const DETAIL_CODE = 'emergencyManagement.emergencyPlan.detail';
export const AUDIT_CODE = 'emergencyManagement.emergencyPlan.audit';
export const PUBLISH_CODE = 'emergencyManagement.emergencyPlan.publish';
