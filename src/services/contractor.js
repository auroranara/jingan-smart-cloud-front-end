import { stringify } from 'qs';
import request from '@/utils/request';

export async function getList(params) {
  return request(`/acloud_new/v2/baseInfo/getCompanyByUser?${stringify(params)}`);
}

export async function getDetail({ id }) {
  return request(`/acloud_new/v2/baseInfo/getCompanyByUser/${id}`);
}

export async function add(params) {
  return request(`/acloud_new/v2/baseInfo/getCompanyByUser`, {
    method: 'POST',
    body: params,
  });
}

export async function edit(params) {
  return request(`/acloud_new/v2/baseInfo/getCompanyByUser`, {
    method: 'PUT',
    body: params,
  });
}

export async function remove({ id }) {
  return request(`/acloud_new/v2/baseInfo/getCompanyByUser/${id}`, {
    method: 'DELETE',
  });
}
