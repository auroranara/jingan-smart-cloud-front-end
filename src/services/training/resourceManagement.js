import { stringify } from 'qs';
import request from '../../utils/request';

// 获取知识点树
export async function fetchKnowledgeTree(params) {
  return request(`/acloud_new/v2/knowledgeTree/getTree?${stringify(params)}`)
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

// 获取试题详情
export async function fetchQuestionDetail(params) {
  return request(`/acloud_new/v2/education/questions/${params.id}`)
}

// 编辑试题
export async function updateQuestion(params) {
  return request('/acloud_new/v2/education/questions', {
    method: 'PUT',
    body: params,
  })
}

// 删除试题
export async function deleteQuestion(params) {
  return request(`/acloud_new/v2/education/questions/${params.id}`, {
    method: 'DELETE',
  })
}

// 获取文章或课件列表
export async function fetchArticlesOrCourseWare(params) {
  return request(`/acloud_new/v2/education/trainingMaterials/list?${stringify(params)}`)
}

// 新增文章或课件
export async function addArticlesOrCourseWare(params) {
  return request('/acloud_new/v2/education/trainingMaterials/add', {
    method: 'POST',
    body: params,
  })
}

// 修改文章或课件
export async function editArticlesOrCourseWare(params) {
  return request('/acloud_new/v2/education/trainingMaterials/edit', {
    method: 'PUT',
    body: params,
  })
}

// 文章课件预览增加记录
export async function addReadRecord(params) {
  return request(`/acloud_new/v2/education/trainingMaterials/readRecord?${stringify(params)}`)
}

// 文章课件删除
export async function deleteArticleOrCourseWare(params) {
  return request(`/acloud_new/v2/education/trainingMaterials/delete/${params.id}`, {
    method: 'DELETE',
  })
}
