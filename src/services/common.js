import { stringify } from 'qs';
import request from '@/utils/request';

/* 查询当前用户权限下的企业列表 */
export async function getCompanyList(params) {
  return request(`/acloud_new/v2/baseInfo/getCompanyByUser?${stringify(params)}`);
}
