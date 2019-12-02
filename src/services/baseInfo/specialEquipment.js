import { stringify } from 'qs';
import request from '../../utils/request';

/* 查询特种设备列表 */
export async function querySpecialEquipList(params) {
  return request(`/acloud_new/v2/ci/specialEquip/specialEquip/page?${stringify(params)}`);
}

/* 新建特种设备 */
export async function addSpecialEquip(params) {
  return request(`/acloud_new/v2/ci/specialEquip/specialEquip`, {
    method: 'POST',
    body: params,
  });
}

/* 修改特种设备 */
export async function updateSpecialEquip(params) {
  return request(`/acloud_new/v2/ci/specialEquip/specialEquip`, {
    method: 'PUT',
    body: params,
  });
}

export async function deleteSpecialEquip(params) {
  return request(`/acloud_new/v2/ci/specialEquip/specialEquip/${params.id}`, {
    method: 'DELETE',
  });
}
