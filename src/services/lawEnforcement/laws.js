import { stringify } from 'qs';
import request from '../../utils/request';

/* 法律法规库  */

// 列表
export async function queryLawsList (params) {
  return request(`/acloud_new/v2/lawsAndRegulations/lawsAndRegulations?${stringify(params)}`);
}

// 初始化选项
export async function queryLawsOptions () {
  return request(`/acloud_new/v2/lawsAndRegulations/lawsAndRegulations/options`);
}

// 新增
export async function addLaws (params) {
  return request(`/acloud_new/v2/lawsAndRegulations/lawsAndRegulations`, {
    method: 'POST',
    body: params,
  });
}

// 查看详情
export async function queryLawsDetail ({ id }) {
  return request(`/acloud_new/v2/lawsAndRegulations/lawsAndRegulations/${id}`);
}

// 编辑
export async function updateLaws (params) {
  return request(`/acloud_new/v2/lawsAndRegulations/lawsAndRegulations`, {
    method: 'PUT',
    body: { ...params },
  });
}

// 删除
export async function deleteLaws ({ id }) {
  return request(`/acloud_new/v2/lawsAndRegulations/lawsAndRegulations/${id}`, {
    method: 'POST',
  });
}

// 新-获取法律法规库列表
export async function fetchLawList (params) {
  return request(`/acloud_new/v2/ci/hgLawsAndRegulations/hgLawsAndRegulations/page?${stringify(params)}`);
}

// 新-新增法律法规库
export async function addLaw (body) {
  return request('/acloud_new/v2/ci/hgLawsAndRegulations/hgLawsAndRegulations', {
    method: 'POST',
    body,
  });
}

// 新-编辑法律法规库
export async function editLaw (body) {
  return request('/acloud_new/v2/ci/hgLawsAndRegulations/hgLawsAndRegulations', {
    method: 'PUT',
    body,
  });
}

// 新-删除法律法规库
// 列表
export async function deleteLaw (params) {
  return request(`/acloud_new//v2/ci/hgLawsAndRegulations/hgLawsAndRegulations/${params.id}`, {
    method: 'DELETE',
  });
}
