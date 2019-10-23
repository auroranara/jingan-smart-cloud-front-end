import { stringify } from 'qs';
import request from '../../utils/request';

/* 查询应急演练评估列表 */
export async function queryEstimateList(params) {
  return request(`/acloud_new/v2/emergencyDrill/emergencyDrillForPage?${stringify(params)}`);
}

/* 新建应急演练评估 */
export async function addEstimate(params) {
  return request(`/acloud_new/v2/emergencyDrill/emergencyDrill`, {
    method: 'POST',
    body: params,
  });
}

/* 修改应急演练评估 */
export async function updateEstimate(params) {
  return request(`/acloud_new/v2/emergencyDrill/emergencyDrill`, {
    method: 'PUT',
    body: params,
  });
}

/* 应急演练评估详情 */
export async function estimateDetail({ id }) {
  return request(`/acloud_new/v2/emergencyDrill/emergencyDrill/${id}`);
}

/* 删除应急演练评估 */
export async function deleteEstimate(params) {
  return request(`/acloud_new/v2/emergencyDrill/emergencyDrill`, {
    method: 'DELETE',
    body: params,
  });
}
