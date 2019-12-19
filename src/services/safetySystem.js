import request from '@/utils/request';
import { stringify } from 'qs';

// 获取历史列表
export async function getHistoryList (params) {
  return request(`/acloud_new/v2/securityRuleManage/securityRuleManageVersionList?${stringify(params)}`);
}

// 获取列表
export async function getList (params) {
  return request(`/acloud_new/v2/securityRuleManage/securityRuleManageForPage?${stringify(params)}`);
}

// 获取详情
export async function getDetail ({ id }) {
  return request(`/acloud_new/v2/securityRuleManage/securityRuleManage/${id}`);
}

// 新增
export async function add (params) {
  return request(`/acloud_new/v2/securityRuleManage/securityRuleManage`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function edit (params) {
  return request(`/acloud_new/v2/securityRuleManage/securityRuleManage`, {
    method: 'PUT',
    body: params,
  });
}

// 删除
export async function remove ({ id }) {
  return request(`/acloud_new/v2/securityRuleManage/securityRuleManage/${id}`, {
    method: 'DELETE',
  });
}

// 审核
export async function audit (params) {
  return request(`/acloud_new/v2/securityRuleManage/securityRuleManage/approve?${stringify(params)}`);
}

// 发布
export async function publish (params) {
  return request(`/acloud_new/v2/securityRuleManage/securityRuleManage/publish?${stringify(params)}`);
}

// 提交审批
export async function submitReview (body) {
  return request('/acloud_new/v2/securityRuleManage/securityRuleManage/approve', {
    method: "POST",
    body,
  })
}
