import { stringify } from 'qs';
import request from '../utils/request';

const URL_PREFIX = '/acloud_new/v2/automaticFireAlarmSystem';

// 公司列表
export async function queryCompanies(params) {
  // return request(`/api/transmission_device_list?${stringify(params)}`);
  return request(`${URL_PREFIX}/companies?${stringify(params)}`);
}

export async function queryAlarmData(companyId) {
  return request(`${URL_PREFIX}/company/${companyId}`);
}

export async function queryAlarmDetail({ companyId, detailId }) {
  return request(`${URL_PREFIX}/company/${companyId}/detail/${detailId}`);
}
