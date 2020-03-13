import { stringify } from 'qs';
import request from '@/utils/request';

// 关键装置重点部位-获取列表
export async function fetchKeyPartList (params) {
  return request(`/acloud_new/v2/ci/hgKeyFacility/hgKeyFacility/page?${stringify(params)}`)
}

// 关键装置重点部位-新增
export async function addKeyPart (body) {
  return request('/acloud_new/v2/ci/hgKeyFacility/hgKeyFacility', {
    method: 'POST',
    body,
  })
}

// 关键装置重点部位-编辑
export async function editKeyPart (body) {
  return request('/acloud_new/v2/ci/hgKeyFacility/hgKeyFacility', {
    method: 'PUT',
    body,
  })
}

// 关键装置重点部位-删除
export async function deleteKeyPart (params) {
  return request(`/acloud_new/v2/ci/hgKeyFacility/hgKeyFacility/${params.id}`, {
    method: 'DELETE',
  })
}
