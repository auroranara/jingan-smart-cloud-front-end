import { stringify } from 'qs';
import request from '@/utils/request';

/* 获取单位列表 */
export async function getCompanyList(params) {
  return request(`/acloud_new/v2/baseInfo/getCompanyByUser?${stringify(params)}`);
}

/* 获取部门列表 */
export async function getDepartmentTree(params) {
  return request(`/acloud_new/v2/sys/sysDepartment?${stringify(params)}`);
}

/* 获取人员列表 */
export async function getPersonList(params) {
  return request(`/acloud_new/v2/performance/getHeader?${stringify(params)}`);
}
