import { stringify } from 'qs';
import request from '../../utils/request';

/* 查询应急演练计划列表 */
export async function queryDrillList(params) {
  return request(`/acloud_new/v2/emergency/emergencyProjectForPage?${stringify(params)}`);
}

/* 新建应急演练计划 */
export async function addDrill(params) {
  return request(`/acloud_new/v2/emergency/emergencyProject`, {
    method: 'POST',
    body: params,
  });
}

/* 修改应急演练计划 */
export async function updateDrill(params) {
  return request(`/acloud_new/v2/emergency/emergencyProject`, {
    method: 'PUT',
    body: params,
  });
}

/* 应急演练计划详情 */
export async function drillDetail({ id }) {
  return request(`/acloud_new/v2/emergency/emergencyProject/${id}`);
}

export async function deleteDrill(params) {
  return request(`/acloud_new/v2/emergency/emergencyProject/${params.id}`, {
    method: 'DELETE',
  });
}
