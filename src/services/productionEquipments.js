import { stringify } from 'qs';
import request from '../utils/request';

const URL_PREFIX = '/acloud_new/v2/ci';

/** 生产装置 */

// 列表
export async function queryProductEquipList(params) {
  return request(`${URL_PREFIX}/productDevice/productDevice/page?${stringify(params)}`);
}

// 新增
export async function queryProductEquipAdd(params) {
  return request(`${URL_PREFIX}/productDevice/productDevice`, {
    method: 'POST',
    body: params,
  });
}

// 编辑
export async function queryProductEquipEdit(params) {
  return request(`${URL_PREFIX}/productDevice/productDevice`, {
    method: 'PUT',
    body: params,
  });
}

// 删除
export async function queryProductEquipDelete({ ids }) {
  return request(`${URL_PREFIX}/productDevice/productDevice/${ids}`, {
    method: 'DELETE',
  });
}

// 获取高危工艺流程列表
export async function fetchHighRiskProcessList(params) {
  return request(`/acloud_new/v2/ci/dangerTechnology/dangerTechnology/page?${stringify(params)}`);
}
