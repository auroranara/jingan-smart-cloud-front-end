import { stringify } from 'qs';
import request from '../utils/request';

// 获取考试任务列表
export async function fetchExaminationMission(params) {
  return request(`/acloud_new/v2/education/examForPage?${stringify(params)}`);
}

// 获取试卷列表
export async function fetchExamPaper(params) {
  return request(`/acloud_new/v2/education/examPaperForPage?${stringify(params)}`);
}

// 获取考试人员列表
export async function fetchExamStudents(params) {
  return request(`/acloud_new/v2/education/examStudents?${stringify(params)}`);
}

// 新增考试
export async function addExam(params) {
  return request('/acloud_new/v2/education/exam', {
    method: 'POST',
    body: params,
  });
}

// 获取考试
export async function getExam({ id }) {
  return request(`/acloud_new/v2/education/exam/${id}`);
}

// 编辑考试
export async function editExam(params) {
  return request('/acloud_new/v2/education/exam', {
    method: 'PUT',
    body: params,
  });
}

// 删除考试
export async function deleteExam({ id }) {
  return request(`/acloud_new/v2/education/exam/${id}`, {
    method: 'DELETE',
  });
}
