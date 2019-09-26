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

// 查看卡口点位
export async function getPoint(id) {
  return request(`${URL_PREFIX}/bayonetPoint/${id}`);
}

// 添加卡口点位
export async function postPoint(params) {
  return request(`${URL_PREFIX}/bayonetPoint`, { method: 'POST', body: params });
}

// 编辑卡口点位
export async function putPoint(params) {
  return request(`${URL_PREFIX}/bayonetPoint`, { method: 'PUT', body: params });
}

// 删除卡口点位
export async function deletePoint(ids) {
  return request(`${URL_PREFIX}/bayonetPoint/${ids}`, { method: 'DELETE' });
}

// 获取卡口设备列表
export async function getEquipmentList(params) {
  return request(`${URL_PREFIX}/bayonetEquipmentForPage?${stringify(params)}`);
}

// 查看卡口设备
export async function getEquipment(id) {
  return request(`${URL_PREFIX}/bayonetEquipment/${id}`);
}

// 添加卡口设备
export async function postEquipment(params) {
  return request(`${URL_PREFIX}/bayonetEquipment`, { method: 'POST', body: params });
}

// 编辑卡口设备
export async function putEquipment(params) {
  return request(`${URL_PREFIX}/bayonetEquipment`, { method: 'PUT', body: params });
}

// 删除卡口设备
export async function deleteEquipment(ids) {
  return request(`${URL_PREFIX}/bayonetEquipment/${ids}`, { method: 'DELETE' });
}

// 获取卡口显示屏列表
export async function getScreenList(params) {
  return request(`${URL_PREFIX}/bayonetScreenForPage?${stringify(params)}`);
}

// 查看卡口LED
export async function getScreen(id) {
  return request(`${URL_PREFIX}/bayonetScreen/${id}`);
}

// 添加卡口LED
export async function postScreen(params) {
  return request(`${URL_PREFIX}/bayonetScreen`, { method: 'POST', body: params });
}

// 编辑卡口LED
export async function putScreen(params) {
  return request(`${URL_PREFIX}/bayonetScreen`, { method: 'PUT', body: params });
}

// 删除卡口LED
export async function deleteScreen(ids) {
  return request(`${URL_PREFIX}/bayonetScreen/${ids}`, { method: 'DELETE' });
}

// 获取控制卡类型
export async function getCardTypes(params) {
  return request(`${URL_PREFIX}/bayonetScreen/cardType?${stringify(params)}`);
}

// 获取单位
export async function getUnits(params) {
  return request(`/acloud_new/v2/baseInfo/getCompanyByUser?${stringify(params)}`);
}
