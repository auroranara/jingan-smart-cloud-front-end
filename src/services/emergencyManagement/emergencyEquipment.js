import { stringify } from 'qs';
import request from '../../utils/request';

/* 查询应急装备列表 */
export async function queryList(params) {
  return request(`/acloud_new/v2/emergency/emergencyEquip?${stringify(params)}`);
}

/* 新建应急装备 */
export async function addEquip(params) {
  return request(`/acloud_new/v2/emergency/emergencyEquip`, {
    method: 'POST',
    body: params,
  });
}

/* 修改应急装备 */
export async function updateEquip({ id, ...restParams }) {
  return request(`/acloud_new/v2/emergency/emergencyEquip/${id}`, {
    method: 'PUT',
    body: restParams,
  });
}

/* 应急装备详情 */
export async function equipDetail(id) {
  return request(`/acloud_new/v2/emergency/emergencyEquip/${id}`);
}
