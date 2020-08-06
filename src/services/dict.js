import { stringify } from 'qs';
import request from '@/utils/request';

/* 获取单位列表 */
export async function getCompanyList(params) {
  return request(`/acloud_new/v2/baseInfo/getCompanyByUser?${stringify(params)}`);
}

/* 获取部门树 */
export async function getDepartmentTree(params) {
  return request(`/acloud_new/v2/sys/sysDepartment?${stringify(params)}`);
}

/* 获取人员列表 */
export async function getPersonList(params) {
  return request(`/acloud_new/v2/performance/getHeader?${stringify(params)}`);
}

/* 获取网格树 */
export async function getGridTree(params) {
  return request(`/acloud_new/v2/gridInfo/getTreeDataById?${stringify(params)}`);
}

/* 获取单位分类列表 */
export async function getCompanyNatureList() {
  return request(`/acloud_new/v2/sys/dictDataForSelect?type=company_nature`);
}

/* 获取单位详情 */
export async function getCompanyDetail({ id }) {
  return request(`/acloud_new/v2/baseInfo/company/${id}`);
}

/* 获取单位状态列表 */
export async function getCompanyStatusList() {
  return request(`/gsafe/dict/listForSelect.do?type=companyState`);
}
