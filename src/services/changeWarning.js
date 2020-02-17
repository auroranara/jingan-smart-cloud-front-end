import { stringify } from 'qs';
import request from '../utils/request';

const URL_PREFIX = '/acloud_new/v2/ci';

// 获取变更列表
export async function getWarningList(params) {
  return request(`${URL_PREFIX}/changeRecord/changeRecordForPage?${stringify(params)}`);
}

// 获取新变更预警列表
export async function getWarningNewList(params) {
  return request(`/acloud_new/v2/changeWarn/changeEarlyWarnForPage?${stringify(params)}`);
}

// 标记评价
export async function evaluate(params) {
  return request('/acloud_new/v2/changeWarn/evaluate', {
    method: 'POST',
    body: params,
  });
}

// 获取变更管理列表
export async function getChangeList(params) {
  return request(`/acloud_new/v2/changeWarn/changeWarnForPage?${stringify(params)}`);
}

// 审批
export async function approve(params) {
  return request('/acloud_new/v2/changeWarn/approve', {
    method: 'POST',
    body: params,
  });
}

// 获取变更管理操作日志列表
export async function getLogList(params) {
  return request(`/acloud_new/v2/changeWarn/changeWarnRecordForPage?${stringify(params)}`);
}
