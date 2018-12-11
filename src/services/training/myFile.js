import { stringify } from 'qs';
import request from '../../utils/request';

// 答案管理-个人档案
export async function querySelfExamDocument(params) {
  return request(`/acloud_new/v2/education/selfExamDocument?${stringify(params)}`);
}
