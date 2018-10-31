/**
 * 隐患排查报表
 */
import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 获取隐患列表
 */
export async function getHiddenDangerList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/**
 * 获取隐患详情
 */
export async function getHiddenDangerDetail(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/**
 * 获取所属网格列表
 */
export async function getGridList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/**
 * 获取单位名称列表
 */
export async function getUnitNameList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/**
 * 获取隐患来源列表
 */
export async function getSourceList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/**
 * 获取隐患状态列表
 */
export async function getStatusList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/**
 * 获取业务分类列表
 */
export async function getBusinessTypeList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}

/**
 * 获取隐患等级列表
 */
export async function getLevelList(params) {
  return request(`/acloud_new/v2/baseInfo/companies?${stringify(params)}`);
}
