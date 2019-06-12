import request from '@/utils/request';
import { stringify } from 'qs';

// 获取单位列表
export async function getCompanyList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

// 获取统计类型
export async function getCountTypeDict(params) {
  return request(`/acloud_new/v2/hiddenDanger/reportType?${stringify(params)}`);
}

// 获取统计报表
export async function getCountList(params) {
  return request(`/acloud_new/v2/hiddenDanger/report?${stringify(params)}`);
}

// 获取所属部门
export async function getDepartmentDict(params) {
  return request(`/acloud_new/v2/mobile/getdeptContent.json?${stringify(params)}`);
}

// 获取隐患类型
export async function getHiddenDangerTypeDict() {
  return request(`/acloud_new/v2/mobile/getHiddenContent.json?type=hiddenType`);
}

// 获取检查类型
export async function getCheckTypeDict() {
  return request(`/acloud_new/v2/mobile/getHiddenContent.json?type=inspectionType`);
}

// 获取所属网格
export async function getGridDict() {
  return request(`/acloud_new/v2/gridInfo/getTreeDataById`);
}

// 导出
export async function exportReport(params) {
  return request(`/acloud_new/v2/hiddenDanger/reportExport?${stringify(params)}`);
}
