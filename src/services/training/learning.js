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
