import { stringify } from 'qs';
import request from '../../utils/request';

/* 查询应急装备列表 */
export async function queryEquipList(params) {
  return request(`/acloud_new/v2/emergency/emergencyEquipForPage?${stringify(params)}`);
}

/* 新建应急装备 */
export async function addEquip(params) {
  return request(`/acloud_new/v2/emergency/emergencyEquip`, {
    method: 'POST',
    body: params,
  });
}

/* 修改应急装备 */
export async function updateEquip(params) {
  return request(`/acloud_new/v2/emergency/emergencyEquip`, {
    method: 'PUT',
    body: params,
  });
}

/* 应急装备详情 */
export async function equipDetail({ id }) {
  return request(`/acloud_new/v2/emergency/emergencyEquip/${id}`);
}
