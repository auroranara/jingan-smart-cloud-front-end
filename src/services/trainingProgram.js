import { stringify } from 'qs';
import request from '@/utils/request';

// 获取培训计划列表
export async function getList(params) {
  return request(`/acloud_new/v2/transmission/companies?${stringify(params)}`);
}

// 获取培训计划详情
export async function getDetail(params) {
  return request(`/acloud_new/v2/transmission/companies?${stringify(params)}`);
}

// 新增培训计划
export async function add(params) {
  return request(`/acloud_new/v2/emergency/emergencyPlan`, {
    method: 'POST',
    body: params,
  });
}

// 编辑培训计划
export async function edit(params) {
  return request(`/acloud_new/v2/emergency/emergencyPlan`, {
    method: 'PUT',
    body: params,
  });
}

// 执行培训计划
export async function execute(params) {
  return request(`/acloud_new/v2/emergency/emergencyPlan`, {
    method: 'PUT',
    body: params,
  });
}

// 删除培训计划
export async function remove(params) {
  return request(`/acloud_new/v2/emergency/emergencyPlan`, {
    method: 'DELETE',
    body: params,
  });
}
