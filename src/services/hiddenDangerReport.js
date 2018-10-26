/**
 * 隐患排查报表
 */
import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 获取隐患列表
 */
export async function getHiddenDangerList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/**
 * 获取隐患详情
 */
export async function getHiddenDangerDetail(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}
