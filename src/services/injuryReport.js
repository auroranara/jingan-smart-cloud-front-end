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

export async function getList(params) {
  return request(`/acloud_new/v2/ci/jobInjury/jobInjuryForPage?${stringify(params)}`);
}

export async function getDetail({ id }) {
  return request(`/acloud_new/v2/ci/jobInjury/jobInjury/${id}`);
}

export async function add(params) {
  return request(`/acloud_new/v2/ci/jobInjury/jobInjury`, {
    method: 'POST',
    body: params,
  });
}

export async function edit(params) {
  return request(`/acloud_new/v2/ci/jobInjury/jobInjury`, {
    method: 'PUT',
    body: params,
  });
}

export async function remove({ id }) {
  return request(`/acloud_new/v2/ci/jobInjury/jobInjury/${id}`, {
    method: 'DELETE',
  });
}

// 获取所属部门
export async function getDepartmentDict(params) {
  return request(`/acloud_new/v2/mobile/getdeptContent.json?${stringify(params)}`);
}
