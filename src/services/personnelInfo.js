import request from '../utils/request';
import { stringify } from 'qs';

/** 人员在岗在位管理 */

//获取人员信息企业列表
export async function queryPersonCompanyList(params) {
  return request(`/acloud_new/v2/personInfo/companyList?${stringify(params)}`);
}

// 人员基本信息列表
export async function queryPersonInfoList(params) {
  return request(`/acloud_new/v2/personInfo/list?${stringify(params)}`);
}

// 新增人员基本信息
export async function queryPersonInfoAdd(params) {
  return request('/acloud_new/v2/personInfo/add', {
    method: 'POST',
    body: params,
  });
}

// 编辑人员基本信息
export async function queryPersonInfoEdit(params) {
  return request('/acloud_new/v2/personInfo/edit', {
    method: 'PUT',
    body: params,
  });
}

// 删除人员基本信息
export async function queryPersonInfoDelete({ ids }) {
  return request(`/acloud_new/v2/personInfo/delete/${ids}`, {
    method: 'DELETE',
  });
}

// -------------------------------------------------------------

//获取车辆信息企业列表
export async function queryVehicleCompanyList(params) {
  return request(`/acloud_new/v2/carInfo/companyList?${stringify(params)}`);
}

// 车辆基本信息列表
export async function queryVehicleInfoList(params) {
  return request(`/acloud_new/v2/carInfo/list?${stringify(params)}`);
}

// 新增车辆基本信息
export async function queryVehicleInfoAdd(params) {
  return request('/acloud_new/v2/carInfo/add', {
    method: 'POST',
    body: params,
  });
}

// 编辑车辆基本信息
export async function queryVehicleInfoEdit(params) {
  return request('/acloud_new/v2/carInfo/edit', {
    method: 'PUT',
    body: params,
  });
}

// 删除车辆基本信息
export async function queryVehicleInfoDelete({ ids }) {
  return request(`/acloud_new/v2/carInfo/delete/${ids}`, {
    method: 'DELETE',
  });
}
