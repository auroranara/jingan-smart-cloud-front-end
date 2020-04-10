import { stringify } from 'qs';
import request from '@/utils/request';

export async function getList(params) {
  return request(`/acloud_new/v2/safetyWork/assess/page?${stringify(params)}`);
}

export async function getDetail({ id }) {
  return request(`/acloud_new/v2/safetyWork/assess/${id}`);
}

export async function add(params) {
  return request(`/acloud_new/v2/safetyWork/assess`, {
    method: 'POST',
    body: params,
  });
}

export async function edit(params) {
  return request(`/acloud_new/v2/safetyWork/assess`, {
    method: 'PUT',
    body: params,
  });
}

export async function remove({ id }) {
  return request(`/acloud_new/v2/safetyWork/assess/${id}`, {
    method: 'DELETE',
  });
}
