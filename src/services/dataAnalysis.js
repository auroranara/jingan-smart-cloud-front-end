import { stringify } from 'qs';
import request from '@/utils/request';

const URL_PREFIX = '/acloud_new/v2/iot';

// 公司列表
export async function queryCompanies(params) {
  return request(`${URL_PREFIX}/companyList?${stringify(params)}`);
}

// 数据分析
export async function queryData(params) {
  return request(`${URL_PREFIX}/iotInfoForPage?${stringify(params)}`);
}
