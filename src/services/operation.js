
import request from '@/utils/request';
import { stringify } from 'qs';

// 获取任务列表
export async function getTaskList(params) {
  return request(`/acloud_new/v2/sdf/detailForScreen?${stringify(params)}`);
}

// 获取任务统计
export async function getTaskCount() {
  return request(`/acloud_new/v2/sdf/countNumForScreen`);
}

// 获取火警统计
export async function getFireCount(params) {
  return request(`/acloud_new/v2/statistics/maintenanceCheck?${stringify(params)}`);
}

// 获取企业列表
export async function getUnitList(params) {
  return request(`/acloud_new/v2/sdf/companyList?${stringify(params)}`);
}
