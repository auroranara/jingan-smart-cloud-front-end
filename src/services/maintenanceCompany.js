import { stringify } from 'qs';
import request from '../utils/request';

// 维保单位列表
export async function queryMaintenanceCompanies(params) {
  return request(`/acloud_new/v2/fireControl/maintenanceCompanies?${stringify(params)}`);
}

// 查询维保单位列表
export async function queryMaintenanceCompany(params) {
  return request(`/acloud_new/v2/fireControl/maintenanceCompanies?${stringify(params)}`);
}

// 删除维保单位
export async function deleteMaintenanceCompany({ id }) {
  return request(`/acloud_new/v2/fireControl/maintenanceCompanies/${id}`, {
    method: 'DELETE',
  });
}

/* 查看指定维保单位信息*/
export async function queryMaintenanceCompanyinfo(id) {
  return request(`/acloud_new/v2/fireControl/maintenanceCompanies/${id}.json`);
}

/* 获取除本身以外的维保单位列表 */
export async function queryExtraMaintenanceCompanies(params) {
  return request(`/acloud_new/v2/baseInfo/maintenanceCompanies?${stringify(params)}`);
}

/* 修改维保单位信息 */
export async function updateMaintenanceCompany(params) {
  return request(`/acloud_new/v2/fireControl/maintenanceUnit`, {
    method: 'PUT',
    body: params,
  });
}

/* 新增维保单位信息 */
export async function addMaintenanceCompany(params) {
  return request(`/acloud_new/v2/fireControl/maintenanceCompanies`, {
    method: 'POST',
    body: params,
  });
}

/*  查询企业列表 */
export async function queryCompanyList(params) {
  return request(`/acloud_new/v2/fireControl/companyList?${stringify(params)}`);
}

/* 根据维保单位id查询服务单位列表 */
export async function queryServiceUnit(params) {
  return request(`/acloud_new/v2/fireControl/companies/${params.id}?${stringify(params)}`);
}

/* 获取行政区域 */
export async function fetchAddress(params) {
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

/* 获取字典 */
export async function queryDict(params) {
  return request(`/acloud_new/v2/sys/dictDataForSelect?${stringify(params)}`);
}

/* 获取单位类型 */
export async function queryCompanyType() {
  return request(`/acloud_new/v2/baseInfo/company/options`);
}

/* 获取服务单位详情 */
export async function queryServiceDetail({ companyId }) {
  return request(`/acloud_new/v2/fireControl/company/${companyId}`);
}

/* 获取服务单位安监信息 */
export async function queryServiceSafetyInfo({ companyId }) {
  return request(`/acloud_new/v2/fireControl/company/${companyId}/safetyInfo`);
}

/* 获取服务单位字典 */
export async function queryServiceMenus() {
  return request(`/acloud_new/v2/fireControl/safetySelectInfo`);
}
