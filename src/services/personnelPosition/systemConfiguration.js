import { stringify } from 'qs';
import request from '@/utils/request';

// 获取系统配置列表
export async function fetchSystemConfiguration(params) {
  return request(`/acloud_new/v2/location/locationSysForPage?${stringify(params)}`);
}

// 新增系统配置
export async function addSystemConfiguration(params) {
  return request('/acloud_new/v2/location/locationSys', {
    method: 'POST',
    body: params,
  });
}

// 编辑系统配置
export async function editSystemConfiguration(params) {
  return request('/acloud_new/v2/location/locationSys', {
    method: 'PUT',
    body: params,
  });
}

// 删除系统配置
export async function deleteSystemConfiguration({ id }) {
  return request(`/acloud_new/v2/location/locationSys/${id}`, {
    method: 'DELETE',
  });
}

// 系统配置选择企业时获取企业列表
export async function fetchSysCompanies(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`)
}
