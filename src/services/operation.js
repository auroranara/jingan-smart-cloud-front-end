
import request from '@/utils/request';
import { stringify } from 'qs';

// 获取任务列表
export async function getTaskList(params) {
  return request(`/acloud_new/v2/statistics/maintenanceCheck?${stringify(params)}`);
}

// 获取任务统计
export async function getTaskCount(params) {
  return request(`/acloud_new/v2/statistics/maintenanceCheck?${stringify(params)}`);
}

// 获取火警统计
export async function getFireCount(params) {
  return request(`/acloud_new/v2/statistics/maintenanceCheck?${stringify(params)}`);
}
// 获取大屏消息
export async function getScreenMessage(params) {
  return request(`/acloud_new/v2/sdf/screenMessage?${stringify(params)}`)
}
