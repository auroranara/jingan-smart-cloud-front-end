import { stringify } from 'qs';
import request from '../utils/request';

/** 两单信息 */

const URL_PREFIX = '/acloud_new/v2';

// 危险（有害）因素排查辨识清单

// 查看列表
export async function queryDangerElementList(params) {
  return request(`${URL_PREFIX}/?${stringify(params)}`);
}

// 查看详情
export async function queryDangerElementDetail(params) {
  return request(`${URL_PREFIX}/?${stringify(params)}`);
}

// 同步数据
export async function queryDangerElementSync(params) {
  return request(`${URL_PREFIX}/?${stringify(params)}`);
}

// 删除
export async function queryDangerElementDel(params) {
  return request(`${URL_PREFIX}/?${stringify(params)}`);
}

// 安全风险分级管控清单

// 查看列表
export async function querySafeRiskList(params) {
  return request(`${URL_PREFIX}/?${stringify(params)}`);
}

// 查看详情
export async function querySafeRiskDetail(params) {
  return request(`${URL_PREFIX}/?${stringify(params)}`);
}

// 同步数据
export async function querySafeRiskSync(params) {
  return request(`${URL_PREFIX}/?${stringify(params)}`);
}

// 删除
export async function querySafeRiskDel(params) {
  return request(`${URL_PREFIX}/?${stringify(params)}`);
}
