import { stringify } from 'qs';
import request from '../utils/request';

/* 查询账号列表 */
export async function queryAccountList(params) {
  return request(`/acloud_new/v2/rolePermission/users?${stringify(params)}`);
}

/* 新增账号-初始化页面选项 */
export async function queryAddAccountOptions() {
  return request(`/acloud_new/v2/rolePermission/user/options`);
}

/* 查看账号详情 */
export async function queryAccountDetail({ id }) {
  return request(`/acloud_new/v2/rolePermission/user/${id}`);
}

/* 修改账号信息 */
export async function updateAccountDetail(params) {
  return request(`/acloud_new/v2/rolePermission/user`, {
    method: 'PUT',
    body: params,
  });
}

/* 新增账号 */
export async function addAccount(params) {
  return request(`/acloud_new/v2/rolePermission/user`, {
    method: 'POST',
    body: params,
  });
}

/* 新增账号-根据单位类型和名称模糊搜索单位 */
export async function queryUnits(params) {
  return request(`/acloud_new/v2/rolePermission/user/units?${stringify(params)}`);
}

/* 修改密码 */
export async function updatePassword(params) {
  return request(`/acloud_new/v2/rolePermission/user/pwd`, {
    method: 'POST',
    body: params,
  });
}

/* 查询用户名或手机号是否唯一 */
export function checkAccountOrPhone(params) {
  return request(`/acloud_new/v2/rolePermission/user/check?${stringify(params)}`);
}

/* 获取角色列表 */
export function queryRoles() {
  return request(`/acloud_new/v2/rolePermission/user/role`);
}
