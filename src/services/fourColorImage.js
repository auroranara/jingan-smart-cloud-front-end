import { stringify } from 'qs';
import request from '../utils/request';

const URL_PREFIX = '/acloud_new/v2/ci';

/** 风险分区 */

// 列表
export async function queryZoneList(params) {
  return request(`${URL_PREFIX}/zone/zoneForPage?${stringify(params)}`);
}

// 添加
export async function addZone(params) {
  return request(`${URL_PREFIX}/zone/zone`, { method: 'POST', body: params });
}

// 编辑
export async function editZone(params) {
  return request(`${URL_PREFIX}/zone/zone`, { method: 'PUT', body: params });
}

// 删除
export async function deleteZone({ ids }) {
  return request(`${URL_PREFIX}/zone/zone/${ids}`, { method: 'DELETE' });
}
