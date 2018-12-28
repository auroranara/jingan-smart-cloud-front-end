import request from '@/utils/cockpitRequest';
import { stringify } from 'qs';

const URL_PREFIX = '/acloud_new/v2';

// 初始化位置
export async function queryInitialPositions(params) {
  return request(`${URL_PREFIX}/accessCard/getAllCardLocation?${stringify(params)}`);
}

// 取消sos
export async function postSOS(id) {
  return request(`${URL_PREFIX}/location/command/delSos/${id}`, {
    method: 'POST',
  });
}

// 取消越界
export async function postOverstep(id) {
  return request(`${URL_PREFIX}/accessCard/ignoreOverstep/${id}`, {
    method: 'POST',
  });
}
