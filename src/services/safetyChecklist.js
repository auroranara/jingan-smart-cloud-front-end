import { stringify } from 'qs';
import request from '@/utils/request';

// 获取安全检查表-SCL分析列表
export async function fetchSafeChecklist (params) {
  return request(`/acloud_new/v2/safeCheck/safeCheck/page?${stringify(params)}`)
}

// 新增安全检查表
export async function addSafeChecklist (body) {
  return request('/acloud_new/v2/safeCheck/safeCheck', {
    method: 'POST',
    body,
  })
}

// 编辑安全检查表
export async function editSafeChecklist (body) {
  return request('/acloud_new/v2/safeCheck/safeCheck', {
    method: 'PUT',
    body,
  })
}

// 删除安全检查表
export async function deleteSafeChecklist (params) {
  return request(`/acloud_new/v2/safeCheck/safeCheck/${params.id}`, {
    method: 'DELETE',
  })
}

// 判断风险点是否存在
export async function judgeRiskPoint (params) {
  return request(`/acloud_new/v2/safeCheck/isExistRisk?${stringify(params)}`)
}

// 同步信息
export async function synchronize (params) {
  return request(`/acloud_new/v2/safeCheck/synchronyInfo?${stringify(params)}`)
}

// 复制
export async function copySafeChecklist (params) {
  return request(`/acloud_new/v2/safeCheck/copyInfo?${stringify(params)}`)
}

// 获取检查项目列表
export async function fetchRecordList (params) {
  return request(`/acloud_new/v2/safeCheck/checkProjectRecord/page?${stringify(params)}`);
}

// 新增检查项目
export async function addRecord (body) {
  return request('/acloud_new/v2/safeCheck/checkProjectRecord', {
    method: 'POST',
    body,
  })
}

// 编辑检查项目
export async function editRecord (body) {
  return request('/acloud_new/v2/safeCheck/checkProjectRecord', {
    method: 'PUT',
    body,
  })
}

// 删除检查项目
export async function deleteRecord (params) {
  return request(`/acloud_new/v2/safeCheck/checkProjectRecord/${params.id}`, {
    method: 'DELETE',
  })
}

// 获取检查项目详情
export async function fetchRecordDetail (params) {
  return request(`/acloud_new/v2/safeCheck/checkProjectRecord/${params.id}`)
}
