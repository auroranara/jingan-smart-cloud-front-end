import { stringify } from 'qs';
import request from '@/utils/request';

// 获取建筑列表
export async function fetchBuildings(params) {
  return request(`/acloud_new/v2/buildingInfo/buildingList.json?${stringify(params)}`)
}

// 获取楼层列表
export async function fetchFloors(params) {
  return request(`/acloud_new/v2/buildingInfo/floorList.json?${stringify(params)}`)
}

// 获取地图企业列表
export async function fetchMapCompanies(params) {
  return request(`/acloud_new/v2/companyMap/map/companies?${stringify(params)}`)
}

// 获取地图列表
export async function fetchMaps(params) {
  return request(`/acloud_new/v2/companyMap/mapForPage?${stringify(params)}`)
}

// 新增地图
export async function addMap(params) {
  return request(`/acloud_new/v2/companyMap/map`, {
    method: 'POST',
    body: params,
  })
}

// 编辑地图
export async function editMap(params) {
  return request(`/acloud_new/v2/companyMap/map`, {
    method: 'PUT',
    body: params,
  })
}

// 选择地图时获取地图列表
export async function fetchMapForSelect(params) {
  return request(`/acloud_new/v2/companyMap/getMapUrl?${stringify(params)}`)
}

// 获取地图详情
export async function fetchMapDetail(params) {
  return request(`/acloud_new/v2/companyMap/map/${params.companyMap}`)
}

// 删除地图
export async function deleteMap(params) {
  return request(`/acloud_new/v2/companyMap/map/${params.id}`, {
    method: 'DELETE',
  })
}
