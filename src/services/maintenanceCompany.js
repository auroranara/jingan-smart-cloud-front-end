import { stringify } from 'qs';
import request from '../utils/request';

// 维保单位列表
export async function queryMaintenanceCompanies(params) {
  return request(`/acloud_new/v2/fireControl/maintenanceCompanies?${stringify(params)}`);
}

// 查询维保单位列表
export async function queryMaintenanceCompany(params) {
  return request(`/acloud_new/v2/fireControl/maintenanceCompanies.json?${stringify(params)}`);
}

// 删除维保单位
export async function deleteMaintenanceCompany({ id }) {
  return request(`/acloud_new/v2/fireControl/maintenanceCompanies/${id}.json`, {
    method: 'DELETE',
  });
}

// 查看指定维保单位信息
export async function queryMaintenanceCompanyinfo(id) {
  return request(`/acloud_new/v2/fireControl/maintenanceCompanies/${id}.json`);
}

/* 修改维保单位信息 */
export async function updateMaintenanceCompany(params) {
  return request(`/acloud_new/v2/fireControl/maintenanceUnit.json`, {
    method: 'PUT',
    body: params,
  });
}

/* 新增维保单位信息 */
export async function addMaintenanceCompany(params) {
  return request(`/acloud_new/v2/fireControl/maintenanceCompanies.json`, {
    method: 'POST',
    body: params,
  });
}

/*  查询企业列表 */
export async function queryCompanyList(params) {
  return request(`/acloud_new/v2/fireControl/companyList.json?${stringify(params)}`);
}
