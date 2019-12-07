import { stringify } from 'qs';
import request from '@/utils/request';

/* 查询当前用户权限下的企业列表 */
export async function getCompanyList(params) {
  return request(`/acloud_new/v2/baseInfo/getCompanyByUser?${stringify(params)}`);
}

/* 获取区域列表 */
export async function getAreaList(params) {
  return request(`/acloud_new/v2/baseInfo/city/new?${stringify(params)}`);
}

// 获取监测类型列表
export async function getMonitorTypeList(params) {
  return request(`/acloud_new/v2/monitor/monitorTypeTree?${stringify(params)}`);
}
