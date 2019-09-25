import { stringify } from 'qs';
import request from '../utils/request';

const URL_PREFIX = '/acloud_new/v2/msds';

// 获取说明书列表
export async function getTableList(params) {
  return request(`${URL_PREFIX}/msdsForPage?${stringify(params)}`);
}

// 查看说明书
export async function getItem(id) {
  return request(`${URL_PREFIX}/msds/${id}`);
}

// 添加说明书
export async function addItem(params) {
  return request(`${URL_PREFIX}/msds`, { method: 'POST', body: params });
}

// 编辑说明书
export async function editItem(params) {
  return request(`${URL_PREFIX}/msds/${params.id}`, { method: 'PUT', body: params });
}

// 删除说明书
export async function deleteItem(id) {
  return request(`${URL_PREFIX}/msds/${id}`, { method: 'DELETE' });
}
