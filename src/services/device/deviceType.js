import request from '@/utils/request';
import { stringify } from 'qs';

// 获取设备类型列表（分页）
export async function fetchDeviceTypes(params) {
  return request(`/acloud_new/v2/monitor/equipmentTypeForPage?${stringify(params)}`)
}

// 设备类型-配置监测类型
export async function deployMonitoringType(body) {
  return request('/acloud_new/v2/monitor/equipmentType', {
    method: 'PUT',
    body,
  })
}
