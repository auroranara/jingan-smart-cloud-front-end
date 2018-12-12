import { stringify } from 'qs';
import request from '../../utils/request';

// 答案管理-个人档案
export async function querySelfExamDocument(params) {
  return request(`/acloud_new/v2/education/selfExamDocument?${stringify(params)}`);
}

// 档案管理- 考试成绩综合分析报告
export async function queryExamReport(params) {
  return request(`/acloud_new/v2/education/studentExamReport?${stringify(params)}`);
}
