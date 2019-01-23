import { stringify } from 'qs';
import request from '@/utils/request';

// 获取建筑列表
export async function fetchBuildings(params) {
  return request(`/acloud_new/v2/buildingInfo/buildingList.json?${stringify(params)}`)
}

// 获取楼层列表
export async function fetchFloors(params) {
  return (`/acloud_new/v2/buildingInfo/floorList.json?${stringify(params)}`)
}

// 获取地图企业列表
export async function fetchMapCompanies(params) {
  return request(`/acloud_new/v2/companyMap/map/companies?${stringify(params)}`)
}

// 获取地图列表
export async function fetchMaps(params) {
  return request(`/acloud_new/v2/companyMap/mapForPage?${stringify(params)}`)
}
