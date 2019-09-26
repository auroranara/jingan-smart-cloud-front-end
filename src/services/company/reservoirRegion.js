import { stringify } from 'qs';
import request from '../../utils/request';

// 获取库区列表
export async function queryAreaList(params) {
  return request(`/acloud_new/v2/warehouseArea/list?${stringify(params)}`);
}

// 获取数量
export async function queryCompanyNum(params) {
  return request(`/acloud_new/v2/warehouseArea/countCompanyNum?${stringify(params)}`);
}

// 新增库区
export async function queryAreaAdd(params) {
  return request(`/acloud_new/v2/warehouseArea/add`, {
    method: 'POST',
    body: params,
  });
}

// 编辑库区
export async function queryAreaEdit(params) {
  return request(`/acloud_new/v2/warehouseArea/edit`, {
    method: 'PUT',
    body: params,
  });
}

// 删除库区
export async function queryAreaDelete({ ids }) {
  return request(`/acloud_new/v2/warehouseArea/delete/${ids}`, {
    method: 'DELETE',
  });
}

// 获取危险源列表
export async function queryDangerSourceList(params) {
  return request(`/acloud_new/v2/dangerSource/list?${stringify(params)}`);
}

// 新增危险源
export async function queryDangerSourceaAdd(params) {
  return request(`/acloud_new/v2/dangerSource/add`, {
    method: 'POST',
    body: params,
  });
}

// 编辑危险源
export async function queryDangerSourceEdit(params) {
  return request(`/acloud_new/v2/dangerSource/edit`, {
    method: 'PUT',
    body: params,
  });
}

// 删除危险源
export async function queryDangerSourceDelete({ ids }) {
  return request(`/acloud_new/v2/dangerSource/delete/${ids}`, {
    method: 'DELETE',
  });
}

// 获取物料列表列表
export async function queryMaterialInfoList(params) {
  return request(`/acloud_new/v2/materialInfo/list?${stringify(params)}`);
}
