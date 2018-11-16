/**
 * 隐患排查报表
 */
import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 获取隐患列表
 */
export async function getHiddenDangerList(params) {
  return request(`/acloud_new/v2/hiddenDanger/hiddenDangerInfoForPage?${stringify(params)}`);
}

/**
 * 获取隐患详情
 */
export async function getHiddenDangerDetail({ id }) {
  return request(`/acloud_new/v2/hiddenDanger/hiddenDangerInfo/${id}`);
}

/**
 * 获取所属网格列表
 */
export async function getGridList() {
  return request(`/acloud_new/v2/gridInfo/getTreeDataById`);
}

/**
 * 导出
 */
export async function exportData(params) {
  return request(`/acloud_new/v2/hiddenDanger/export?${stringify(params)}`);
}

/**
 * 获取文书列表
 */
export async function getDocumentList({ id }) {
  return request(`/acloud_new/v2/hiddenDanger/showDoc/${id}`);
}
