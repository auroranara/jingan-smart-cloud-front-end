import { stringify } from 'qs';
import request from '../../utils/request';

/* 获取角色详情 */
export async function queryDetail({ id }) {
  return request(`/acloud_new/v2/rolePermission/sysRole/${id}`);
}

// 在账号菜单中(非当前的角色菜单)获取roles对应的权限
export async function queryRolePermissions({ id, ...rest }) {
  return request(`/acloud_new/v2/rolePermission/sysRole2/${id}?${stringify(rest)}`);
}

/* 添加角色 */
export async function addRole(params) {
  return request(`/acloud_new/v2/rolePermission/sysRole`, {
    method: 'POST',
    body: params,
  });
}

/* 修改角色 */
export async function editRole(params) {
  return request(`/acloud_new/v2/rolePermission/sysRole`, {
    method: 'PUT',
    body: params,
  })
}

/* 删除角色 */
export async function deleteRole({ id }) {
  return request(`/acloud_new/v2/rolePermission/sysRole/${id}`, {
    method: 'DELETE',
  })
}

/* 获取WEB权限树 */
export async function queryPermissionTree() {
  return request('/acloud_new/v2/rolePermission/sysPermission');
}

// 获取APP权限树
export async function getAppPermissionTree(params) {
  return request(`/acloud_new/v2/appPermission/appPermission?${stringify(params)}`)
}

/* 获取角色列表 */
export async function queryList(params) {
  return request(`/acloud_new/v2/rolePermission/sysRole?${stringify(params)}`);
}
