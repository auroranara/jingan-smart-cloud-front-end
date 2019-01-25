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
  const { companyId, ...others } = params
  return request(`/acloud_new/v2/accessCard/employee/${companyId}?${stringify(others)}`)
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

// 标签-选择企业时获取的企业列表
export async function fetchTagCompanies(params) {
  return request(`/acloud_new/v2/accessCard/accessCardInfo/companies?${stringify(params)}`)
}
