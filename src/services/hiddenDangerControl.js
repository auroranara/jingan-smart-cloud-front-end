import { stringify } from 'qs';
import request from '@/utils/request';

// 获取隐患标准管理数据库列表（分页）
export async function fetchHiddenDangerStandardList (params) {
  return request(`/acloud_new/v2/ci/hiddenDangerDataBase/checkObjectInfo/page?${stringify(params)}`)
}

// 新增隐患标准管理数据库
export async function addHiddenDangerStandard (body) {
  return request('/acloud_new/v2/ci/hiddenDangerDataBase/checkObjectInfo', {
    method: 'POST',
    body,
  })
}

// 编辑隐患标准管理数据库
export async function editHiddenDangerStandard (body) {
  return request('/acloud_new/v2/ci/hiddenDangerDataBase/checkObjectInfo', {
    method: 'PUT',
    body,
  })
}

// 删除隐患标准管理数据库
export async function deleteHiddenDangerStandard (params) {
  return request(`/acloud_new/v2/ci/hiddenDangerDataBase/checkObjectInfo/${params.id}`, {
    method: 'DELETE',
  })
}

// 获取隐患流程列表
export async function fetchStandardProcessList (params) {
  return request(`/acloud_new/v2/ci/hiddenDangerDataBase/checkItemFlow/page?${stringify(params)}`)
}

// 新增取隐患流程
export async function addStandardProcess (body) {
  return request('/acloud_new/v2/ci/hiddenDangerDataBase/checkItemFlow', {
    method: 'POST',
    body,
  })
}

// 编辑取隐患流程
export async function editStandardProcess (body) {
  return request('/acloud_new/v2/ci/hiddenDangerDataBase/checkItemFlow', {
    method: 'PUT',
    body,
  })
}

// 删除取隐患流程
export async function deleteStandardProcess (params) {
  return request(`/acloud_new/v2/ci/hiddenDangerDataBase/checkItemFlow/${params.id}`, {
    method: 'DELETE',
  })
}
