import { stringify } from 'qs';
import request from '@/utils/request';

/* 获取企业列表 */
export async function getCompanyList(params) {
  return request(`/acloud_new/v2/monitor/monitorCompany/page?${stringify(params)}`);
}

/* 获取监测类型详情 */
export async function getEquipmentTypeDetail({ id }) {
  return request(`/acloud_new/v2/monitor/equipmentType/${id}`);
}
