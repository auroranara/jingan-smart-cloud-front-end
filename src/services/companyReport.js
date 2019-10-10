/**
 * 企业自查报表
 */
import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 获取列表
 */
export async function getCompanySelfCheckList(params) {
  return request(`/acloud_new/v2/statistics/companySelfCheck?${stringify(params)}`);
}

/**
 * 获取详情
 */
export async function getSelfCheckDetail(params) {
  return request(`/acloud_new/v2/statistics/getCheckDetail?${stringify(params)}`);
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
  return request(`/acloud_new/v2/statistics/exportNew?${stringify(params)}`);
}
