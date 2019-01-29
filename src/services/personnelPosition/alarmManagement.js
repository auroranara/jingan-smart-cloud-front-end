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

// 获取标签列表
export async function getAllCards(params) {
  return request(`/acloud_new/v2/accessCard/accessCardInfoForPage?${stringify(params)}`);
}

// 获取单个报警策略
export async function getAlarmStrategy(id) {
  return request(`${URL_BASE}/locationWarningStrategy/${id}`,  {
  });
}

// 新增报警策略
export async function postAlarmStrategy(params) {
  return request(`${URL_BASE}/locationWarningStrategy`,  {
    method: 'POST',
    body: params,
  });
}

// 编辑报警策略
export async function putAlarmStrategy(params) {
  return request(`${URL_BASE}/locationWarningStrategy`,  {
    method: 'PUT',
    body: params,
  });
}

// 删除报警策略
export async function deleteAlarmStrategy(params) {
  return request(`${URL_BASE}/locationWarningStrategy/${stringify(params)}`,  { method: 'DELETE' });
}
