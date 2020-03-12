import { stringify } from 'qs';
import request from '@/utils/request';

export async function getCompany({ id }) {
  return request(`/acloud_new/v2/baseInfo/company/${id}`);
}

export async function getCompanySafety({ id }) {
  return request(`/acloud_new/v2/baseInfo/company/${id}/safetyInfo`);
}

export async function getList(params) {
  return request(
    `/acloud_new/v2/safeCertificateManage/safecertificateManageForPage?${stringify(params)}`
  );
}

export async function getDetail({ id }) {
  return request(`/acloud_new/v2/safeCertificateManage/safecertificateManage/${id}`);
}

export async function add(params) {
  return request(`/acloud_new/v2/safeCertificateManage/safecertificateManage`, {
    method: 'POST',
    body: params,
  });
}

export async function edit(params) {
  return request(`/acloud_new/v2/safeCertificateManage/safecertificateManage`, {
    method: 'PUT',
    body: params,
  });
}

export async function remove({ id }) {
  return request(`/acloud_new/v2/safeCertificateManage/safecertificateManage/${id}`, {
    method: 'DELETE',
  });
}
