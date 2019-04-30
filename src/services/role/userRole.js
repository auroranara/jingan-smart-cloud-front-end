import { stringify } from 'qs';
import request from '../../utils/request';

/* 添加角色 */
export async function addRole(params) {
  return request(`/acloud_new/v2/role/customRole`, {
    method: 'POST',
    body: params,
  });
}

/* 修改角色 */
export async function editRole(params) {
  return request(`/acloud_new/v2/role/customRole`, {
    method: 'PUT',
    body: params,
  })
}

// 获取企业对应的权限树
export async function queryCompanyPermissionTree(companyId) {
  return request(`/acloud_new/v2/role/getCustomPermissionTree/${companyId}`);
}

/* 根据单位类型和名称模糊搜索单位 */
export async function getUnits(params) {
  return request(`/acloud_new/v2/rolePermission/user/units?${stringify(params)}`);
}
