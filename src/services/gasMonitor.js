import request from '@/utils/request';
import { stringify } from 'qs';

// 获取实时监测列表
export async function getRealTimeList(params) {
  return request(`/acloud_new/v2/monitor/monitorEquipment/list?${stringify(params)}`);
}

// 获取列表
export async function getHistoryList(params) {
  return request(`/acloud_new/v2/monitor/sensorStatusHistory/page?${stringify(params)}`);
}

// 获取详情
export async function getHistoryDetail(params) {
  return request(`/acloud_new/v2/monitor/equipmentCountDto?${stringify(params)}`);
}

// 获取处理时效
export async function getDuration(params) {
  return request(`/acloud_new/v2/monitor/warningProcessExecuteMap?${stringify(params)}`);
}

// 获取预警报警次数趋势
export async function getCountTrend(params) {
  return request(`/acloud_new/v2/monitor/warnLevelCountDateMap?${stringify(params)}`);
}

// 获取排名
export async function getRank(params) {
  return request(`/acloud_new/v2/monitor/equipmentWarningCountMap?${stringify(params)}`);
}

// 获取排名
export async function getAlarmTrend(params) {
  return request(`/acloud_new/v2/monitor/equipmentWarningDateMap?${stringify(params)}`);
}

// 获取监测对象类型列表
export async function getMonitorObjectTypeList(params) {
  return request(`/acloud_new/v2/monitor/equipmentType?${stringify(params)}`);
}

// 获取监测对象列表
export async function getMonitorObjectList(params) {
  return request(`/acloud_new/v2/monitor/beMonitorTarget/list?${stringify(params)}`);
}

// 获取监测点列表
export async function getMonitorPointList(params) {
  return request(`/acloud_new/v2/monitor/monitorEquipment/list?${stringify(params)}`);
}