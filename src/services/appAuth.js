import { stringify } from 'qs';
import request from '../utils/request';

const URL_PREFIX = '/acloud_new/v2/appPermission';

// 获取权限树
export async function getTree(params) {
  return request(`${URL_PREFIX}/appPermission?${stringify(params)}`);
}

// 获取权限列表
export async function getList(params) {
  return request(`${URL_PREFIX}/appPermissions?${stringify(params)}`);
}

// 新增权限
export async function postAuth(params) {
  return request(`${URL_PREFIX}/appPermission`, {
    method: 'POST',
    body: params,
  });
}

// 编辑权限
export async function putAuth(params) {
  return request(`${URL_PREFIX}/appPermission`, {
    method: 'PUT',
    body: params,
  });
}
