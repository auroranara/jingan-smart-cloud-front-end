import { stringify } from 'qs';
import request from '@/utils/request';

/* 获取城市列表 */
export async function getCityList (params) {
  return request(`/acloud_new/v2/baseInfo/city/new?${stringify(params)}`);
}

/* 获取车辆企业列表 */
export async function getVehicleCompanyList (params) {
  return request(`/acloud_new/v2/carPlateRecognition/carCompanyNew/page?${stringify(params)}`);
}

/* 获取企业车辆统计 */
export async function getCompanyVehicleCount (params) {
  return request(`/acloud_new/v2/carPlateRecognition/countCarNew?${stringify(params)}`);
}

/* 获取车辆列表 */
export async function getVehicleList (params) {
  return request(`/acloud_new/v2/carPlateRecognition/car/page?${stringify(params)}`);
}

/* 获取车辆详情 */
export async function getVehicleDetail ({ id }) {
  return request(`/acloud_new/v2/carPlateRecognition/car/${id}`);
}

/* 获取通道授权树 */
export async function getChannelAuthorizationTree (params) {
  return request(`/acloud_new/v2/carPlateRecognition/parkInfo/list?${stringify(params)}`);
}

/* 新增车辆 */
export async function addVehicle (body) {
  return request(`/acloud_new/v2/carPlateRecognition/car`, {
    method: 'POST',
    body,
  });
}

/* 编辑车辆 */
export async function editVehicle (body) {
  return request(`/acloud_new/v2/carPlateRecognition/car`, {
    method: 'PUT',
    body,
  });
}

/* 删除车辆 */
export async function deleteVehicle ({ id }) {
  return request(`/acloud_new/v2/carPlateRecognition/car/${id}`, {
    method: 'DELETE',
  });
}

/* 获取车场企业列表 */
export async function getParkCompanyList (params) {
  return request(`/acloud_new/v2/carPlateRecognition/parkCompany/page?${stringify(params)}`);
}

/* 获取企业车场统计 */
export async function getCompanyParkCount (params) {
  return request(`/acloud_new/v2/carPlateRecognition/countPark?${stringify(params)}`);
}

/* 获取车场列表 */
export async function getParkList (params) {
  return request(`/acloud_new/v2/carPlateRecognition/parkInfo/page?${stringify(params)}`);
}

/* 获取车场详情 */
export async function getParkDetail ({ id }) {
  return request(`/acloud_new/v2/carPlateRecognition/parkInfo/${id}`);
}

/* 获取车场id */
export async function getParkId () {
  return request(`/acloud_new/v2/carPlateRecognition/parkId`);
}

/* 新增车场 */
export async function addPark (body) {
  return request(`/acloud_new/v2/carPlateRecognition/parkInfo`, {
    method: 'POST',
    body,
  });
}

/* 编辑车场 */
export async function editPark (body) {
  return request(`/acloud_new/v2/carPlateRecognition/parkInfo`, {
    method: 'PUT',
    body,
  });
}

/* 删除车场 */
export async function deletePark ({ id }) {
  return request(`/acloud_new/v2/carPlateRecognition/parkInfo/${id}`, {
    method: 'DELETE',
  });
}

