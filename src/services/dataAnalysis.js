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

// 导出
export async function queryExport(params) {
  // console.log('fetch export...');
  return request(`${URL_PREFIX}/export?${stringify(params)}`);
}

// 获取企业信息
export async function getCompanyInfo(id) {
  return request(`/acloud_new/v2/baseInfo/company/${id}`);
}
