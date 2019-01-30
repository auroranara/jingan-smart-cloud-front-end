import { stringify } from 'qs';
import request from '@/utils/request';

// 区域公司列表
export async function selectAreaCompanys(params) {
  return request(`/acloud_new/v2/areaInfo/selectAreaCompanys?${stringify(params)}`);
}

// 区域树
export async function getTree(params) {
  return request(`/acloud_new/v2/areaInfo/getTree?${stringify(params)}`);
}

// 区域列表
export async function areaInfoForPage(params) {
  return request(`/acloud_new/v2/areaInfo/areaInfoForPage?${stringify(params)}`);
}

// 新增区域
export async function addArea(params) {
  return request('acloud_new/v2/areaInfo/areaInfo', {
    method: 'POST',
    body: params,
  });
}

// 编辑区域
export async function editArea(params) {
  return request('/acloud_new/v2/areaInfo/areaInfo', {
    method: 'PUT',
    body: params,
  });
}

// 删除区域
export async function deleteArea({ id }) {
  return request(`/acloud_new/v2/areaInfo/areaInfo/${id}`, {
    method: 'DELETE',
  });
}
