import { stringify } from 'qs';
import request from '../utils/request';

const URL_PREFIX = '/acloud_new/v2/fireDataInfoTest';

// 测试火灾自动报警系统历史记录(web)
export async function queryAppHistories(params) {
  return request(`${URL_PREFIX}/company/histories?${stringify(params)}`);
}

// 测试查询条件预加载(web)
export async function querySelectCondition() {
  return request(`${URL_PREFIX}/selectCondition`);
}

// 测试详情信息(web)
export async function queryDetail({ id }) {
  return request(`${URL_PREFIX}/detail/${id}`);
}
