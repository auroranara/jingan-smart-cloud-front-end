import { stringify } from 'qs';
import request from '../utils/request';

const URL_PREFIX = '/acloud_new/v2/fireControl';

// 用户传输装置公司列表
export async function queryTransmissionDevice(params) {
  // return request(`/api/transmission_device_list?${stringify(params)}`);
  return request(`${URL_PREFIX}/transmission/companies.json?${stringify(params)}`);
}

// 用户传输装置公司详情
export async function queryTransmissionDeviceDetail(companyId) {
  // return request(`/api/transmission_device_detail?${stringify(params)}`);
  return request(`${URL_PREFIX}/company/${companyId}/transmissions.json`);
}

// 用户传输装置详情页请求企业详情
export async function queryCompanyDetail(companyId) {
  return request(`/acloud_new/v2/baseInfo/company/${companyId}.json`);
}

// 添加用户传输装置
export async function transmissionDeviceAdd({ companyId, data }) {
  return request(`${URL_PREFIX}/company/${companyId}/transmission`, {
    method: 'POST',
    body: { ...data, companyId },
  });
}

// 编辑用户传输装置
export async function transmissionDeviceUpdate({ companyId, transmissionId, data }) {
  return request(`${URL_PREFIX}/company/${companyId}/transmission/${transmissionId}`, {
    method: 'PUT',
    body: { ...data, companyId, id: transmissionId },
  });
}

// 删除用户传输装置
export async function transmissionDeviceDelete({ companyId, transmissionId }) {
  return request(`${URL_PREFIX}/company/${companyId}/transmission/${transmissionId}`, {
    method: 'DELETE',
  });
}

// 添加消防主机
export async function transmissionHostAdd({ companyId, transmissionId, data }) {
  return request(`${URL_PREFIX}/company/${companyId}/transmission/${transmissionId}/host`, {
    method: 'POST',
    body: { ...data, companyId, transmissionId },
  });
}

// 编辑消防主机
export async function transmissionHostUpdate({ companyId, transmissionId, hostId, data }) {
  return request(
    `${URL_PREFIX}/company/${companyId}/transmission/${transmissionId}/host/${hostId}`,
    { method: 'PUT', body: { ...data, companyId, deviceId: transmissionId, id: hostId } }
  );
}

// 删除消防主机
export async function transmissionHostDelete({ companyId, transmissionId, hostId }) {
  return request(
    `${URL_PREFIX}/company/${companyId}/transmission/${transmissionId}/host/${hostId}`,
    { method: 'DELETE' }
  );
}
