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

// 获取系统日志列表
export async function getLogList(params) {
  // return request(`${URL_PREFIX}/v2/ci/systemSettings/hgSystemSettingsForPage?${stringify(params)}`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          list: [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 },
            { id: 6 },
            { id: 7 },
            { id: 8 },
            { id: 9 },
            { id: 10 },
            { id: 11 },
            { id: 12 },
            { id: 13 },
            { id: 14 },
          ],
          pagination: {
            total: 14,
            ...params,
          },
        },
      });
    }, 1000);
  });
}
