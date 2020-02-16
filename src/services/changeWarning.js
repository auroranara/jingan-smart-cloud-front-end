import { stringify } from 'qs';
import request from '../utils/request';

const URL_PREFIX = '/acloud_new/v2/ci';

// 获取变更列表
export async function getWarningList(params) {
  return request(`${URL_PREFIX}/changeRecord/changeRecordForPage?${stringify(params)}`);
}

// 获取新变更列表
export async function getWarningNewList(params) {
  console.log('new service');
  return request(`/acloud_new/v2/changeWarn/changeEarlyWarnForPage?${stringify(params)}`);
}
