export const BREADCRUMB_LIST_PREFIX = [
  { title: '首页', name: '首页', href: '/' },
  { title: '重大危险源监测预警系统', name: '重大危险源监测预警系统' },
  { title: '监测预警', name: '监测预警' },
];

export const NAMESPACE = 'majorHazardDistribution';

export const MAP_LIST_API = 'common/getMapList';

export const LIST_API = `${NAMESPACE}/getList`;

export const COMBUSTIBLE_GAS_POINT_LIST_API = `${NAMESPACE}/getCombustibleGasPointList`;

export const TOXIC_GAS_POINT_LIST_API = `${NAMESPACE}/getToxicGasPointList`;

export const VIDEO_POINT_LIST_API = `${NAMESPACE}/getVideoPointList`;

export const DETAIL_API = `${NAMESPACE}/getDetail`;

export const SECURITY_API = `${NAMESPACE}/getSecurity`;

export const COUNT_API = `${NAMESPACE}/getCount`;

export const LOCATION_LIST_API = `${NAMESPACE}/getLocationList`;

export const ALARM_LIST_API = `${NAMESPACE}/getAlarmList`;

export const TANK_AREA_MONITOR_LIST_API = `${NAMESPACE}/getTankAreaMonitorList`;

export const TANK_MONITOR_LIST_API = `${NAMESPACE}/getTankMonitorList`;

export const SECURITY_LIST_API = `${NAMESPACE}/getSecurityList`;

export const SURROUNDING_LIST_API = `${NAMESPACE}/getSurroundingList`;

export const UPDATE_LIST_API = `${NAMESPACE}/updateList`;

export const SAVE_API = `${NAMESPACE}/save`;

export const ALARM_MESSAGE_LIST_API = `${NAMESPACE}/getAlarmMessageList`;

export const DETAIL_CODE = `monitoringAndEarlyWarning.${NAMESPACE}.detail`;

export const SECURITY_CODE = `monitoringAndEarlyWarning.${NAMESPACE}.security`;

export const TANK_CODE = `majorHazardInfo.storageAreaManagement.edit`;

export const ALARM_WORK_ORDER_CODE = `companyIot.alarmWorkOrder.detail`;

export const MONITOR_TREND_CODE = `companyIot.alarmWorkOrder.monitorTrend`;

export const ALARM_MESSAGE_CODE = `companyIot.alarmMessage.list`;

export const TYPES = [{ key: '1', tab: '列表' }, { key: '2', tab: '地图' }];

export const LIST_GRID = {
  gutter: 24,
  xl: 2,
  sm: 1,
  xs: 1,
};

export const COLORS = [
  'rgb(255, 72, 72)',
  'rgb(241, 122, 10)',
  'rgb(251, 247, 25)',
  'rgb(30, 96, 255)',
];

export const LEVELS = ['一级', '二级', '三级', '四级'];

export const ALARM_MESSAGE_PATH = '/company-iot/alarm-message/list?majorHazard=1';

export const WEBSOCKET_OPTIONS = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};

export const FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const SURROUNDING_TYPE_MAPPER = {
  1: '住宅区',
  2: '生产单位',
  3: '机关团体',
  4: '公共场所',
  5: '交通要道',
  6: '其他',
};
