import { stringify } from 'qs';
import request from '../utils/request';

/** 典型事故案例 */

const URL_PREFIX = '/acloud_new/v2/typicalAccidentCase';

// 案例列表
export async function queryCaseList(params) {
  return request(`${URL_PREFIX}/typicalAccidentCaseForPage?${stringify(params)}`);
}

// 新增案例
export async function queryCaseAdd(params) {
  return request(`${URL_PREFIX}/typicalAccidentCase`, {
    method: 'POST',
    body: params,
  });
}

// 编辑案例
export async function queryCaseEdit(params) {
  return request(`${URL_PREFIX}/typicalAccidentCase`, {
    method: 'PUT',
    body: params,
  });
}

// 删除案例
export async function queryCaseDelete({ id }) {
  return request(`${URL_PREFIX}/typicalAccidentCase/${id}`, {
    method: 'DELETE',
  });
}
