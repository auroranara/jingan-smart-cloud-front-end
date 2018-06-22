import { stringify } from 'qs';
import request from '../utils/request';

// 用户传输装置公司列表
export async function queryTransmissionDevice(params) {
  // return request(`/api/transmission_device_list?${stringify(params)}`);
  return request(`/acloud_new/api/transmission/companies?${stringify(params)}`);
}

// 用户传输装置公司详情
export async function queryTransmissionDeviceDetail(companyId) {
  // return request(`/api/transmission_device_detail?${stringify(params)}`);
  return request(`/acloud_new/api/fireControl/company/${companyId}/transmissions.json`);
}
