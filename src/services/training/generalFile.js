import { stringify } from 'qs';
import request from '../../utils/request';

// 档案管理-综合-考试档案
export async function queryGeneralList(params) {
  return request(`/acloud_new/v2/education/multipleExamDocument?${stringify(params)}`);
}

// 档案管理-人员档案
export async function queryPersonList(params) {
  return request(`/acloud_new/v2/education/studentDocument?${stringify(params)}`);
}

// 档案管理-考试详情
export async function queryExamDetail(params) {
  return request(`/acloud_new/v2/education/studentExamDocument?${stringify(params)}`);
}

// 档案管理- 考试成绩综合分析报告
export async function queryMultipleReport(params) {
  return request(`/acloud_new/v2/education/multipleExamReport?${stringify(params)}`);
}

// 获取企业列表
export async function queryFileCompanies(params) {
  return request(`/acloud_new/v2/baseInfo/model/companies?${stringify(params)}`);
}
