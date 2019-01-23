import { stringify } from 'qs';
import request from '@/utils/request';

const URL_BASE = 'acloud_new/v2/location';

// 获取企业列表
export async function getCompanyList(params) {
  return request(`/acloud_new/v2/beaconPoint/beaconPointInfo/companies?${stringify(params)}`)
}

// 获取报警策略列表
export async function getAlarmList(params) {
  return request(`${URL_BASE}/locationWarningStrategyForPage?${stringify(params)}`)
}
