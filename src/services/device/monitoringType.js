import request from '@/utils/request';
// import { stringify } from 'qs';

// 获取监测类型列表
export async function fetchMonitoringTypeTree() {
  return request('/acloud_new/v2/monitor/monitorTypeTree')
}

// 新增监测类型
export async function addMonitoringTypes(params) {
  return request('/acloud_new/v2/monitor/monitorType', {
    method: 'POST',
    body: params,
  })
}

// 编辑监测类型
export async function editMonitoringTypes(params) {
  return request('/acloud_new/v2/monitor/monitorType', {
    method: 'PUT',
    body: params,
  })
}

// 删除监测类型
export async function deleteMonitoringTypes(params) {
  return request(`/acloud_new/v2/monitor/monitorType/${params.id}`, {
    method: 'DELETE',
  })
}

// 获取监测类型列表
export async function fetchMonitoringTypes() {
  return request('/acloud_new/v2/monitor/monitorType')
}
