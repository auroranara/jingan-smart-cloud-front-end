
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

// 获取企业列表
export async function getUnitList(params) {
  return request(`/acloud_new/v2/sdf/companyList?${stringify(params)}`);
}

// 火警数量统计
export async function getFireCount() {
  return request(`/acloud_new/v2/sdf/getFireData`);
}

// 火警状态统计 饼图
export async function getFirePie(params) {
  return request(`/acloud_new/v2/sdf/getFireDealData?${stringify(params)}`);
}

// 火警状态统计 趋势图
export async function getFireTrend() {
  return request(`/acloud_new/v2/sdf/getFireTrend`);
}

// 火警统计列表
export async function getFireList(params) {
  return request(`/acloud_new/v2/sdf/getFireList?${stringify(params)}`);
}
