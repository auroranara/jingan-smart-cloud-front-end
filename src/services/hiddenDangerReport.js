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

/**
 * 新添隐患字典数据
 */
export async function getHiddenContent(params) {
  return request(`/acloud_new/v2/mobile/getHiddenContent.json?${stringify(params)}`);
}

/**
 * 获取隐患地点---建筑物及楼层
 */
export async function getHiddenPosition(params) {
  return request(`/acloud_new/v2/mobile/getPosition.json?${stringify(params)}`);
}

/**
 * 获取隐患部门、整改部门列表
 */
export async function getHiddendeptContent(params) {
  return request(`/acloud_new/v2/mobile/getdeptContent.json?${stringify(params)}`);
}
