import { stringify } from 'qs';
import request from '@/utils/request';

// 获取三同时审批列表
export async function fetchThreeSimultaneity (params) {
  return request(`/acloud_new/v2/ci/threeRegistration/threeRegistration/page?${stringify(params)}`)
}

// 新增三同时审批列表
export async function addThreeSimultaneity (body) {
  return request('/acloud_new/v2/ci/threeRegistration/threeRegistration', {
    method: 'POST',
    body,
  })
}

// 编辑三同时审批列表
export async function editThreeSimultaneity (body) {
  return request('/acloud_new/v2/ci/threeRegistration/threeRegistration', {
    method: 'PUT',
    body,
  })
}

// 删除三同时审批列表
export async function deleteThreeSimultaneity (params) {
  return request(`/acloud_new/v2/ci/threeRegistration/threeRegistration/${params.id}`, {
    method: 'DELETE',
  })
}
