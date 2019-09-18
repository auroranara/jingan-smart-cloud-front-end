import { stringify } from 'qs';
import request from '../../utils/request';

// 获取列表
export async function queryAreaList(params) {
  return request(`/acloud_new/v2/warehouseArea/list?${stringify(params)}`);
}

// 获取数量
export async function queryCompanyNum(params) {
  return request(`/acloud_new/v2/warehouseArea/countCompanyNum?${stringify(params)}`);
}

// 新增
export async function queryAreaAdd(params) {
  return request(`/acloud_new/v2/warehouseArea/add`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function queryAreaEdit(params) {
  return request(`/acloud_new/v2/warehouseArea/edit`, {
    method: 'PUT',
    body: params,
  });
}

// 删除
export async function queryAreaDelete({ ids }) {
  return request(`/acloud_new/v2/warehouseArea/delete/${ids}`, {
    method: 'DELETE',
  });
}
