import request from '@/utils/request';
import { stringify } from 'qs';

// 数据处理设备企业列表（分页）
export async function fetchCompaniesForPage(params) {
  return request(`/acloud_new/v2/monitor/monitorCompanyForPage?${stringify(params)}`)
}

// 新增数据处理设备类型
export async function addDeviceType(body) {
  return request('/acloud_new/v2/monitor/monitorCompany', {
    method: 'POST',
    body,
  })
}

// 编辑数据处理设备类型
export async function editDeviceType(body) {
  return request('/acloud_new/v2/monitor/monitorCompany', {
    method: 'PUT',
    body,
  })
}

// 获取数据处理设备企业详情
export async function fetchCompanyDetail(params) {
  return request(`/acloud_new/v2/monitor/monitorCompany/${params.id}`)
}

// 数据处理设备新增编辑--获取企业列表
export async function fetchCompanyiesForAdd(params) {
  return request(`/acloud_new/v2/monitor/noMonitorCompanyList?${stringify(params)}`)
}

// 获取--协议名称字典
export async function fetchAgreementNameDict() {
  return request('/acloud_new/v2/monitor/agreementTypeDict')
}

// 获取--联网方式字典
export async function fetchNetworkTypeDict() {
  return request('/acloud_new/v2/monitor/networkingTypeDict')
}

// 获取--运营商字典
export async function fetchOperatorDict() {
  return request('/acloud_new/v2/monitor/operatorDict')
}

// 获取--连接方式字典
export async function fetchConnectTypeDict() {
  return request('/acloud_new/v2/monitor/connectTypeDict')
}

// 获取网关设备列表
export async function fetchGatewayEquipmentForPage(params) {
  return request(`/acloud_new/v2/monitor/gatewayEquipmentForPage?${stringify(params)}`)
}

// 获取网关设备列表
export async function fetchGatewayEquipment(params) {
  return request(`/acloud_new/v2/monitor/gatewayEquipment?${stringify(params)}`)
}

// 新增数据处理设备
export async function addEquipment(body) {
  return request('/acloud_new/v2/monitor/dataExecuteEquipment', {
    method: 'POST',
    body,
  })
}

// 编辑数据处理设备
export async function editEquipment(body) {
  return request('/acloud_new/v2/monitor/dataExecuteEquipment', {
    method: 'PUT',
    body,
  })
}

// 获取数据处理设备列表（分页）
export async function fetchEquipmentsForPage(params) {
  return request(`/acloud_new/v2/monitor/dataExecuteEquipmentForPage?${stringify(params)}`)
}

// 获取处理设备详情
export async function fetchEquipmentDetail(params) {
  return request(`/acloud_new/v2/monitor/dataExecuteEquipment/${params.id}`)
}
