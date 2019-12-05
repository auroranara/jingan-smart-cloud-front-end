import request from '@/utils/request';
import { stringify } from 'qs';

// 获取列表
export async function getList(params) {
  return request(`/acloud_new/v2/getList?${stringify(params)}`);
}

// 获取详情
export async function getDetail(params) {
  return request(`/acloud_new/v2/getDetail?${stringify(params)}`);
}
