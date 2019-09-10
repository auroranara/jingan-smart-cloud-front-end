import { stringify } from 'qs';
import request from '../utils/request';

const URL_PREFIX = '/acloud_new/v2/bayonet';

// 获取卡口企业列表
export async function getCompanyList(params) {
  return request(`${URL_PREFIX}/companyList?${stringify(params)}`);
}

// 获取卡口点位列表
export async function getPointList(params) {
  return request(`${URL_PREFIX}/bayonetPointForPage?${stringify(params)}`);
}

// 获取卡口设备列表
export async function getEquipmentList(params) {
  return request(`${URL_PREFIX}/bayonetEquipmentForPage?${stringify(params)}`);
}

// 获取卡口显示屏列表
export async function getScreenList(params) {
  return request(`${URL_PREFIX}/bayonetScreenForPage?${stringify(params)}`);
}
