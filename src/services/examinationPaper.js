import { stringify } from 'qs';
import request from '../utils/request';

/**
 * 获取试卷列表
 */
export async function getList(params) {
  return request(`/acloud_new/v2/education/examPaperForPage?${stringify(params)}`);
}

/**
 * 获取试卷详情
 */
export async function getDetail({ id }) {
  return request(`/acloud_new/v2/education/examPaper/${id}`);
}

/**
 * 删除试卷
 */
export async function deleteItem({ id }) {
  return request(`/acloud_new/v2/education/examPaper/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 获取规则树
 */
export async function getRuleTree(params) {
  return request(`/acloud_new/v2/knowledgeTree/getPaperQuestionsTree?${stringify(params)}`);
}

/**
 * 新增试卷
 */
export async function addPaper(params) {
  return request(`/acloud_new/v2/education/examPaper`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 编辑试卷
 */
export async function editPaper(params) {
  return request(`/acloud_new/v2/education/examPaper`, {
    method: 'PUT',
    body: params,
  });
}

/**
 * 预览试卷
 */
export async function getPreview({ id }) {
  return request(`/acloud_new/v2/education/examPaperTemplate/${id}`);
}

/**
 * 企业列表
 */
export async function getCompanyList(params) {
  return request(`/acloud_new/v2/baseInfo/educationCompanies?${stringify(params)}`);
}
