import request from '@/utils/cockpitRequest';
import { stringify } from 'qs';

const URL_PREFIX = '/acloud_new';

// 获取系统设置列表
export async function fetchSystemSetting(params) {
  return request(`${URL_PREFIX}/v2/ci/systemSettings/hgSystemSettingsForPage?${stringify(params)}`);
}

// 新增系统设置单位
export async function addSystemCompany(body) {
  return request(`${URL_PREFIX}/v2/ci/systemSettings/hgSystemSettings`, {
    method: 'POST',
    body,
  });
}

// 修改系统配置
export async function updateSystemSetting(body) {
  return request(`${URL_PREFIX}/v2/ci/systemSettings/hgSystemSettings`, {
    method: 'PUT',
    body,
  });
}

// 获取登录日志列表
export async function getLoginLogList(params) {
  return request(`http://192.168.10.83:8082/alice/esLog/loginForAcloud?${stringify(params)}`);
}

// 获取操作日志列表
export async function getOperationLogList(params) {
  return request(`http://192.168.10.83:8082/alice/esLog/sqlForAcloud?${stringify(params)}`);
}
