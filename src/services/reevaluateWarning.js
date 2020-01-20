import request from '@/utils/request';
import { stringify } from 'qs';

// 获取列表
export async function getList(params) {
  return request(`/acloud_new/v2/monitor/sensorStatusHistory/page?${stringify(params)}`);
}

export async function getReevaluatorList(params) {
  return request(`/acloud_new/v2/monitor/sensorStatusHistory/page?${stringify(params)}`);
}

export async function reevaluate(params) {
  return request(`/acloud_new/v2/monitor/sensorStatusHistory/page?${stringify(params)}`);
}

export async function getHistory(params) {
  return request(`/acloud_new/v2/monitor/sensorStatusHistory/page?${stringify(params)}`);
}
