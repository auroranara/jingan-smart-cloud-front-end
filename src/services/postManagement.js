import request from '../utils/request';
import { stringify } from 'qs';

/** 人员在岗在位管理 */

//获取人员信息企业列表
export async function queryPostCompanyList(params) {
  return request(`/acloud_new/v2/ci/companyJob/companyJob/selectCompanyList?${stringify(params)}`);
}

// 人员基本信息列表
export async function queryPostList(params) {
  return request(`/acloud_new/v2/ci/companyJob/companyJob/page?${stringify(params)}`);
}

// 新增人员基本信息
export async function queryPostAdd(params) {
  return request('/acloud_new/v2/ci/companyJob/companyJob', {
    method: 'POST',
    body: params,
  });
}

// 编辑人员基本信息
export async function queryPostEdit(params) {
  return request('/acloud_new/v2/ci/companyJob/companyJob', {
    method: 'PUT',
    body: params,
  });
}

// 删除人员基本信息
export async function queryPostDelete({ id }) {
  return request(`/acloud_new/v2/ci/companyJob/companyJob/${id}`, {
    method: 'DELETE',
  });
}

// 人员基本信息列表
export async function queryPostDetail({ id }) {
  return request(`/acloud_new/v2/ci/companyJob/companyJob/${id}`);
}
