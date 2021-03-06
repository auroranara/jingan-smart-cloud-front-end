import request from '@/utils/request';
import { stringify } from 'qs';

// 获取监测设备列表（分页）
export async function fetchMonitoringDevice (params) {
  return request(`/acloud_new/v2/monitor/monitorEquipment/page?${stringify(params)}`)
}

// 新增监测设备
export async function addMonitoringDevice (body) {
  return request('/acloud_new/v2/monitor/monitorEquipment', {
    method: 'POST',
    body,
  })
}

// 编辑监测设备
export async function editMonitoringDevice (body) {
  return request('/acloud_new/v2/monitor/monitorEquipment', {
    method: 'PUT',
    body,
  })
}

// 删除监测设备
export async function deleteMonitoringDevice (params) {
  return request(`/acloud_new/v2/monitor/monitorEquipment/${params.id}`, {
    method: 'DELETE',
  })
}

// 获取监测设备详情
export async function fetchMonitoringDeviceDetail (params) {
  return request(`/acloud_new/v2/monitor/monitorEquipment/${params.id}`)
}

// 绑定监测设备到监测对象
export async function bindMonitoringDevice (body) {
  return request('/acloud_new/v2/monitor/monitorEquipment/bind', {
    method: 'POST',
    body,
  })
}

// 绑定摄像头(动态监测NEW)
export async function bindVideoAndMonitorEquipment (params) {
  return request(`/acloud_new/v2/video/bind/bindVideoAndMonitorEquipment?${stringify(params)}`)
}

// 解绑摄像头(动态监测NEW)
export async function unbindVideoAndMonitorEquipment (params) {
  return request(`/acloud_new/v2/video/bind/unbindVideoAndMonitorEquipment?${stringify(params)}`)
}
