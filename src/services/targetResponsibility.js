import { stringify } from 'qs';
import request from '../utils/request';

/** 两单信息 */

const URL_PREFIX = '/acloud_new/v2/ci';

// 列表
export async function queryIndexManageList(params) {
  return request(`${URL_PREFIX}/goalDutyManage/safeProductGoalManage/page?${stringify(params)}`);
}

// 新增
export async function querIndexManageAdd(params) {
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
