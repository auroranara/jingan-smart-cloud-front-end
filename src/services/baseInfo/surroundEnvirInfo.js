import { stringify } from 'qs';
import request from '../../utils/request';

const URL_PREFIX = '/acloud_new/v2/surroundEnvironment';

/** 周边环境信息 */

// 列表
export async function queryEnvirInfoList(params) {
  return request(`${URL_PREFIX}/surroundEnvironment/page?${stringify(params)}`);
}

// 详情
export async function queryEnvirInfoDetail({ id }) {
  return request(`${URL_PREFIX}/surroundEnvironment/${id}`);
}

// 新增
export async function queryEnvirInfoAdd(params) {
  return request(`${URL_PREFIX}/surroundEnvironment`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function queryEnvirInfoEdit(params) {
  return request(`${URL_PREFIX}/surroundEnvironment`, {
    method: 'PUT',
    body: params,
  });
}

// 删除
export async function queryEnvirInfoDelete({ id }) {
  return request(`${URL_PREFIX}/surroundEnvironment/${id}`, {
    method: 'DELETE',
  });
}
