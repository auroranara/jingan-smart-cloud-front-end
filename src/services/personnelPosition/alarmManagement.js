import { stringify } from 'qs';
import request from '@/utils/request';

const URL_BASE = 'acloud_new/v2/location';

// 获取企业列表
export async function getCompanyList(params) {
  return request(`/acloud_new/v2/beaconPoint/beaconPointInfo/companies?${stringify(params)}`)
}

// 获取报警策略列表
export async function getAlarmList(params) {
  return request(`${URL_BASE}/locationWarningStrategyForPage?${stringify(params)}`)
}

// 获取地图列表
export async function getMapList(params) {
  return request(`/acloud_new/v2/companyMap/mapForPage?${stringify(params)}`);
}

// 获取区域列表
export async function getSectionList(params) {
  return request(`/acloud_new/v2/areaInfo/areaInfoForPage?${stringify(params)}`);
}

// 获取区域限制
export async function getSectionLimits(id) {
  return request(`${URL_BASE}/getLimit/${id}`);
}
