import { stringify } from 'qs';
import request from '../utils/request';

const URL_PREFIX = '/acloud_new/v2/automaticFireAlarmSystem';

// 公司列表
export async function queryCompanies(params) {
  // return request(`/api/transmission_device_list?${stringify(params)}`);
  return request(`${URL_PREFIX}/companies.json?${stringify(params)}`);
}

export async function queryAlarmData(companyId) {
  return request(`${URL_PREFIX}/company/${companyId}`);
}

export async function queryAlarmDetail({ companyId, detailId }) {
  return request(`${URL_PREFIX}/company/${companyId}/detail/${detailId}`);
}
// 历史纪录列表
export function queryCompanyHistories(query) {
  return request(`${URL_PREFIX}/company/${query.companyId}/histories?${stringify(query)}`)
}

// 获取主机编号列表
export function queryOptions(companyId) {
  return request(`${URL_PREFIX}/company/${companyId}/selectCondition`)
}

// 获取历史纪录详情
export function queryHistoryDetail(query) {
  return request(`${URL_PREFIX}/company/${query.companyId}/detail/${query.detailId}`)
}
