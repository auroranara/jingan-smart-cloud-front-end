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

export async function deleteEquip(params) {
  return request(`/acloud_new/v2/emergency/emergencyEquip/${params.id}`, {
    method: 'DELETE',
  });
}

/* 查询应急装备列表 */
export async function queryEquipCheckList(params) {
  return request(`/acloud_new/v2/emergency/emergencyEquipCheckForPage?${stringify(params)}`);
}

/* 新建应急装备 */
export async function addEquipCheck(params) {
  return request(`/acloud_new/v2/emergency/emergencyEquipCheck`, {
    method: 'POST',
    body: params,
  });
}

/* 修改应急装备 */
export async function updateEquipCheck(params) {
  return request(`/acloud_new/v2/emergency/emergencyEquipCheck`, {
    method: 'PUT',
    body: params,
  });
}

/* 应急装备详情 */
export async function equipDetailCheck({ id }) {
  return request(`/acloud_new/v2/emergency/emergencyEquipCheck/${id}`);
}

export async function deleteEquipCheck(params) {
  return request(`/acloud_new/v2/emergency/emergencyEquipCheck/${params.id}`, {
    method: 'DELETE',
  });
}

/* 查询应急装备列表 */
export async function queryEquipMaintList(params) {
  return request(`/acloud_new/v2/emergency/emergencyEquipMaintForPage?${stringify(params)}`);
}

/* 新建应急装备 */
export async function addEquipMaint(params) {
  return request(`/acloud_new/v2/emergency/emergencyEquipMaint`, {
    method: 'POST',
    body: params,
  });
}

/* 修改应急装备 */
export async function updateEquipMaint(params) {
  return request(`/acloud_new/v2/emergency/emergencyEquipMaint`, {
    method: 'PUT',
    body: params,
  });
}

/* 应急装备详情 */
export async function equipDetailMaint({ id }) {
  return request(`/acloud_new/v2/emergency/emergencyEquipMaint/${id}`);
}

export async function deleteEquipMaint(params) {
  return request(`/acloud_new/v2/emergency/emergencyEquipMaint/${params.id}`, {
    method: 'DELETE',
  });
}
