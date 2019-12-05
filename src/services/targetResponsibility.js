import { stringify } from 'qs';
import request from '../utils/request';

const URL_PREFIX = '/acloud_new/v2/ci';

/** 安全生产指标管理 */

// 列表
export async function queryIndexManageList(params) {
  return request(`${URL_PREFIX}/goalDutyManage/safeProductGoalManage/page?${stringify(params)}`);
}

// 新增
export async function queryIndexManageAdd(params) {
  return request(`${URL_PREFIX}/goalDutyManage/safeProductGoalManage`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function queryIndexManageEdit(params) {
  return request(`${URL_PREFIX}/goalDutyManage/safeProductGoalManage`, {
    method: 'PUT',
    body: params,
  });
}

// 删除
export async function queryIndexManageDelete({ id }) {
  return request(`${URL_PREFIX}/goalDutyManage/safeProductGoalManage/${id}`, {
    method: 'DELETE',
  });
}

/** 目标责任制定实施 */

// 列表
export async function queryTargetSettingList(params) {
  return request(`${URL_PREFIX}/goalDutyManage/goalDutyDesign/page?${stringify(params)}`);
}

// 新增
export async function queryTargetSettingAdd(params) {
  return request(`${URL_PREFIX}/goalDutyManage/goalDutyDesign`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function queryTargetSettingEdit(params) {
  return request(`${URL_PREFIX}/goalDutyManage/goalDutyDesign`, {
    method: 'PUT',
    body: params,
  });
}

// 删除
export async function queryTargetSettingDelete({ id }) {
  return request(`${URL_PREFIX}/goalDutyManage/goalDutyDesign/${id}`, {
    method: 'DELETE',
  });
}
