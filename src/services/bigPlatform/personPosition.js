import request from '@/utils/cockpitRequest';
import { stringify } from 'qs';

const URL_PREFIX = '/acloud_new/v2';

// 初始化位置
export async function queryInitialPositions(params) {
  return request(`${URL_PREFIX}/accessCard/getAllCardLocation?${stringify(params)}`);
}

// 初始化报警列表
export async function queryInitialAlarms(params) {
  return request(`${URL_PREFIX}/location/locationWarningForPage?${stringify(params)}`);
}

// 取消sos
export async function quitSOS(cardId) {
  return request(`${URL_PREFIX}/location/command/delSos/${cardId}`, {
    method: 'POST',
  });
}

// 处理警报
export async function putAlarm(params) {
  return request(`${URL_PREFIX}/location/locationWarning`, {
    method: 'PUT',
    body: params,
  });
}

// 获取区域树
export async function querySectionTree(params) {
  return request(`${URL_PREFIX}/areaInfo/getScreenTree?${stringify(params)}`);
}

// 获取信标列表
export async function queryBeacons(params) {
  return request(`${URL_PREFIX}/beaconPoint/beaconPointForPage?${stringify(params)}`);
}
