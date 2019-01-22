import { stringify } from 'qs';
import request from '@/utils/request';

// 获取标签列表
export async function fetchTagList(params) {
  return request(`/acloud_new/v2/accessCard/accessCardInfoForPage?${stringify(params)}`)
}

// 改变标签状态、领卡
export async function changeTag(params) {
  return request(`/acloud_new/v2/accessCard/editCardStatus?${stringify(params)}`)
}

// 获取未领卡人员
export async function fetchEmployees(params) {
  return request(`/acloud_new/v2/accessCard/employee/${params.companyId}`)
}

// 新增标签卡
export async function addTag(params) {
  return request('/acloud_new/v2/accessCard/accessCardInfo', {
    method: 'POST',
    body: params,
  })
}

// 编辑标签卡
export async function editTag(params) {
  return request('/acloud_new/v2/accessCard/accessCardInfo', {
    method: 'PUT',
    body: params,
  })
}