/* 获取区域列表 */
export async function getAreaList (params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/* 获取通道企业列表 */
export async function getChannelCompanyList (params) {
  return request(`/acloud_new/v2/carPlateRecognition/gateCompany/page?${stringify(params)}`);
}

/* 获取企业通道统计 */
export async function getCompanyChannelCount (params) {
  return request(`/acloud_new/v2/carPlateRecognition/countGate?${stringify(params)}`);
}

/* 获取通道列表 */
export async function getChannelList (params) {
  return request(`/acloud_new/v2/carPlateRecognition/gateInfo/page?${stringify(params)}`);
}

/* 获取车场详情 */
export async function getChannelDetail ({ id }) {
  return request(`/acloud_new/v2/carPlateRecognition/gateInfo/${id}`);
}

/* 新增车场 */
export async function addChannel (body) {
  return request(`/acloud_new/v2/carPlateRecognition/gateInfo`, {
    method: 'POST',
    body,
  });
}

/* 编辑车场 */
export async function editChannel (body) {
  return request(`/acloud_new/v2/carPlateRecognition/gateInfo`, {
    method: 'PUT',
    body,
  });
}

/* 删除车场 */
export async function deleteChannel ({ id }) {
  return request(`/acloud_new/v2/carPlateRecognition/gateInfo/${id}`, {
    method: 'DELETE',
  });
}

/* 获取设备列表 */
export async function getDeviceList (params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/* 获取在场记录列表 */
export async function getPresenceRecordList (params) {
  return request(`/acloud_new/v2/carPlateRecognition/order/page?${stringify(params)}`);
}

/* 导出在场记录列表 */
export async function exportPresenceRecordList (params) {
  return request(`/acloud_new/v2/carPlateRecognition/exportOrder?${stringify(params)}`);
}

/* 获取异常抬杆记录列表 */
export async function getAbnormalRecordList (params) {
  return request(`/acloud_new/v2/carPlateRecognition/openStrobeRecord/page?${stringify(params)}`);
}

/* 导出异常抬杆记录列表 */
export async function exportAbnormalRecordList (params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/* 获取抬杆记录列表 */
export async function getLiftRecordList (params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/* 获取单位运输公司列表 */
export async function getTransportCompanyCompanyList (params) {
  return request(
    `/acloud_new/v2/carPlateRecognition/transitCompanyCompany/page?${stringify(params)}`
  );
}

/* 获取运输公司列表 */
export async function getTransportCompanyList (params) {
  return request(`/acloud_new/v2/carPlateRecognition/transitCompany/page?${stringify(params)}`);
}

/* 获取运输公司详情 */
export async function getTransportCompanyDetail ({ id }) {
  return request(`/acloud_new/v2/carPlateRecognition/transitCompany/${id}`);
}

/* 新增运输公司 */
export async function addTransportCompany (body) {
  return request(`/acloud_new/v2/carPlateRecognition/transitCompany`, {
    method: 'POST',
    body,
  });
}

/* 编辑运输公司 */
export async function editTransportCompany (body) {
  return request(`/acloud_new/v2/carPlateRecognition/transitCompany`, {
    method: 'PUT',
    body,
  });
}

/* 删除运输公司 */
export async function deleteTransportCompany ({ id }) {
  return request(`/acloud_new/v2/carPlateRecognition/transitCompany/${id}`, {
    method: 'DELETE',
  });
}

/* 获取单位电子运单列表 */
export async function getElectronicWaybillCompanyList (params) {
  return request(`/acloud_new/v2/carPlateRecognition/waybillCompany/page?${stringify(params)}`);
}

/* 获取电子运单列表 */
export async function getElectronicWaybillList (params) {
  return request(`/acloud_new/v2/carPlateRecognition/waybillInfo/page?${stringify(params)}`);
}

/* 获取电子运单详情 */
export async function getElectronicWaybillDetail ({ id }) {
  return request(`/acloud_new/v2/carPlateRecognition/waybillInfo/${id}`);
}

/* 新增电子运单 */
export async function addElectronicWaybill (body) {
  return request(`/acloud_new/v2/carPlateRecognition/waybillInfo`, {
    method: 'POST',
    body,
  });
}

/* 编辑电子运单 */
export async function editElectronicWaybill (body) {
  return request(`/acloud_new/v2/carPlateRecognition/waybillInfo`, {
    method: 'PUT',
    body,
  });
}

/* 删除电子运单 */
export async function deleteElectronicWaybill ({ id }) {
  return request(`/acloud_new/v2/carPlateRecognition/waybillInfo/${id}`, {
    method: 'DELETE',
  });
}

/* 测试数据库连接 */
export async function testLink (params) {
  return request(`/acloud_new/v2/carPlateRecognition/testDbConnect?${stringify(params)}`);
}
