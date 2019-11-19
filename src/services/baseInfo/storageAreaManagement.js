import { stringify } from 'qs';
import request from '../../utils/request';

/* 查询储罐区列表 */
export async function queryTankAreaList(params) {
  return request(`/acloud_new/v2/ci/tankArea/tankArea/page?${stringify(params)}`);
}

/* 新建储罐区 */
export async function addTankArea(params) {
  return request(`/acloud_new/v2/ci/tankArea/tankArea`, {
    method: 'POST',
    body: params,
  });
}

/* 修改储罐区 */
export async function updateTankArea(params) {
  return request(`/acloud_new/v2/ci/tankArea/tankArea`, {
    method: 'PUT',
    body: params,
  });
}

// /* 储罐区详情 */
// export async function tankAreaDetail({ id }) {
//   return request(`/acloud_new/v2/emergency/emergencyProject/${id}`);
// }

export async function deleteTankArea(params) {
  return request(`/acloud_new/v2/ci/tankArea/tankArea/${params.id}`, {
    method: 'DELETE',
  });
}
