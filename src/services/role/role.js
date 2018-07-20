import { stringify } from 'qs';
import request from '../../utils/request';

/* 获取角色详情 */
export async function queryDetail(params) {
  return request(`/acloud_new/v2/rolePermission/users.json?${stringify(params)}`);
}
