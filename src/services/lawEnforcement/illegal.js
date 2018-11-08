import { stringify } from 'qs';
import request from '../../utils/request';

/* 违法行为库  */

// 列表
export async function queryIllegalList(params) {
  return request(`/acloud_new/v2/actInfo/actInfoForPage?${stringify(params)}`);
}

// 获得所属类别
export async function queryIllegalType(params) {
  return request(`/acloud_new/v2/actInfo/typeCode?${stringify(params)}`);
}

// 获得检查内容
export async function queryDtoLIst() {
  return request(`/acloud_new/v2/actInfo/dtoList.json`);
}

// 新增
export async function addIllegal(params) {
  return request(`/acloud_new/v2/actInfo/actInfo`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function updateIllegal(params) {
  return request(`/acloud_new/v2/actInfo/editActInfo`, {
    method: 'PUT',
    body: params,
  });
}

// 删除
export async function deleteIllegal(id) {
  return request(`/acloud_new/v2/actInfo/deleteActInfo/${id}`, {
    method: 'DELETE',
  });
}
