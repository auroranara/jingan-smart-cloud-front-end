import { stringify } from 'qs';
import request from '@/utils/request';

// 获取建筑物单位列表
export async function queryCompanyList(params) {
  return request(`/acloud_new/v2/buildingInfo/index.json?${stringify(params)}`);
}

/* 获取字典 */
export async function queryDict(params) {
  return request(`/acloud_new/v2/sys/dict/listOld?${stringify(params)}`);
}

// 获取建筑物列表
export async function queryBuildingsList(params) {
  return request(`/acloud_new/v2/buildingInfo/buildingList.json?${stringify(params)}`);
}

// 新增建筑物
export async function addBuildings(params) {
  return request('/acloud_new/v2/buildingInfo/addBuilding.json', {
    method: 'POST',
    body: params,
  });
}

// 编辑建筑物
export async function editBuildings(params) {
  return request('/acloud_new/v2/buildingInfo/updateBuilding.json', {
    method: 'PUT',
    body: params,
  });
}

// 删除建筑物
export async function deleteBuildings({ id }) {
  return request(`/acloud_new/v2/buildingInfo/updateBuilding.json/${id}`, {
    method: 'DELETE',
  });
}

// 获取楼层列表
export async function queryFloorList(params) {
  return request(`/acloud_new/v2/buildingInfo/floorList.json?${stringify(params)}`);
}

// 新增楼层
export async function addFloor(params) {
  return request('/acloud_new/v2/buildingInfo/addFloor.json', {
    method: 'POST',
    body: params,
  });
}

// 编辑建筑物
export async function editFloor(params) {
  return request('/acloud_new/v2/buildingInfo/updateFloor.json', {
    method: 'PUT',
    body: params,
  });
}

// 删除建筑物
export async function deleteFloor({ id }) {
  return request(`/acloud_new/v2/buildingInfo/delete.json/${id}`, {
    method: 'DELETE',
  });
}
