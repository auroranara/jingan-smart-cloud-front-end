import { stringify } from 'qs';
import request from '../utils/request';

const URL_PREFIX = '/acloud_new/v2/education';

// 获取试卷列表
export async function getExamList(params) {
  return request(`${URL_PREFIX}/examStudentPaperForPage?${stringify(params)}`);
}

// 获取侧边栏的题目id
export async function getSide(id) {
  return request(`${URL_PREFIX}/examStudentPaper/questionIndex/${id}`);
}

// 获取题目
export async function getQuestion(params) {
  return request(`${URL_PREFIX}/examStudentPaper/question?${stringify(params)}`);
}

// 保存答案到服务器
export async function saveAnswer(params) {
  // console.log('params', params);
  return request(`${URL_PREFIX}/examStudentPaper/question`, {
    method: 'PUT',
    body: params,
  });
}

// 交卷
export async function handInExam(id) {
  return request(`${URL_PREFIX}/examStudentPaper/submitPaper/${id}`, { method: 'PUT' });
}

// 获取整张考卷
export async function getPaper(id) {
  return request(`${URL_PREFIX}/examStudentPaper/${id}`);
}
