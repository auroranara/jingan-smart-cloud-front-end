import { stringify } from 'qs';
import request from '@/utils/request';

const URL_PREFIX = '/acloud_new'

// 获取生产场所列表
export async function fetchWorkSite (params) {
  return request(`${URL_PREFIX}/v2/ci/productPlace/hgProductPlaceForPage?${stringify(params)}`);
}

// 新增生产场所
export async function addWorkSite (body) {
  return request(`${URL_PREFIX}/v2/ci/productPlace/hgProductPlace`, {
    method: 'POST',
    body,
  })
}

// 编辑生产场所
export async function editWorkSite (body) {
  return request(`${URL_PREFIX}/v2/ci/productPlace/hgProductPlace`, {
    method: 'PUT',
    body,
  })
}

// 删除生产场所
export async function deleteWorkSite (params) {
  return request(`${URL_PREFIX}/v2/ci/productPlace/hgProductPlace/${params.id}`, {
    method: 'DELETE',
  })
}

// 获取生产场所详情
export async function fetchWorkSiteDetail (params) {
  return request(`${URL_PREFIX}/v2/ci/productPlace/hgProductPlace/${params.id}`);
}
