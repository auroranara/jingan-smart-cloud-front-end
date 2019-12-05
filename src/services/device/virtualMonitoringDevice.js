import request from '@/utils/request';
import { stringify } from 'qs';

// 获取虚拟监测设备列表（分页）
export async function fetchVirtualMonitoringDevice (params) {
  return request(`/acloud_new/v2/monitor/beMonitorTarget/page?${stringify(params)}`)
}

// 新增虚拟监测设备
export async function addVirtualMonitoringDevice (body) {
  return request('/acloud_new/v2/monitor/beMonitorTarget', {
    method: 'POST',
    body,
  })
}

// 编辑虚拟监测设备
export async function editVirtualMonitoringDevice (body) {
  return request('/acloud_new/v2/monitor/beMonitorTarget', {
    method: 'PUT',
    body,
  })
}

// 删除虚拟监测设备
export async function deleteVirtualMonitoringDevice (params) {
  return request(`/acloud_new/v2/monitor/beMonitorTarget/${params.id}`, {
    method: 'DELETE',
  })
}

// 获取虚拟监测设备详情
export async function fetchVirtualMonitoringDeviceDetail (params) {
  return request(`/acloud_new/v2/monitor/beMonitorTarget/${params.id}`)
}
