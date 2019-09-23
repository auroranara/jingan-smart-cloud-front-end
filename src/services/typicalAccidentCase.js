import { stringify } from 'qs';
import request from '../utils/request';

/** 典型事故案例 */

const URL_PREFIX = '/acloud_new/v2/typicalAccidentCase';

// 新增案例
export async function queryCaseAdd(params) {
  return request(`${URL_PREFIX}/typicalAccidentCase?${stringify(params)}`);
}
