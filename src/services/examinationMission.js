import { stringify } from 'qs';
import request from '../utils/request';

// 获取考试任务列表
export async function fetchExamination(params) {
  return request(`/acloud_new/v2/education/examForPage?${stringify(params)}`)
}
