import { stringify } from 'qs';
import request from '@/utils/request';

// 获取应急演练计划列表
export async function fetchDrillList(params) {
  return request(`/acloud_new/v2/emergency/emergencyPlan?${stringify(params)}`)
}
