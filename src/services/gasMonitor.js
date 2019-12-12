import request from '@/utils/request';
import { stringify } from 'qs';

// 获取实时监测列表
export async function getRealTimeList(params) {
  return request(`/acloud_new/v2/monitor/monitorEquipment/list?${stringify(params)}`);
}

// 获取列表
export async function getList(params) {
  return request(`/acloud_new/v2/getList?${stringify(params)}`);
}

// 获取详情
export async function getDetail(params) {
  return request(`/acloud_new/v2/getDetail?${stringify(params)}`);
}
