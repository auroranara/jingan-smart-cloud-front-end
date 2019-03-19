import request from '@/utils/cockpitRequest';
import { stringify } from 'qs';

// 获取传感器企业列表
export async function fetchSensorCompanies(params) {
  return request(`/acloud_new/v2/virtualDeviceInfo/getCompanyList?${stringify(params)}`)
}

// 获取企业下绑定的传感器列表
export async function fetchCompanyDevice(params) {
  return request(`/acloud_new/v2/virtualDeviceInfo/virtualDeviceList?${stringify(params)}`)
}

// 获取设备类型列表
export async function fetchDeviceTypes() {
  return request(`/acloud_new/v2/virtualDeviceInfo/options`)
}

// 设备关联传感器新增单位（同时新增设备）
export async function addSensorCompany(params) {
  return request('/acloud_new/v2/virtualDeviceInfo/virtualDeviceInfo', {
    method: 'POST',
    body: params,
  })
}

// 获取企业绑定的传感器列表
export async function fetchDeviceBindedSensor(params) {
  return request(`/acloud_new/v2/virtualDeviceInfo/selectRealDeviceList?${stringify(params)}`)
}

// 获取企业下传感器
export async function fetchCompanySensor(params) {
  return request(`/acloud_new/v2/virtualDeviceInfo/companyDevices?${stringify(params)}`)
}

// 获取传感器型号
export async function fetchSensorTypes(params) {
  return request(`/acloud_new/v2/virtualDeviceInfo/getModelDescs?${stringify(params)}`)
}

// 设备绑定传感器
export async function bindDeviceSensor(params) {
  return request(`/acloud_new/v2/virtualDeviceInfo/virtualDeviceInfo/bindDevice?${stringify(params)}`)
}

// 解绑传感器
export async function unbindDeviceSensor(params) {
  return request(`/acloud_new/v2/virtualDeviceInfo/unbindDevice?${stringify(params)}`)
}
