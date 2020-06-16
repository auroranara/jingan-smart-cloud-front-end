import { stringify } from 'qs';
import request from '@/utils/request';

/* 获取企业列表 */
export async function getCompanyList(params) {
  return request(`/acloud_new/v2/baseInfo/getCompanyByUser?${stringify(params)}`);
}

/* 获取作业票列表 */
export async function getList(params) {
  return request(`/acloud_new/v2/workingBill/page?${stringify(params)}`);
}

/* 获取统计 */
export async function getCount(params) {
  return request(`/acloud_new/v2/workingBill/countGroupByType?${stringify(params)}`);
}

/* 获取地图数据 */
export async function getMap(params) {
  return request(`/acloud_new/v2/ThreedMap/threedMap?${stringify(params)}`);
}

/* 获取作业票详情 */
export async function getDetail({ id }) {
  return request(`/acloud_new/v2/workingBill/${id}`);
}

/* 新增作业票 */
export async function add(body) {
  return request(`/acloud_new/v2/workingBill`, {
    method: 'POST',
    body,
  });
}

/* 编辑作业票 */
export async function edit(body) {
  return request(`/acloud_new/v2/workingBill`, {
    method: 'PUT',
    body,
  });
}

/* 删除作业票 */
export async function remove({ id }) {
  return request(`/acloud_new/v2/workingBill/${id}`, {
    method: 'DELETE',
  });
}

/* 审批作业票 */
export async function approve(body) {
  return request(`/acloud_new/v2/workingBill/approve`, {
    method: 'PUT',
    body,
  });
}
