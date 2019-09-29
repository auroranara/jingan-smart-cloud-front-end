import { stringify } from 'qs';
import request from '@/utils/request';

// 获取网关列表
export async function getList(params) {
  return request(`/acloud_new/v2/monitor/gatewayEquipmentForPage?${stringify(params)}`);
}

// 获取绑定设备列表
export async function getBindingList(params) {
  return request(`/acloud_new/v2/monitor/dataExecuteEquipmentForPage?${stringify(params)}`);
}

// 获取网关详情
export async function getDetail({ id }) {
  return request(`/acloud_new/v2/monitor/gatewayEquipment/${id}`);
}

// 获取网关设备类型
export async function getTypeList(params) {
  return request(`/acloud_new/v2/monitor/equipmentType?${stringify(params)}`);
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
export async function getBrandList(params) {
  return request(`/acloud_new/v2/monitor/equipmentBrand?${stringify(params)}`);
}

// 获取型号列表
export async function getModelList(params) {
  return request(`/acloud_new/v2/monitor/equipmentModel?${stringify(params)}`);
}

// 获取运营商列表
export async function getOperatorList() {
  return request(`/acloud_new/v2/monitor/operatorDict`);
}

// 获取建筑物列表
export async function getBuildingList(params) {
  return request(`/acloud_new/v2/buildingInfo/buildingList.json?${stringify(params)}`);
}

// 获取楼层列表
export async function getFloorList(params) {
  return request(`/acloud_new/v2/buildingInfo/floorList.json?${stringify(params)}`);
}

// 图片列表
export async function getPictureList(params) {
  return request(`/acloud_new/v2/pointManage/fixImgInfo?${stringify(params)}`);
}

// 新增网关
export async function add(params) {
  return request(`/acloud_new/v2/monitor/gatewayEquipment`, {
    method: 'POST',
    body: params,
  });
}

// 编辑网关
export async function edit(params) {
  return request(`/acloud_new/v2/monitor/gatewayEquipment`, {
    method: 'PUT',
    body: params,
  });
}

// 删除网关
export async function remove({ id }) {
  return request(`/acloud_new/v2/monitor/gatewayEquipment/${id}`, {
    method: 'DELETE',
  });
}
