import { stringify } from 'qs';
import request from '../../utils/request';

/* 查询库房列表 */
export async function queryStorehouseList(params) {
  return request(`/acloud_new/v2/warehouse/list?${stringify(params)}`);
}

/* 新建库房 */
export async function addStorehouse(params) {
  return request(`/acloud_new/v2/warehouse/add`, {
    method: 'POST',
    body: params,
  });
}

/* 修改库房 */
export async function updateStorehouse(params) {
  return request(`/acloud_new/v2/warehouse/edit`, {
    method: 'PUT',
    body: params,
  });
}

/* 删除库房 */
export async function deleteStorehouse({ id }) {
  return request(`/acloud_new/v2/warehouse/delete/${id}`, {
    method: 'DELETE',
  });
}

// 单位数量
export async function queryCountCompanyNum(params) {
  return request(`/acloud_new/v2/warehouse/countCompanyNum?${stringify(params)}`);
}

/* 查询库区列表 */
export async function queryRegionList(params) {
  return request(`/acloud_new/v2/warehouseArea/list?${stringify(params)}`);
}

/* 查询重大危险源列表 */
export async function queryDangerSourceList(params) {
  return request(`/acloud_new/v2/dangerSource/list?${stringify(params)}`);
}
