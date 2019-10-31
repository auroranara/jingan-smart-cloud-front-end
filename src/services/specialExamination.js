import { stringify } from 'qs';
import request from '@/utils/request';

// 获取列表
export async function getList(params) {
  return request(`/acloud_new/v2/getList?${stringify(params)}`);
}

// 获取详情
export async function getDetail(params) {
  return request(`/acloud_new/v2/getDetail?${stringify(params)}`);
}

// 新增
export async function add(params) {
  return request(`/acloud_new/v2/add`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function edit(params) {
  return request(`/acloud_new/v2/edit`, {
    method: 'PUT',
    body: params,
  });
}

// 删除
export async function remove(params) {
  return request(`/acloud_new/v2/remove`, {
    method: 'DELETE',
    body: params,
  });
}
