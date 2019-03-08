import request from '@/utils/cockpitRequest';
import { stringify } from 'qs';

// 获取信标详情
export async function getDetail({ id }) {
  return request(`/acloud_new/v2/beaconPoint/beaconPointInfo/${id}`);
}

// 获取可选图片列表
export async function getImages(params) {
  return request(`/acloud_new/v2/companyMap/mapSelList?${stringify(params)}`);
}

// 获取系统列表
export async function getSystems(params) {
  return request(`/acloud_new/v2/location/locationSysForPage?${stringify(params)}`);
}

// 新增信标
export async function insertBeacon(params) {
  return request(`/acloud_new/v2/beaconPoint/beaconPointInfo`, {
    method: 'POST',
    body: params,
  });
}

// 编辑信标
export async function updateBeacon(params) {
  return request(`/acloud_new/v2/beaconPoint/beaconPointInfo`, {
    method: 'PUT',
    body: params,
  });
}
