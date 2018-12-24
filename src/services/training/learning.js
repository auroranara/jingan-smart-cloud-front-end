import { stringify } from 'qs';
import request from '../../utils/request';

// 文章课件查询列表
export async function queryTrainingMaterials(params) {
  return request(`/acloud_new/v2/education/trainingMaterials/list?${stringify(params)}`);
}

// 获取知识点树
export async function queryKnowledgeTree(params) {
  return request(`/acloud_new/v2/knowledgeTree/getTree?${stringify(params)}`);
}

// 获取企业列表
export async function queryCompanies(params) {
  return request(`/acloud_new/v2/baseInfo/model/companies?${stringify(params)}`);
}

// 文章课件预览增加记录
export async function addReadRecord(params) {
  return request(`/acloud_new/v2/education/trainingMaterials/readRecord?${stringify(params)}`);
}
