import { stringify } from 'qs';
import request from '../../utils/request';

/* 查询企业 */
export async function queryCompanies(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/* 删除企业 */
export async function deleteCompany({ id }) {
  return request(`/acloud_new/v2/baseInfo/company/${id}`, {
    method: 'DELETE',
  });
}

/* 获取字典 */
export async function queryDict(params) {
  return request(`/acloud_new/v2/sys/dictDataForSelect?${stringify(params)}`);
}

/* 获取企业详情 */
export async function queryCompany({ id }) {
  return request(`/acloud_new/v2/baseInfo/company/${id}`);
}

/* 新建企业 */
export async function addCompany(params) {
  return request(`/acloud_new/v2/baseInfo/company`, {
    method: 'POST',
    body: params,
  });
}

/* 修改企业 */
export async function updateCompany({ id, ...restParams }) {
  return request(`/acloud_new/v2/baseInfo/company/${id}`, {
    method: 'PUT',
    body: restParams,
  });
}

/* 获取运维单位列表 */
export async function queryMaintenanceCompanies(params) {
  return request(`/acloud_new/v2/baseInfo/maintenanceCompanies?${stringify(params)}`);
}

/* 文件上传 */
export async function upload(params) {
  return request(`acloud_new/v2/uploadFile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: {
      ...params,
    },
  });
}

/* 获取行政区域 */
export async function fetchArea(params) {
  return request(`/acloud_new/v2/baseInfo/city/new?${stringify(params)}`);
}

/* gsafe版获取字典 */
export async function gsafeQueryDict(params) {
  return request(`/gsafe/dict/listForSelect.do?${stringify(params)}`);
}

/* gsafe版获取行业类别 */
export async function gsafeQueryIndustryType(params) {
  return request(`/gsafe/company/getCompanyIndustryTypeNew.do?${stringify(params)}`, {
    method: 'POST',
  });
}

/* 企业列表修改大屏权限（点亮） */
export async function editScreenPermission({ id, ...params }) {
  return request(`/acloud_new/v2/baseInfo/company/${id}/safety`, {
    method: 'PUT',
    body: params,
  });
}

/* 新增账号-初始化页面选项 */
export async function queryAddCompanyOptions() {
  return request(`/acloud_new/v2/baseInfo/company/options`);
}

/* 单位分部列表 */
export async function queryDivisionList(params) {
  return request(`/acloud_new/v2/companyBranch/companyBranchForPage?${stringify(params)}`);
}

/* 新增单位分部 */
export async function addDivision(params) {
  return request('/acloud_new/v2/companyBranch/companyBranch', {
    method: 'POST',
    body: params,
  });
}

/* 修改单位分部 */
export async function editDivision(params) {
  return request('/acloud_new/v2/companyBranch/companyBranch', {
    method: 'PUT',
    body: params,
  });
}

/* 删除单位分部 */
export async function deleteDivision({ id }) {
  return request(`/acloud_new/v2/companyBranch/companyBranch/${id}`, {
    method: 'DELETE',
  });
}

/* 查询单位个体 */
export async function queryDivisionDetail({ id }) {
  return request(`/acloud_new/v2/companyBranch/companyBranch/${id}`);
}
