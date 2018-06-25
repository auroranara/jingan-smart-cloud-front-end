import { stringify } from 'qs';
import request from '../../utils/request';

/* 查询企业 */
export async function queryCompanies(params) {
  return request(`/acloud_new/v2/baseInfo/companies.json?${stringify(params)}`);
}

/* 删除企业 */
export async function deleteCompany({ id }) {
  return request(`/acloud_new/v2/baseInfo/company/${id}`, {
    method: 'DELETE',
  });
}

/* 获取字典 */
export async function queryDict(params) {
  return request(`/acloud_new/v2/sys/dict/list?${stringify(params)}`);
}

/* 获取企业详情 */
export async function queryCompany({ id }) {
  return request(`/acloud_new/v2/baseInfo/company/${id}.json`);
}

/* 新建企业 */
export async function addCompany(params) {
  return request(`/acloud_new/v2/baseInfo/company`, {
    method: 'PUT',
    body: params,
  });
}

/* 修改企业 */
export async function updateCompany({ id, ...restParams }) {
  return request(`/acloud_new/v2/baseInfo/company/${id}`, {
    method: 'POST',
    body: restParams,
  });
}

/* 获取维保单位列表 */
export async function queryMaintenanceCompanies(params) {
  return request(`/acloud_new/v2/baseInfo/company?${stringify(params)}`);
}

/* 文件上传 */
export async function upload(params) {
  return request(`acloud_new/v2/uploadFile`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
