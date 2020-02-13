import request from '@/utils/request';
import { stringify } from 'qs';

// 获取列表
export async function getList(params) {
  return request(`/acloud_new/v2/reviewWarn/reviewWarn/page?${stringify(params)}`);
}

// 复评人列表 pageNum pageSize unitId
export async function getReevaluatorList(params) {
  return request(`/acloud_new/v2/rolePermission/users?${stringify(params)}`);
}

// 提交复评
export async function reevaluate(body) {
  return request('/acloud_new/v2/reviewWarn/reviewWarn', {
    method: 'PUT',
    body,
  });
}

// 获取历史记录
export async function getHistory(params) {
  return request(`/acloud_new/v2/reviewWarn/reviewHistory?${stringify(params)}`);
}
