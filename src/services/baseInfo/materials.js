import { stringify } from 'qs';
import request from '../../utils/request';

/* 查询物料列表 */
export async function queryMaterialsList (params) {
  return request(`/acloud_new/v2/materialInfo/list?${stringify(params)}`);
}

/* 新建物料 */
export async function addMaterials (params) {
  return request(`/acloud_new/v2/materialInfo/add`, {
    method: 'POST',
    body: params,
  });
}

/* 修改物料 */
export async function updateMaterials (params) {
  return request(`/acloud_new/v2/materialInfo/edit`, {
    method: 'PUT',
    body: params,
  });
}

/* 删除物料 */
export async function deleteMaterials ({ id }) {
  return request(`/acloud_new/v2/materialInfo/delete/${id}`, {
    method: 'DELETE',
  });
}

/* 查询重大危险源列表 */
export async function queryDangerSourceList (params) {
  return request(`/acloud_new/v2/dangerSource/list?${stringify(params)}`);
}

/* msds */
export async function queryMsdsList (params) {
  return request(`/acloud_new/v2/msds/msdsForPage?${stringify(params)}`);
}

// 根据CAS号获取信息
export async function fetchInfoByCas (params) {
  return request(`/acloud_new/v2/ci/materialInfo/materialChemicalInfo?${stringify(params)}`)
}
