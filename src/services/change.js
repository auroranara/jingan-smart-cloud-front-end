import { stringify } from 'qs';
import request from '@/utils/request';

export async function getList(params) {
  return request(`/acloud_new/v2/changeManage/changeManage/page?${stringify(params)}`);
}

export async function getDetail({ id }) {
  return request(`/acloud_new/v2/changeManage/changeManage/${id}`);
}

export async function add(params) {
  return request(`/acloud_new/v2/changeManage/changeManage`, {
    method: 'POST',
    body: params,
  });
}

export async function edit(params) {
  return request(`/acloud_new/v2/changeManage/changeManage`, {
    method: 'PUT',
    body: params,
  });
}

export async function approve(params) {
  return request(`/acloud_new/v2/changeManage/changeManageApprove`, {
    method: 'POST',
    body: params,
  });
}

export async function getApproveDetail({ applyId }) {
  return request(`/acloud_new/v2/changeManage/approve/${applyId}`);
}
