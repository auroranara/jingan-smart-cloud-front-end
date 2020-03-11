import request from '@/utils/request';
import { stringify } from 'qs';

// 检查表维护-获取列表
export async function fetchCheckList (params) {
  return request(`/acloud_new/v2/ci/hgCheckList/hgCheckList/page?${stringify(params)}`)
}

// 检查表维护-新增
export async function addCheckList (body) {
  return request('/acloud_new/v2/ci/hgCheckList/hgCheckList', {
    method: 'POST',
    body,
  })
}

// 检查表维护-编辑
export async function editCheckList (body) {
  return request('/acloud_new/v2/ci/hgCheckList/hgCheckList', {
    method: 'PUT',
    body,
  })
}

// 检查表维护-删除
export async function deleteCheckList (params) {
  return request(`/acloud_new/v2/ci/hgCheckList/hgCheckList/${params.id}`, {
    method: 'DELETE',
  })
}

// 检查表维护-审核
export async function reviewCheckList (body) {
  return request('/acloud_new/v2/ci/hgCheckList/hgCheckList/approve', {
    method: 'POST',
    body,
  })
}

// 检查表维护-发布
export async function publishCheckList (params) {
  return request(`/acloud_new/v2/ci/hgCheckList/hgCheckList/publish?${stringify(params)}`)
}

// 操作规程-获取列表
export async function fetchOperatingProcedureList (params) {
  return request(`/acloud_new/v2/ci/hgOperatingInstruction/hgOperatingInstruction/page?${stringify(params)}`)
}

// 操作规程-新增
export async function addOperatingProcedure (body) {
  return request('/acloud_new/v2/ci/hgOperatingInstruction/hgOperatingInstruction', {
    method: 'POST',
    body,
  })
}

// 操作规程-编辑
export async function editOperatingProcedure (body) {
  return request('/acloud_new/v2/ci/hgOperatingInstruction/hgOperatingInstruction', {
    method: 'PUT',
    body,
  })
}

// 操作规程-删除
export async function deleteOperatingProcedure (params) {
  return request(`/acloud_new/v2/ci/hgOperatingInstruction/hgOperatingInstruction/${params.id}`, {
    method: 'DELETE',
  })
}

// 操作规程-发布
export async function publishOperatingProcedure (params) {
  return request(`/acloud_new/v2/ci/hgOperatingInstruction/hgOperatingInstruction/publish?${stringify(params)}`)
}

// 检查表维护-审核
export async function reviewOperatingProcedure (body) {
  return request('/acloud_new/v2/ci/hgOperatingInstruction/hgOperatingInstruction/approve', {
    method: 'POST',
    body,
  })
}
