import request from '@/utils/cockpitRequest';
import { stringify } from 'qs';

const URL_PREFIX = '/acloud_new/v2';

// 燃气--大屏主页面显示
export async function getBigFlatformData(params) {
  return request(`${URL_PREFIX}/gasScreen/index?${stringify(params)}`);
}

// 燃气--接入单位统计
export async function getImportingTotal(params) {
  return request(`${URL_PREFIX}/gasScreen/Importing?${stringify(params)}`);
}

// 燃气--异常单位统计
export async function getAbnormalingTotal(params) {
  return request(`${URL_PREFIX}/gasScreen/abnormaling?${stringify(params)}`);
}

// 燃气--待处理业务
export async function getPendingMission(params) {
  return request(`${URL_PREFIX}/shg/getPendingGas?${stringify(params)}`);
}

// 获取告警信息列表
export async function getMessages(params) {
  return request(`${URL_PREFIX}/screen/screenMessageForGov?screenType=4`);
}

// 获取网格id
export async function getCompanyId(params) {
  return request(`${URL_PREFIX}/screen/elecSafe/getDefaultGridId`);
}

// 获取单位数据
export async function getUnitData(params) {
  return request(`${URL_PREFIX}/screen/elecSafe/companyList`);
}

// 获取企业设备统计数
export async function getDeviceStatusCount(params) {
  return request(`${URL_PREFIX}/screen/elecSafe/deviceStatusCount?${stringify(params)}`);
}

// 获取设备列表
export async function getDevices(params) {
  return request(`${URL_PREFIX}/deviceInfo/getCompanyDevicesByType?${stringify(params)}`);
}

// 获取实时监测数据
export async function getDeviceRealTimeData(params) {
  return request(`${URL_PREFIX}/deviceInfo/getDeviceDataNew?${stringify(params)}`);
}

// 获取设备配置策略
export async function getDeviceConfig(params) {
  return request(`${URL_PREFIX}/deviceInfo/getLimitLine?${stringify(params)}`);
}

// 获取设备历史数据
export async function getDeviceHistoryData(params) {
  return request(`${URL_PREFIX}/deviceInfo/getDeviceDataHistory?${stringify(params)}`);
}

// 视频列表
export async function getCameraList(params) {
  return request(`${URL_PREFIX}/hdf/getAllCamera.json?${stringify(params)}`);
}

// 报警处理流程
export async function getGasForMaintenance(params) {
  return request(`${URL_PREFIX}/shg/getGasForMaintenance?${stringify(params)}`);
}

// 单位实时监测数据
export async function fetchRealTimeMonitor(params) {
  return request(`${URL_PREFIX}/shg/realTimeMonitor?${stringify(params)}`)
}

// 异常趋势图数据
export async function fetchAbnormalTrend(params) {
  return request(`/acloud_new/v2/shg/abnormalTrend?${stringify(params)}`)
}
