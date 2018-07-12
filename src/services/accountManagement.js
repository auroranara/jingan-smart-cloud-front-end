import { stringify } from 'qs';
import request from '../utils/request';

/* 查询账号列表 */
export async function queryAccountList(params) {
  return request(`/acloud_new/v2/rolePermission/users.json?${stringify(params)}`);
}

/* 新增账号-初始化页面选项 */
export async function queryAddAccountOptions() {
  return request(`/acloud_new/v2/rolePermission/user/options`);
}

/* 查看账号详情 */
export async function queryAccountDetail({ id }) {
  return request(`/acloud_new/v2/rolePermission/user/${id}.json`);
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
