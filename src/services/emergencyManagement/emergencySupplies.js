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
