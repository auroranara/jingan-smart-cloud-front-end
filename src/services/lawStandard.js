import request from '@/utils/request';
import { stringify } from 'qs';

// 获取列表
// export async function getList(params) {
//   return request(`/acloud_new/v2/ci/lawEstimate/lawEstimate/page?${stringify(params)}`);
// }
export async function getList (params) {
  return request(`/acloud_new/v2/ci/hgLawsAndRegulations/hgLawsStandardEvaluation/page?${stringify(params)}`);
}

// 获取详情
export async function getDetail ({ id }) {
  return request(`/acloud_new/v2/ci/lawEstimate/lawEstimate/${id}`);
}

// 新增
// export async function add (params) {
//   return request(`/acloud_new/v2/ci/lawEstimate/lawEstimate`, {
//     method: 'POST',
//     body: params,
//   });
// }
export async function add (params) {
  return request('/acloud_new/v2/ci/hgLawsAndRegulations/hgLawsStandardEvaluation', {
    method: 'POST',
    body: params,
  });
}

// 编辑
// export async function edit (params) {
//   return request(`/acloud_new/v2/ci/lawEstimate/lawEstimate`, {
//     method: 'PUT',
//     body: params,
//   });
// }
export async function edit (params) {
  return request('/acloud_new/v2/ci/hgLawsAndRegulations/hgLawsStandardEvaluation', {
    method: 'PUT',
    body: params,
  });
}

// 删除
// export async function remove ({ id }) {
//   return request(`/acloud_new/v2/ci/lawEstimate/lawEstimate/${id}`, {
//     method: 'DELETE',
//   });
// }
export async function remove (params) {
  return request(`/acloud_new/v2/ci/hgLawsAndRegulations/hgLawsStandardEvaluation/${params.id}`, {
    method: 'DELETE',
  });
}
