import { stringify } from 'qs';
import request from '@/utils/request';

const URL_PREFIX = '/acloud_new/v2/riskFlags/warningSignInfo';

// 获取列表
export async function getTableList(params) {
  return request(`${URL_PREFIX}/page?${stringify(params)}`);
}

// 查看
export async function get(id) {
  return request(`${URL_PREFIX}/${id}`);
}

// 添加
export async function post(params) {
  return request(`${URL_PREFIX}`, { method: 'POST', body: params });
}

// 编辑
export async function put(params) {
  return request(`${URL_PREFIX}`, { method: 'PUT', body: params });
}

// 删除
export async function del(id) {
  return request(`${URL_PREFIX}/${id}`, { method: 'DELETE' });
}
