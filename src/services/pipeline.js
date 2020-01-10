import request from '@/utils/request';
import { stringify } from 'qs';

// 获取介质列表
export async function getMediumList(params) {
  return request(`/acloud_new/v2/materialInfo/list?${stringify(params)}`);
}

// 获取列表
export async function getList(params) {
  return request(`/acloud_new/v2/ci/industryPipeline/industryPipeline/page?${stringify(params)}`);
}

// 获取详情
export async function getDetail({ id }) {
  return request(`/acloud_new/v2/ci/industryPipeline/industryPipeline/${id}`);
}

// 新增
export async function add(params) {
  return request(`/acloud_new/v2/ci/industryPipeline/industryPipeline`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function edit(params) {
  return request(`/acloud_new/v2/ci/industryPipeline/industryPipeline`, {
    method: 'PUT',
    body: params,
  });
}

// 删除
export async function remove({ id }) {
  return request(`/acloud_new/v2/ci/industryPipeline/industryPipeline/${id}`, {
    method: 'DELETE',
  });
}
