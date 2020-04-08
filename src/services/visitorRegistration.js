/**
 * 访客登记
 */
import request from '@/utils/request';
import { stringify } from 'qs';

// 新增访客卡
export async function queryCardAdd(body) {
  return request('/acloud_new/v2/HGFace/tempCard', {
    method: 'POST',
    body,
  });
}

// 编辑访客卡
export async function queryCardEdit(body) {
  return request('/acloud_new/v2/HGFace/tempCard', {
    method: 'PUT',
    body,
  });
}

// 获取访客卡列表
export async function queryCardList(params) {
  return request(`/acloud_new/v2/HGFace/tempCard/list?${stringify(params)}`);
}

// 新增访客登记
export async function queryVisitorAdd(body) {
  return request('/acloud_new/v2/HGFace/hgTempPerson', {
    method: 'POST',
    body,
  });
}

// 编辑访客登记
export async function queryVisitorEdit(body) {
  return request('/acloud_new/v2/HGFace/hgTempPerson', {
    method: 'PUT',
    body,
  });
}

// 获取访客登记列表
export async function queryVisitorList(params) {
  return request(`/acloud_new/v2/HGFace/tempPerson/page?${stringify(params)}`);
}

// 获取已登记列表
export async function queryHasVisitorList(params) {
  return request(`/acloud_new/v2/HGFace/registrationCard/page?${stringify(params)}`);
}

// 退卡
export async function queryCancelCard({ id }) {
  return request(`/acloud_new/v2/HGFace/returnCard/${id}`);
}
