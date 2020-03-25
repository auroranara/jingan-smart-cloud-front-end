import { stringify } from 'qs';
import request from '@/utils/request';

// 获取生产区域列表
export async function fetchProductionArea (params) {
  return request(`/acloud_new/v2/ci/productArea/hgProductArea/page?${stringify(params)}`)
}

// 新增生产区域
export async function addProductionArea (body) {
  return request('/acloud_new/v2/ci/productArea/hgProductArea', {
    method: 'POST',
    body,
  })
}

// 编辑生产区域
export async function editProductionArea (body) {
  return request('/acloud_new/v2/ci/productArea/hgProductArea', {
    method: 'PUT',
    body,
  })
}

// 删除生产区域
export async function deleteProductionArea (params) {
  return request(`/acloud_new/v2/ci/productArea/hgProductArea/${params.id}`, {
    method: 'DELETE',
  })
}
