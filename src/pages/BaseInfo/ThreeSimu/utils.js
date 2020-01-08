import moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';
export const PAGE_SIZE = 10;
export const ROUTER = '/facility-management/three-simultaneity'; // modify
export const LIST_URL = `${ROUTER}/list`;
export const LIST = [];

// 项目类型选项 对应值 1 2 3 4
export const PROJECT = ['新建项目', '改建项目', '扩建项目', '其他项目'];
// 程序选项 对应值 1 2
export const PROGRAM = ['一般程序', '简易程序'];
// 类别 对应值 1 2
export const TYPE = ['备案', '审查'];
export const CONCLUSION = ['通过', '不通过'];

// 格式化日期
export const formatTime = (time, formatStr = DATE_FORMAT) => time ? moment(time).format(formatStr) : '-';

export const BREADCRUMBLIST = [ // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '设备设施管理', name: '设备设施管理' },
  { title: '三同时审批记录', name: '三同时审批记录', href: LIST_URL },
];
