import { stringify } from 'qs';
import request from '../utils/request';

/** 两单信息 */

const URL_PREFIX = '/acloud_new/v2/ci/doubleBill';

// 危险（有害）因素排查辨识清单

// 查看列表
export async function queryDangerElementList(params) {
  return request(`${URL_PREFIX}/dangerCheck/page?${stringify(params)}`);
}

// 同步数据
export async function queryDangerElementSync(params) {
  return request(`${URL_PREFIX}/dangerCheck/sync?${stringify(params)}`);
}

// 删除
export async function queryDangerElementDel({ ids }) {
  return request(`${URL_PREFIX}/dangerCheck/${ids}`, { method: 'DELETE' });
}

// 安全风险分级管控清单

// 查看列表
export async function querySafeRiskList(params) {
  return request(`${URL_PREFIX}/safetyControl/page?${stringify(params)}`);
}

// 同步数据
export async function querySafeRiskSync(params) {
  return request(`${URL_PREFIX}/safetyControl/sync?${stringify(params)}`);
}

// 删除
export async function querySafeRiskDel({ ids }) {
  return request(`${URL_PREFIX}/safetyControl/${ids}`, { method: 'DELETE' });
}
