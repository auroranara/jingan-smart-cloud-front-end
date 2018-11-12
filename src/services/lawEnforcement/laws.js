import { stringify } from 'qs';
import request from '../../utils/request';

/* 法律法规库  */

// 列表
export async function queryLawsList(params) {
  return request(`/acloud_new/v2/lawsAndRegulations/lawsAndRegulations?${stringify(params)}`);
}

// 初始化选项
export async function queryLawsOptions() {
  return request(`/acloud_new/v2/lawsAndRegulations/lawsAndRegulations/options`);
}

// 新增
export async function addLaws(params) {
  return request(`/acloud_new/v2/lawsAndRegulations/lawsAndRegulations`, {
    method: 'POST',
    body: params,
  });
}

// 查看详情
export async function queryLawsDetail({ id }) {
  return request(`/acloud_new/v2/lawsAndRegulations/lawsAndRegulations/${id}`);
}

// 编辑
export async function updateLaws(params) {
  return request(`/acloud_new/v2/lawsAndRegulations/lawsAndRegulations`, {
    method: 'PUT',
    body: { ...params },
  });
}

// 删除
export async function deleteLaws(id) {
  return request(`/acloud_new/v2/lawsAndRegulations/lawsAndRegulations/${id}`, {
    method: 'DELETE',
  });
}
