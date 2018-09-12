import request from '../../utils/request';
import { stringify } from 'qs';

const URL_PREFIX = '/acloud_new/v2';

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
