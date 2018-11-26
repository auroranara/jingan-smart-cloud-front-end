import { stringify } from 'qs';
import request from '../utils/request';

const URL_PREFIX = '/acloud_new/v2/rolePermission';

// 获取权限树
export async function getTree(params) {
  return request(`${URL_PREFIX}/sysPermission`);
}

// 获取权限列表
export async function getList(params) {
  return request(`${URL_PREFIX}/sysPermissions?${stringify(params)}`);
}

// 获取单个权限详情
export async function getOne(id) {
  return request(`${URL_PREFIX}/sysPermission/${id}`);
}

// 新增权限
export async function postAuth(params) {
  return request(`${URL_PREFIX}/sysPermission`, {
    method: 'POST',
    body: params,
  });
}

// 编辑权限
export async function putAuth(params) {
  return request(`${URL_PREFIX}/sysPermission`, {
    method: 'PUT',
    body: params,
  });
}
