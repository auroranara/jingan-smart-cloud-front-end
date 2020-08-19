import { stringify } from 'qs';
import request from '@/utils/request';

/* 列表 */
export async function getList(params) {
  return request(`/acloud_new/v2/workingBill/page?${stringify(params)}`);
}

/* 统计 */
export async function getCount(params) {
  return request(`/acloud_new/v2/workingBill/countGroupByType?${stringify(params)}`);
}

/* 详情 */
export async function getDetail({ id }) {
  return request(`/acloud_new/v2/workingBill/${id}`);
}

/* 新增 */
export async function add(body) {
  return request(`/acloud_new/v2/workingBill`, {
    method: 'POST',
    body,
  });
}

/* 编辑 */
export async function edit(body) {
  return request(`/acloud_new/v2/workingBill`, {
    method: 'PUT',
    body,
  });
}

/* 删除 */
export async function remove({ id }) {
  return request(`/acloud_new/v2/workingBill/${id}`, {
    method: 'DELETE',
  });
}

/* 审批 */
export async function approve(body) {
  return request(`/acloud_new/v2/workingBill/approve`, {
    method: 'PUT',
    body,
  });
}

/* 获取手写签名 */
export async function getSignature(params) {
  return request(`/acloud_new/v2/rolePermission/getSignature?${stringify(params)}`);
}

/* 获取地图数据 */
export async function getMap(params) {
  return request(`/acloud_new/v2/ThreedMap/threedMap?${stringify(params)}`);
}

/* 获取近半年统计 */
export async function getApproveCount(params) {
  return request(`/acloud_new/v2/workingBill/countApproveInfo?${stringify(params)}`);
}
