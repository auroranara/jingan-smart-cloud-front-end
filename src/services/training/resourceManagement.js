import { stringify } from 'qs';
import request from '../../utils/request';

// 获取知识点树
export async function fetchKnowledgeTree() {
  return request('/acloud_new/v2/knowledgeTree/getTree')
}

// 获取试题列表
export async function fetchQuestions(params) {
  return request(`/acloud_new/v2/education/questionsForPage?${stringify(params)}`)
}

// 添加试题
export async function addQuestion(params) {
  return request('/acloud_new/v2/education/questions', {
    method: 'POST',
    body: params,
  })
}
