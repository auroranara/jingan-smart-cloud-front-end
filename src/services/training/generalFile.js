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
