import { stringify } from 'qs';
import request from '@/utils/request';

/* 获取企业列表 */
export async function getCompanyList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/* 获取城市列表 */
export async function getCityList(params) {
  return request(`/acloud_new/v2/baseInfo/city/new?${stringify(params)}`);
}

/* 获取车辆企业列表 */
export async function getVehicleCompanyList(params) {
  return request(`/acloud_new/v2/carPlateRecognition/carCompany/page?${stringify(params)}`);
}

/* 获取企业车辆统计 */
export async function getCompanyVehicleCount(params) {
  return request(`/acloud_new/v2/carPlateRecognition/countCar?${stringify(params)}`);
}

/* 获取车辆列表 */
export async function getVehicleList(params) {
  return request(`/acloud_new/v2/carPlateRecognition/carCardInfo/page?${stringify(params)}`);
}

/* 获取车辆详情 */
export async function getVehicleDetail({ id }) {
  return request(`/acloud_new/v2/carPlateRecognition/carCardInfo/${id}`);
}

/* 新增车辆 */
export async function addVehicle(body) {
  return request(`/acloud_new/v2/carPlateRecognition/carCardInfo`, {
    method: 'POST',
    body,
  });
}

/* 编辑车辆 */
export async function editVehicle(body) {
  return request(`/acloud_new/v2/carPlateRecognition/carCardInfo`, {
    method: 'PUT',
    body,
  });
}

/* 删除车辆 */
export async function deleteVehicle({ id }) {
  return request(`/acloud_new/v2/carPlateRecognition/carCardInfo/${id}`, {
    method: 'DELETE',
  });
}

/* 获取车场企业列表 */
export async function getParkCompanyList(params) {
  return request(`/acloud_new/v2/carPlateRecognition/parkCompany/page?${stringify(params)}`);
}

/* 获取企业车场统计 */
export async function getCompanyParkCount(params) {
  return request(`/acloud_new/v2/carPlateRecognition/countPark?${stringify(params)}`);
}

/* 获取车场列表 */
export async function getParkList(params) {
  return request(`/acloud_new/v2/carPlateRecognition/parkInfo/page?${stringify(params)}`);
}

/* 获取车场详情 */
export async function getParkDetail({ id }) {
  return request(`/acloud_new/v2/carPlateRecognition/parkInfo/${id}`);
}

/* 获取车场id */
export async function getParkId() {
  return request(`/acloud_new/v2/carPlateRecognition/parkId`);
}

/* 新增车场 */
export async function addPark(body) {
  return request(`/acloud_new/v2/carPlateRecognition/parkInfo`, {
    method: 'POST',
    body,
  });
}

/* 编辑车场 */
export async function editPark(body) {
  return request(`/acloud_new/v2/carPlateRecognition/parkInfo`, {
    method: 'PUT',
    body,
  });
}

/* 删除车场 */
export async function deletePark({ id }) {
  return request(`/acloud_new/v2/carPlateRecognition/parkInfo/${id}`, {
    method: 'DELETE',
  });
}

/* 获取区域列表 */
export async function getAreaList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/* 获取通道企业列表 */
export async function getChannelCompanyList(params) {
  return request(`/acloud_new/v2/carPlateRecognition/gateCompany/page?${stringify(params)}`);
}

/* 获取企业通道统计 */
export async function getCompanyChannelCount(params) {
  return request(`/acloud_new/v2/carPlateRecognition/countGate?${stringify(params)}`);
}

/* 获取通道列表 */
export async function getChannelList(params) {
  return request(`/acloud_new/v2/carPlateRecognition/gateInfo/page?${stringify(params)}`);
}

/* 获取车场详情 */
export async function getChannelDetail({ id }) {
  return request(`/acloud_new/v2/carPlateRecognition/gateInfo/${id}`);
}

/* 新增车场 */
export async function addChannel(body) {
  return request(`/acloud_new/v2/carPlateRecognition/gateInfo`, {
    method: 'POST',
    body,
  });
}

/* 编辑车场 */
export async function editChannel(body) {
  return request(`/acloud_new/v2/carPlateRecognition/gateInfo`, {
    method: 'PUT',
    body,
  });
}

/* 删除车场 */
export async function deleteChannel({ id }) {
  return request(`/acloud_new/v2/carPlateRecognition/gateInfo/${id}`, {
    method: 'DELETE',
  });
}

/* 获取设备列表 */
export async function getDeviceList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/* 获取在场记录列表 */
export async function getPresenceRecordList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/* 导出在场记录列表 */
export async function exportPresenceRecordList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/* 获取异常抬杆记录列表 */
export async function getAbnormalRecordList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/* 导出异常抬杆记录列表 */
export async function exportAbnormalRecordList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/* 获取抬杆记录列表 */
export async function getLiftRecordList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}
