import { stringify } from 'qs';
import request from '../utils/request';

// 新增账号-初始化页面选项
export async function queryAddaccountoptions() {
  return request(`/acloud_new/v2/rolePermission/user/options.json`);
}

// 新增账号-根据所选单位类型查询单位列表
export async function queryUnitlist(params) {
  return request(`/acloud_new/v2/rolePermission/user/units.json?${stringify(params)}`);
}

/* 新增账号 */
export async function addAccount(params) {
  return request(`/acloud_new/v2/rolePermission/user`, {
    method: 'POST',
    body: params,
  });
}
