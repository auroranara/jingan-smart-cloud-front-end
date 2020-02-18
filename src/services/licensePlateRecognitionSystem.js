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

/* 获取车辆列表 */
export async function getVehicleList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/* 获取车场列表 */
export async function getParkList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/* 获取区域列表 */
export async function getAreaList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/* 获取通道列表 */
export async function getChannelList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
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
