import { stringify } from 'qs';
import request from '@/utils/request';

/* 获取企业列表 */
export async function getCompanyList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/* 获取车辆列表 */
export async function getVehicleList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}
