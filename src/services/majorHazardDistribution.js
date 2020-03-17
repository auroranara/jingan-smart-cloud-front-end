import { stringify } from 'qs';
import request from '@/utils/request';

// 获取列表
export async function getList(params) {
  return request(`/acloud_new/v2/baseInfo/getCompanyByUser?${stringify(params)}`);
}

// 获取详情
export async function getDetail({ id }) {
  return request(`/acloud_new/v2/baseInfo/getCompanyByUser/${id}`);
}
