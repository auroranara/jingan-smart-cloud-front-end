import { stringify } from 'qs';
import request from '../utils/request';

/** 两单信息 */

const URL_PREFIX = '/acloud_new/v2/ci/doubleBill';

// 危险（有害）因素排查辨识清单

// 查看列表
export async function queryDangerElementList (params) {
  return request(`${URL_PREFIX}/dangerCheck/page?${stringify(params)}`);
}

// 同步数据
export async function queryDangerElementSync (params) {
  return request(`${URL_PREFIX}/dangerCheck/sync?${stringify(params)}`);
}

// 删除
export async function queryDangerElementDel ({ areaId }) {
  return request(`${URL_PREFIX}/dangerCheck/${areaId}`, { method: 'DELETE' });
}

// 绑定区域
export async function queryBindDangerCheck (params) {
  return request(`${URL_PREFIX_EXTRA}/bindDangerCheck`, {
    method: 'PUT',
    body: params,
  });
}

// 导出
export async function queryDangerExport (params) {
  return request(`${URL_PREFIX}/exportDangerCheck?${stringify(params)}`);
}

// 安全风险分级管控清单

// 查看列表
export async function querySafeRiskList (params) {
  return request(`${URL_PREFIX}/safetyControl/page?${stringify(params)}`);
}

// 同步数据
export async function querySafeRiskSync (params) {
  return request(`${URL_PREFIX}/safetyControl/sync?${stringify(params)}`);
}

// 删除
export async function querySafeRiskDel ({ areaId }) {
  return request(`${URL_PREFIX}/safetyControl/${areaId}`, { method: 'DELETE' });
}

// 绑定区域
export async function queryBindSafetyControl (params) {
  return request(`${URL_PREFIX_EXTRA}/bindSafetyControl`, {
    method: 'PUT',
    body: params,
  });
}

// 导出
export async function querySafetyExport (params) {
  return request(`${URL_PREFIX}/exportSafetyControl?${stringify(params)}`);
}

/** 公告管理 */

const URL_PREFIX_EXTRA = '/acloud_new/v2/notice';

// 安全承诺公告

// 列表
export async function querySafetyPromiseList (params) {
  return request(`${URL_PREFIX_EXTRA}/companyPublicForPage?${stringify(params)}`);
}

// 新增
export async function querSafetyPromiseAdd (params) {
  return request(`${URL_PREFIX_EXTRA}/companyPublic`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function querySafetyPromiseEdit (params) {
  return request(`${URL_PREFIX_EXTRA}/companyPublic`, {
    method: 'PUT',
    body: params,
  });
}

// 删除
export async function querySafetyPromiseDelete ({ id }) {
  return request(`${URL_PREFIX_EXTRA}/companyPublic/${id}`, {
    method: 'DELETE',
  });
}

// 获取安全风险分级管控清单列表
export async function fetchSafetyListNew (params) {
  return request(`${URL_PREFIX}/safetyControl/page2?${stringify(params)}`)
}

// 编辑负责人
export async function editPrincipal (body) {
  return request(`${URL_PREFIX}/safetyControl`, {
    method: 'PUT',
    body,
  })
}

// 获取区域列表
export async function fetchAreaList (params) {
  return request(`/acloud_new/v2/riskArea/riskArea/page?${stringify(params)}`)
}
