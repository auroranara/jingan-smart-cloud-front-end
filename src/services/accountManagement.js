import { stringify } from 'qs';
import request from '../utils/request';

// 新增账号-初始化页面选项
export async function queryAddaccountoptions(params) {
  return request(`/acloud_new/v2/rolePermission/user/options.json?${stringify(params)}`);
}
