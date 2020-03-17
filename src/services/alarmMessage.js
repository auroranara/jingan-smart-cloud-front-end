import request from '@/utils/request';
import { stringify } from 'qs';

// 获取列表
export async function getList(params) {
  return request(`/acloud_new/v2/monitor/sensorStatusHistory/page?${stringify(params)}`);
}

// 获取监测类型列表
export async function getMonitorTypeList(params) {
  return request(`/acloud_new/v2/monitor/monitorTypeTree?${stringify(params)}`);
}

// 获取重大危险源列表
export async function getMajorHazardList(params) {
  return request(`/acloud_new/v2/dangerSource/list?${stringify(params)}`);
}

// 获取监测对象类型列表
export async function getMonitorObjectTypeList(params) {
  return request(`/acloud_new/v2/monitor/equipmentType?${stringify(params)}`);
}

// 获取监测对象列表
export async function getMonitorObjectList(params) {
  return request(`/acloud_new/v2/monitor/beMonitorTarget/page?${stringify(params)}`);
}
