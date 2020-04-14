import { stringify } from 'qs';
import request from '@/utils/request';

export async function getCompany({ id }) {
  return request(`/acloud_new/v2/baseInfo/company/${id}`);
}

export async function getCompanySafety({ id }) {
  return request(`/acloud_new/v2/baseInfo/company/${id}/safetyInfo`);
}

export async function getList(params) {
  return request(`/acloud_new/v2/productFacility/productFacility/page?${stringify(params)}`);
}

export async function getDetail({ id }) {
  return request(`/acloud_new/v2/productFacility/productFacility/${id}`);
}

export async function add(params) {
  return request(`/acloud_new/v2/productFacility/productFacility`, {
    method: 'POST',
    body: params,
  });
}

export async function edit(params) {
  return request(`/acloud_new/v2/productFacility/productFacility`, {
    method: 'PUT',
    body: params,
  });
}

export async function remove({ id }) {
  return request(`/acloud_new/v2/productFacility/productFacility/${id}`, {
    method: 'DELETE',
  });
}

// 获取所属部门
export async function getDepartmentDict(params) {
  return request(`/acloud_new/v2/mobile/getdeptContent.json?${stringify(params)}`);
}

export async function scrap(params) {
  return request(`/acloud_new/v2/productFacility/scrap`, {
    method: 'POST',
    body: params,
  });
}

export async function getCheckList(params) {
  return request(`/acloud_new/v2/productFacility/productFacilityReport/page?${stringify(params)}`);
}

export async function checkAdd(params) {
  return request(`/acloud_new/v2/productFacility/productFacilityReport`, {
    method: 'POST',
    body: params,
  });
}
