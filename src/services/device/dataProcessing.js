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
