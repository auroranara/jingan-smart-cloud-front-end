import request from '../../utils/request';
import { stringify } from 'qs';

const URL_PREFIX = '/acloud_new/v2';

export async function queryOvAlarmCounts() {
  return request(`${URL_PREFIX}/fireManage/fireProcessCount`);
}

export async function queryOvDangerCounts() {
  return request(`${URL_PREFIX}/sfg/listForMap.json`);
}

export async function queryAlarm(params) {
  return request(`${URL_PREFIX}/automaticFireAlarmSystem/getFireInfo?${stringify(params)}`);
}

export async function querySys() {
  return request(`${URL_PREFIX}/baseInfo/systemAccess`);
}

export async function queryFireTrend() {
  return request(`${URL_PREFIX}/fireManage/fireProcessTrend`);
}

export async function queryDanger() {
  return request(`${URL_PREFIX}//hdfg/hiddenDangerMap.json`);
}

export async function getCompanyFireInfo() {
  return request(`${URL_PREFIX}/automaticFireAlarmSystem/getCompanyFireInfo`);
}

// 视频
export async function getAllCamera(params) {
  return request(`${URL_PREFIX}/hdf/getAllCamera.json?${stringify(params)}`);
}

// 视频
export async function getStartToPlay(params) {
  return request(`/acloud_new/dai/startToPlay?${stringify(params)}`);
}
