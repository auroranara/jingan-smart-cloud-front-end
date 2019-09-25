import { stringify } from 'qs';
import request from '@/utils/request';

// 获取网关列表
export async function getList(params) {
  return request(`/acloud_new/v2/transmission/companies?${stringify(params)}`);
}

// 获取绑定设备列表
export async function getBindingList(params) {
  return request(`/acloud_new/v2/transmission/companies?${stringify(params)}`);
}

// 获取网关详情
export async function getDetail(params) {
  return request(`/acloud_new/v2/transmission/companies?${stringify(params)}`);
}

// 获取网关设备类型
export async function getTypeList() {
  return request(`/acloud_new/v2/monitor/equipmentType?type=2`);
}

// 获取协议列表
export async function getProtocolList() {
  return request(`/acloud_new/v2/monitor/agreementTypeDict`);
}

// 获取联网方式列表
export async function getNetworkingList() {
  return request(`/acloud_new/v2/monitor/networkingTypeDict`);
}

// 获取品牌列表
export async function getBrandList() {
  return request(`/acloud_new/v2/monitor/equipmentBrand?type=2`);
}

// 获取型号列表
export async function getModelList(params) {
  return request(`/acloud_new/v2/monitor/equipmentModel?${stringify(params)}`);
}

// 获取型号列表
export async function getOperatorList() {
  return request(`/acloud_new/v2/monitor/operatorDict`);
}

// 新增网关
export async function add(params) {
  return request(`/acloud_new/v2/emergency/emergencyPlan`, {
    method: 'POST',
    body: params,
  });
}

// 编辑网关
export async function edit(params) {
  return request(`/acloud_new/v2/emergency/emergencyPlan`, {
    method: 'PUT',
    body: params,
  });
}

// 删除网关
export async function remove(params) {
  return request(`/acloud_new/v2/emergency/emergencyPlan`, {
    method: 'DELETE',
    body: params,
  });
}
