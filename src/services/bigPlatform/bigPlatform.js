import request from '../../utils/request';
import { stringify } from 'qs';

// 获取平台名字
export async function getProjectName() {
  return request(`/acloud_new/v2/sfg/getProjectName.json`);
}

// 获取地图中心点
export async function getLocationCenter() {
  return request(`/acloud_new/v2/sfg/getLocationCenter.json`);
}

// 获取风险点总数
export async function getItemList(params) {
  return request(`/acloud_new/v2/sfg/report/itemList.json?${stringify(params)}`);
}

// 政府大屏风险统计
export async function getCountDangerLocation() {
  return request(`/acloud_new/v2/sfg/countDangerLocation.json`);
}

// 地图坐标
export async function getLocation() {
  return request(`/acloud_new/v2/sfg/location.json`);
}

// 大屏隐患点位等数据(1.0接口移入)
export async function getNewHomePage(params) {
  return request(`/acloud_new/v2/sfg/gov/newHomePage.json?${stringify(params)}`);
}

// 大屏隐患点位总数据(待检查已过期等)
export async function getListForMap() {
  return request(`/acloud_new/v2/sfg/listForMap.json`);
}

// 大屏隐患点位等数据(1.0接口移入)
export async function getInfoByLocation(params) {
  return request(`/acloud_new/v2/sfg/infoByLocation.json?${stringify(params)}`);
}