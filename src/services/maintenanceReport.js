/**
 * 维保检查报表
 */
import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 获取列表
 */
export async function getMaintenancSelfCheckList(params) {
  return request(`/acloud_new/v2/statistics/maintenanceCheck?${stringify(params)}`);
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
  return request(`/acloud_new/v2/statistics/maintenanceExport?${stringify(params)}`);
}

/**
 * 导出---政府报表
 */
export async function exportGovData(params) {
  return request(`/acloud_new/v2/statistics/govExport?${stringify(params)}`);
}


/**
 * 获取政府监督报表
 */
export async function fetchMaintenanceCheckForGov(params) {
  return request(`/acloud_new/v2/statistics/maintenanceCheckForGov?${stringify(params)}`)
}

export async function fetchAllCheckDetail(params) {
  return request(`/acloud_new/v2/statistics/getCheckDetailForGov?${stringify(params)}`)
}
