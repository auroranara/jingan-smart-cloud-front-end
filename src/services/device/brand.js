import request from '@/utils/request';
import { stringify } from 'qs';

// 获取品牌列表（分页）
export async function fetchBrandsForPage(params) {
  return request(`/acloud_new/v2/monitor/equipmentBrandForPage?${stringify(params)}`)
}

// 新增品牌
export async function addBrand(body) {
  return request('/acloud_new/v2/monitor/equipmentBrand', {
    method: 'POST',
    body,
  })
}

// 编辑品牌
export async function editBrand(body) {
  return request('/acloud_new/v2/monitor/equipmentBrand', {
    method: 'PUT',
    body,
  })
}

// 删除品牌
export async function deleteBrand(params) {
  return request(`/acloud_new/v2/monitor/equipmentBrand/${params.id}`, {
    method: 'DELETE',
  })
}
