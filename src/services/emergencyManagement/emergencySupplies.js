import { stringify } from 'qs';
import request from '../../utils/request';

/* 查询应急装备列表 */
export async function querySuppliesList(params) {
  return request(`/acloud_new/v2/emergency/emergencyMaterialForPage?${stringify(params)}`);
}

/* 新建应急装备 */
export async function addSupplies(params) {
  return request(`/acloud_new/v2/emergency/emergencyMaterial`, {
    method: 'POST',
    body: params,
  });
}

/* 修改应急装备 */
export async function updateSupplies(params) {
  return request(`/acloud_new/v2/emergency/emergencyMaterial`, {
    method: 'PUT',
    body: params,
  });
}

/* 应急装备详情 */
export async function suppliesDetail({ id }) {
  return request(`/acloud_new/v2/emergency/emergencyMaterial/${id}`);
}

export async function deleteSupplies(params) {
  return request(`/acloud_new/v2/emergency/emergencyMaterial/${params.id}`, {
    method: 'DELETE',
  });
}

/* 查询应急装备列表 */
export async function queryMaterialCheckList(params) {
  return request(`/acloud_new/v2/emergency/emergencyMaterialCheckForPage?${stringify(params)}`);
}

/* 新建应急装备 */
export async function addMaterialCheck(params) {
  return request(`/acloud_new/v2/emergency/emergencyMaterialCheck`, {
    method: 'POST',
    body: params,
  });
}

/* 修改应急装备 */
export async function updateMaterialCheck(params) {
  return request(`/acloud_new/v2/emergency/emergencyMaterialCheck`, {
    method: 'PUT',
    body: params,
  });
}

/* 应急装备详情 */
export async function materialDetailCheck({ id }) {
  return request(`/acloud_new/v2/emergency/emergencyMaterialCheck/${id}`);
}

export async function deleteMaterialCheck(params) {
  return request(`/acloud_new/v2/emergency/emergencyMaterialCheck/${params.id}`, {
    method: 'DELETE',
  });
}

/* 查询应急装备列表 */
export async function queryMaterialMaintList(params) {
  return request(`/acloud_new/v2/emergency/emergencyMaterialMaintForPage?${stringify(params)}`);
}

/* 新建应急装备 */
export async function addMaterialMaint(params) {
  return request(`/acloud_new/v2/emergency/emergencyMaterialMaint`, {
    method: 'POST',
    body: params,
  });
}

/* 修改应急装备 */
export async function updateMaterialMaint(params) {
  return request(`/acloud_new/v2/emergency/emergencyMaterialMaint`, {
    method: 'PUT',
    body: params,
  });
}

/* 应急装备详情 */
export async function materialDetailMaint({ id }) {
  return request(`/acloud_new/v2/emergency/emergencyMaterialMaint/${id}`);
}

export async function deleteMaterialMaint(params) {
  return request(`/acloud_new/v2/emergency/emergencyMaterialMaint/${params.id}`, {
    method: 'DELETE',
  });
}
