import request from '@/utils/cockpitRequest';
import { stringify } from 'qs';

const URL_PREFIX = '/acloud_new/v2';

// 获取告警信息列表
export async function getMessages(params) {
  return request(`${URL_PREFIX}/screen/screenMessageForGov?screenType=3`);
}

// 获取告警信息列表
export async function getCompanyId(params) {
  return request(`${URL_PREFIX}/screen/elecSafe/getDefaultGridId`);
}

// 获取单位数据
export async function getUnitData(params) {
  return request(`${URL_PREFIX}/screen/elecSafe/companyList`);
}

// 获取企业设备统计数
export async function getDeviceStatusCount(params) {
  return request(`${URL_PREFIX}/screen/elecSafe/deviceStatusCount?${stringify(params)}`);
}
