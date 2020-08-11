import { stringify } from 'qs';
import request from '@/utils/request';

export async function getList(params) {
  return request(`/acloud_new/v2/areaRiskAnalyze/areaRiskAnalyze/page?${stringify(params)}`);
}

export async function getDetail({ id }) {
  return request(`/acloud_new/v2/areaRiskAnalyze/areaRiskAnalyze/${id}`);
}

export async function add(params) {
  return request(`/acloud_new/v2/areaRiskAnalyze/areaRiskAnalyze`, {
    method: 'POST',
    body: params,
  });
}

export async function edit(params) {
  return request(`/acloud_new/v2/areaRiskAnalyze/areaRiskAnalyze`, {
    method: 'PUT',
    body: params,
  });
}

export async function remove({ id }) {
  return request(`/acloud_new/v2/areaRiskAnalyze/areaRiskAnalyze/${id}`, {
    method: 'DELETE',
  });
}
