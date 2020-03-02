import request from '@/utils/cockpitRequest';
import { stringify } from 'qs';

// 获取企业列表
export async function fetchCompanyList (params) {
  return request(`/acloud_new/v2/ci/HGFace/hgFaceInfoByAdmin/page?${stringify(params)}`)
}

// 获取人员列表
export async function fetchPersonList (params) {
  return request(`/acloud_new/v2/ci/HGFace/hgFaceInfo/page?${stringify(params)}`)
}

// 新增人员
export async function addPerson (body) {
  return request('/acloud_new/v2/ci/HGFace/hgFaceInfo', {
    method: 'POST',
    body,
  })
}

// 编辑人员
export async function editPerson (body) {
  return request('/acloud_new/v2/ci/HGFace/hgFaceInfo', {
    method: 'PUT',
    body,
  })
}

// 删除人员
export async function deletePerson (params) {
  return request(`/acloud_new/v2/ci/HGFace/hgFaceInfo/${params.id}`, {
    method: 'DELETE',
  })
}

// 批量授权人员（多人员）
export async function authorizationPerson (body) {
  return request('/acloud_new/v2/ci/HGFace/Authorization/hgAuthorizationManageAll', {
    method: 'PUT',
    body,
  })
}

// 获取授权列表
export async function fetchAuthorizationList (params) {
  return request(`/acloud_new/v2/ci/HGFace/hgAuthorizationInfoForPage?${stringify(params)}`)
}

// 全部销权
export async function deleteAllAuthorization (params) {
  return request(`/acloud_new/v2/ci/HGFace/Authorization/deleteAllAuthorization?${stringify(params)}`, {
    method: 'DELETE',
  })
}

// 销权
export async function deleteAuthorization (params) {
  return request(`/acloud_new/v2/ci/HGFace/Authorization/unAuthorization?${stringify(params)}`, {
    method: 'DELETE',
  })
}

// 获取识别记录列表
export async function fetchIdentificationRecord (params) {
  return request(`/acloud_new/v2/ci/HGFace/History/hgRecognitionHistory/page?${stringify(params)}`)
}
