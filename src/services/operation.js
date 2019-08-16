
import request from '@/utils/request';
import { stringify } from 'qs';

// 获取任务列表
export async function getTaskList(params) {
  return request(`/acloud_new/v2/sdf/detailForScreen?${stringify(params)}`);
}

// 获取任务统计
export async function getTaskCount() {
  return request(`/acloud_new/v2/sdf/countNumForScreen`);
}

// 获取企业列表
export async function getUnitList(params) {
  return request(`/acloud_new/v2/sdf/companyList?${stringify(params)}`);
}

// 火警数量统计
export async function getFireCount() {
  return request(`/acloud_new/v2/sdf/getFireData`);
}

// 火警状态统计 饼图
export async function getFirePie(params) {
  return request(`/acloud_new/v2/sdf/getFireDealData?${stringify(params)}`);
}

// 火警状态统计 趋势图
export async function getFireTrend() {
  return request(`/acloud_new/v2/sdf/getFireTrend`);
}

// 火警统计列表
export async function getFireList(params) {
  return request(`/acloud_new/v2/sdf/getFireList?${stringify(params)}`);
}
// 获取大屏消息
export async function getScreenMessage(params) {
  return request(`/acloud_new/v2/sdf/screenMessage?${stringify(params)}`);
}

// 获取视频列表
export async function getVideoList(params) {
  return request(`/acloud_new/v2/hdf/getAllCamera.json?${stringify(params)}`);
}

// 获取实时消息
export async function getMessages(params) {
  return request(`/acloud_new/v2/sdf/screenMessage?${stringify(params)}`);
}

// 获取所有企业的实时消息
export async function getAllScreenMessage(params) {
  return request(`/acloud_new/v2/sdf/screenMessage?${stringify(params)}`);
}

// 获取视频
export async function getCameraMessage(params) {
  return request(`/acloud_new/v2/fireManage/getCameraMessage?${stringify(params)}`);
}

// 获取燃气统计
export async function getGasTotal(params) {
  return request(`/acloud_new/v2/sdgs/countHistorySmoke?${stringify(params)}`);
}
