import { stringify } from 'qs';
import request from '@/utils/request';

// 获取信标企业列表
export async function fetchBeaconCompanyList(params) {
  return request(`/acloud_new/v2/beaconPoint/beaconPointInfo/companies?${stringify(params)}`)
}

// 获取信标列表
export async function fetchBeaconList(params) {
  return request(`/acloud_new/v2/beaconPoint/beaconPointForPage?${stringify(params)}`)
}

// 新增信标
export async function addBeacon(params) {
  return request('/acloud_new/v2/beaconPoint/beaconPointInfo', {
    method: 'POST',
    body: params,
  })
}

// 编辑信标
export async function editBeacon(params) {
  return request('/acloud_new/v2/beaconPoint/beaconPointInfo', {
    method: 'PUT',
    body: params,
  })
}

// 删除信标
export async function deleteBeacon({ id }) {
  return request(`/acloud_new/v2/beaconPoint/beaconPointInfo/${id}`, {
    method: 'DELETE',
  })
}
