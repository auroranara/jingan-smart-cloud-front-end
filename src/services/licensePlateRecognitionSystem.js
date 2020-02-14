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
