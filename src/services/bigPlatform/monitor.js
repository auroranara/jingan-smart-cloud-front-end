import request from '../../utils/request';
import { stringify } from 'qs';

const URL_PREFIX = '/acloud_new/v2';

// 视频
export async function getAllCamera(params) {
  return request(`${URL_PREFIX}/hdf/getAllCamera.json?${stringify(params)}`);
}

// 视频
export async function getStartToPlay(params) {
  return request(`/acloud_new/dai/startToPlayForWeb.json?${stringify(params)}`);
}

export async function getGasCount() {
  return request(`${URL_PREFIX}/monitor/countStatus.json`);
}

export async function getGasList(params) {
  return request(`${URL_PREFIX}/monitor/getRealTimeDataList.json?${stringify(params)}`);
}
