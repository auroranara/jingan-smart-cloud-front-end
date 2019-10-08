import request from '@/utils/request';
import { stringify } from 'qs';

// 获取传感器列表（新）
export async function fetchSensors(params) {
  return request(`/acloud_new/v2/monitor/sensorInfoForPage?${stringify(params)}`)
}

// 获取传感器详情
export async function fetchSensorDetail(params) {
  return request(`/acloud_new/v2/monitor/sensorInfo/${params.id}`)
}

// 添加传感器
export async function addSensor(body) {
  return request('/acloud_new/v2/monitor/sensorInfo', {
    method: 'POST',
    body,
  })
}

// 编辑传感器
export async function editSensor(body) {
  return request('/acloud_new/v2/monitor/sensorInfo', {
    method: 'PUT',
    body,
  })
}

// 删除传感器
export async function deleteSensor(params) {
  return request(`/acloud_new/v2/monitor/sensorInfo/${params.id}`, {
    method: 'DELETE',
  })
}

// 绑定传感器
export async function bindSensor(body) {
  return request('/acloud_new/v2/monitor/bindSensor', {
    method: 'PUT',
    body,
  })
}

// 解绑传感器
export async function unbindSensor(body) {
  return request('/acloud_new/v2/monitor/unbindSensor', {
    method: 'PUT',
    body,
  })
}
