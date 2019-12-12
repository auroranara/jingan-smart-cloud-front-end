import request from '@/utils/request';
import { stringify } from 'qs';

// 获取高危工艺流程列表
export async function fetchHighRiskProcessList (params) {
  return request(`/acloud_new/v2/ci/dangerTechnology/dangerTechnology/page?${stringify(params)}`)
}

// 新增高危工艺流程
export async function addHighRiskProcess (body) {
  return request('/acloud_new/v2/ci/dangerTechnology/dangerTechnology', {
    method: 'POST',
    body,
  })
}

// 编辑高危工艺流程
export async function editHighRiskProcess (body) {
  return request('/acloud_new/v2/ci/dangerTechnology/dangerTechnology', {
    method: 'PUT',
    body,
  })
}

// 删除高危工艺流程
export async function deleteHighRiskProcess (params) {
  return request(`/acloud_new/v2/ci/dangerTechnology/dangerTechnology/${params.id}`, {
    method: 'DELETE',
  })
}

// 获取高危工艺流程详情
export async function fetchHighRiskProcessDetail (params) {
  return request(`/acloud_new/v2/ci/dangerTechnology/dangerTechnology/${params.id}`)
}
