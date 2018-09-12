import { stringify } from 'qs';
import request from '../utils/request';

// 获取检测指数和多种设备数量
export async function fetchCountAndExponent(params) {
  return request(`/acloud_new/v2/monitor/countStatus.json?${stringify(params)}`)
}

// 获取报警信息
export async function fetchAlarmInfo(params) {
  return request(`/acloud_new/v2/deviceInfo/deviceWarningMessageForCompany?${stringify(params)}`)
}
