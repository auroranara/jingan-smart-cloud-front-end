import { stringify } from 'qs';
import request from '@/utils/request';

export async function getCompany({ id }) {
  return request(`/acloud_new/v2/baseInfo/company/${id}`);
}

export async function getCompanySafety({ id }) {
  return request(`/acloud_new/v2/baseInfo/company/${id}/safetyInfo`);
}

export async function getTypeList(params) {
  return request(`/acloud_new/v2/sys/dict/listOld?${stringify(params)}`);
}

export async function getCompanyTypeList() {
  return request(`/acloud_new/v2/baseInfo/safetySelectInfo`);
}

export async function getList(params) {
  return request(`/acloud_new/v2/accident/accidentInfo/page?${stringify(params)}`);
}

export async function getDetail({ id }) {
  return request(`/acloud_new/v2/accident/accidentInfo/${id}`);
}

export async function add(params) {
  return request(`/acloud_new/v2/accident/accidentInfo`, {
    method: 'POST',
    body: params,
  });
}

export async function edit(params) {
  return request(`/acloud_new/v2/accident/accidentInfo`, {
    method: 'PUT',
    body: params,
  });
}

export async function remove({ id }) {
  return request(`/acloud_new/v2/accident/accidentInfo/${id}`, {
    method: 'DELETE',
  });
}
