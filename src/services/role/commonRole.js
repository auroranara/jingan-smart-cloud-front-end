import { stringify } from 'qs';
import request from '../../utils/request';

/* 获取角色详情 */
export async function queryDetail({ id }) {
  return request(`/acloud_new/v2/role/role/${id}`);
}

/* 添加角色 */
export async function addRole(params) {
  return request(`/acloud_new/v2/role/publicRole`, {
    method: 'POST',
    body: params,
  });
}

/* 修改角色 */
export async function editRole(params) {
  return request(`/acloud_new/v2/role/publicRole`, {
    method: 'PUT',
    body: params,
  })
}

/* 删除角色 */
export async function deleteRole({ id }) {
  return request(`/acloud_new/v2/role/role/${id}`, {
    method: 'DELETE',
  });
}

/* 获取单位类型对应的权限树 */
export async function queryPermissionTree(unitType) {
  return request(`/acloud_new/v2/role/getPermissionTree/${unitType}`);
}

/* 获取角色列表 */
export async function queryList(params) {
  return request(`/acloud_new/v2/role/roleForPage?${stringify(params)}`);
}

// 同步公共角色
export async function cloneRoles(params) {
  return request(`/acloud_new/v2/role/clonePublicRole?${stringify(params)}`);
}
