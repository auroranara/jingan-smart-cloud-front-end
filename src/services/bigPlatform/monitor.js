import request from '../../utils/request';
import { stringify } from 'qs';

const URL_PREFIX = '/acloud_new/v2';

// 视频
export async function getAllCamera(params) {
  return request(`${URL_PREFIX}/hdf/getAllCamera.json?${stringify(params)}`);
}

// 视频
export async function getStartToPlay(params) {
  return request(`/acloud_new/dai/startToPlayForWeb.json?${stringify(params)}`);
}

export async function getGasCount(params) {
  return request(`${URL_PREFIX}/monitor/countStatus.json?${stringify(params)}`);
}

export async function getGasList(params) {
  return request(`${URL_PREFIX}/monitor/getRealTimeDataList.json?${stringify(params)}`);
}

// 获取企业传感器列表 根据传感器类型
export async function getCompanyDevices(params) {
  return request(`${URL_PREFIX}/monitor/companyDevices.json?${stringify(params)}`);
}

// 获取传感器监测参数
export async function getDeviceConfig(params) {
  return request(`${URL_PREFIX}/monitor/getDeviceConfig.json?${stringify(params)}`);
}

// 获取传感器实时数据和状态
export async function getRealTimeData(params) {
  return request(`${URL_PREFIX}/monitor/getRealTimeData.json?${stringify(params)}`);
}

// 获取检测指数和多种设备数量
export async function fetchCountAndExponent(params) {
  return request(`/acloud_new/v2/monitor/countStatus.json?${stringify(params)}`)
}

// 获取报警信息
export async function fetchAlarmInfo(params) {
  return request(`/acloud_new/v2/deviceInfo/deviceWarningMessageForCompany?${stringify(params)}`)
}

// 获取传感器历史
export async function getGsmsHstData(params) {
  return request(`/acloud_new/v2/monitor/getGsmsHstData.json?${stringify(params)}`);
}

// 获取上下线的区块
export async function getPieces(params) {
  return request(`/acloud_new/v2/monitor/getPieces.json?${stringify(params)}`);
}