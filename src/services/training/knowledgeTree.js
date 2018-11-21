import request from '../../utils/cockpitRequest';
import { stringify } from 'qs';

// 新增知识点
export async function knowledgeTreeAdd(params) {
  return request(`/acloud_new/v2/knowledgeTree/add`, {
    method: 'POST',
    body: { ...params },
  });
}

// 列表树查询
export async function getTree(params) {
  return request(`/acloud_new/v2/knowledgeTree/getTree?${stringify(params)}`);
}

// 删除知识点
export async function deleteTree({ id }) {
  return request(`/acloud_new/v2/knowledgeTree/delete/${id}`, {
    method: 'DELETE',
  });
}

// 修改知识点
export async function editTree(params) {
  return request(`/acloud_new/v2/knowledgeTree/edit`, {
    method: 'PUT',
    body: { ...params },
  });
}

// 知识点排序
export async function sortTree(params) {
  return request(`/acloud_new/v2/knowledgeTree/changeSort`, {
    method: 'PUT',
    body: { ...params },
  });
}

// 获取企业列表
export async function getEducationCompanies(params) {
  return request(`/acloud_new/v2/baseInfo/educationCompanies?${stringify(params)}`);
}
