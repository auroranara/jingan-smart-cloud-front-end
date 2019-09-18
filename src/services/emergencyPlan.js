import request from '@/utils/request';
import { stringify } from 'qs';

// 应急预案列表
export async function getList(params) {
  return request(`/acloud_new/v2/emergency/emergencyPlanVersionList?${stringify(params)}`);
}

// 应急预案历史版本
export async function getHistory(params) {
  return request(`/acloud_new/v2/statistics/companySelfCheck?${stringify(params)}`);
}

// 应急预案详情
export async function getDetail({ id }) {
  return request(`/acloud_new/v2/emergency/emergencyPlan/${id}`);
}

// 新增应急预案
export async function add(params) {
  return request(`/acloud_new/v2/emergency/emergencyPlan`, {
    method: 'POST',
    body: params,
  });
}

// 编辑应急预案
export async function edit(params) {
  return request(`/acloud_new/v2/emergency/emergencyPlan`, {
    method: 'PUT',
    body: params,
  });
}
